import { useState, useEffect, JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, TextField
} from "@mui/material";
import { RoleApi, AccessPermission } from "../api/role_api";
import { AuthUserApi } from "../api/user_api";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, Person } from "@mui/icons-material";
import { CalendarMonth } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SmartphoneIcon from '@mui/icons-material/Smartphone';

const accessIcon: { [key: string]: JSX.Element } = {
    CITAS: <CalendarMonth style={{color: "#8B1C3A"}}/>,
    USUARIOS: <Person style={{color: "#8B1C3A"}}/>,
    SERVICIOS: <StorefrontIcon style={{color: "#8B1C3A"}}/>,
    PRODUCTOS: <BoxIcon style={{color: "#8B1C3A"}}/>,
    ROLES: <ManageAccountsIcon style={{color: "#8B1C3A"}}/>,
    NOTIFICACIONES: <NotificationsIcon style={{color: "#8B1C3A"}}/>,
    CHATS: <ChatIcon style={{color: "#8B1C3A"}}/>,
    PAGOS: <PaymentIcon style={{color: "#8B1C3A"}}/>,
    MOVIL: <SmartphoneIcon style={{color: "#8B1C3A"}}/>,
}

interface RoleData {
    id: string;
    name: string;
    accesses: AccessPermission[];
    numUsers: number;
}

export const SearchRole = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [allRoles, setAllRoles] = useState<RoleData[]>([]);
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchRole, setSearchRole] = useState<string>("");
    const roleApi = new RoleApi();
    const userApi = new AuthUserApi();

    useEffect(() => {
        const fetchRoles = async () => {
            const roles = await roleApi.getRoles();
            roles.sort((a, b) => a.name.localeCompare(b.name));
            const rolesData: RoleData[] = await Promise.all(
                roles.map(async (role) => ({
                    id: role.id,
                    name: role.name,
                    accesses: role.accesses,
                    numUsers: await userApi.getUsersByRole(role.name).then(users => users.length)
                }))
            );
            setAllRoles(rolesData);
            setRoles(rolesData);
        }
        fetchRoles();
    }, [])

    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setRoles(roles.reverse());
    };

    const filterRole = (searchRole: string) => {
        setSearchRole(searchRole);
        console.log(searchRole)
        if (searchRole === "") {
            setRoles(allRoles);
            return;
        }
        const filteredRoles = allRoles.filter((role) => role.name.toLowerCase().startsWith(searchRole.toLowerCase()));
        setRoles(filteredRoles);
        setPage(0);
        setRowsPerPage(5);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "90%" }}>
                <TextField
                    label="Nombre del rol"
                    variant="outlined"
                    margin="normal"
                    style={{ width: "50%" }}
                    value={searchRole}
                    onChange={(e) => filterRole(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon style={{ fontSize: "25px" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </div>
            <div style={{ width: "90%" }}>
                <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
                    <Table>
                        <TableHead style={{ backgroundColor: "#37474F" }}>
                            <TableRow>
                                <TableCell style={{ width: "40%" }}>
                                    <TableSortLabel active direction={order} onClick={handleSort}
                                        className="header">
                                        Roles
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className="header" style={{ width: "40%" }}>Accesos</TableCell>
                                <TableCell className="header" style={{ width: "10%" }}>Num Usuarios</TableCell>
                                <TableCell className="header" style={{ width: "10%" }}>Gestionar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => (
                                <TableRow key={role.name}>
                                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                        <p>{role.name}</p>
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {role.accesses.map((access: AccessPermission) => (
                                                <div>{accessIcon[access.access]}</div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                        <p>{role.numUsers}</p>
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                        <IconButton style={{ color: "#37474F", marginRight: 5 }}
                                            onClick={() => navigate(`/role/search/${role.id}`)}>
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={roles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    />
                </TableContainer>
            </div>
        </div>
    );
}