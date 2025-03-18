import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, Select, MenuItem, FormControl, InputLabel, IconButton, TextField, InputAdornment
} from "@mui/material";
import "../styles/table.css";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { AuthUserApi, User } from "../api/user_api";
import { RoleApi } from "../api/role_api";
import { Visibility } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchUser = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("Todos");
    const authApi = new AuthUserApi();
    const roleApi = new RoleApi();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dni, setDni] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            const allUsers = await authApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
            const roles = (await roleApi.getRoles()).map(role => role.name);
            roles.unshift("Todos");
            setUsers(allUsers);
            setAllUsers(allUsers);
            setRoles(roles);
        }
        fetchRoles();
    }, [])

    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setUsers(users.reverse());
    };

    const selectRole = (role: string) => {
        setSelectedRole(role);
        if (role === "Todos") {
            setUsers(allUsers);
        }
        else {
            setUsers(allUsers.filter(user => user.roles?.includes(role)));
        }
        clearFilters();
    }

    const filterByName = () => {
        const filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setName(name);
    }

    const filterByEmail = () => {
        const filteredUsers = allUsers.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setEmail(email);
    }

    const filterByPhoneNumber = () => {
        const filteredUsers = allUsers.filter(user => user.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase()));
        setUsers(filteredUsers);
        clearFilters();
        setPhoneNumber(phoneNumber);
    }

    const filterByDni = () => {
        const filteredUsers = allUsers.filter(user => user.dni?.toLowerCase().includes(dni.toLowerCase()));
        setUsers(filteredUsers)
        clearFilters();
        setDni(dni);
    }

    const clearFilters = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setDni("");
        setPage(0);
        setRowsPerPage(5);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: "90%", display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ width: "70%", display: "flex", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 0 50%" }}>
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "90%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={filterByName}>
                                                    <SearchIcon style={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                        <div style={{ flex: "1 0 50%" }}>
                            <TextField
                                label="celular"
                                variant="outlined"
                                margin="normal"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{ width: "90%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={filterByPhoneNumber}>
                                                    <SearchIcon style={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                        <div style={{ flex: "1 0 50%" }}>
                            <TextField
                                label="email"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: "90%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={filterByEmail}>
                                                    <SearchIcon style={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                        <div style={{ flex: "1 0 50%" }}>
                            <TextField
                                label="cedula"
                                variant="outlined"
                                margin="normal"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                style={{ width: "90%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={filterByDni}>
                                                    <SearchIcon style={{ fontSize: "25px" }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <FormControl sx={{ m: 2, width: "90%" }}>
                            <InputLabel>Filtrar por rol</InputLabel>
                            <Select value={selectedRole} onChange={(e) => selectRole(e.target.value)}>
                                {roles.map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
                <Table>
                    <TableHead style={{ backgroundColor: "#37474F" }}>
                        <TableRow>
                            <TableCell style={{ width: "40%" }}>
                                <TableSortLabel active direction={order} onClick={handleSort}
                                    className="header">
                                    Usuario
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className="header" style={{ width: "40%" }}>Contacto</TableCell>
                            <TableCell className="header" style={{ width: "20%" }}>Gestionar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <TableRow key={user.id}>
                                <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {user.gender === "MASCULINO" ? <ManIcon style={{ color: "#16417C", marginRight: 5 }} /> : <WomanIcon style={{ color: "#AF234A", marginRight: 5 }} />}
                                        {user.name}
                                    </div>

                                </TableCell>
                                <TableCell style={{ color: "#37474F" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <PhoneIcon style={{ color: "#AF234A", marginRight: 5 }} />
                                        {user.phoneNumber}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <EmailIcon style={{ color: "#AF234A", marginRight: 5 }} />
                                        {user.email}
                                    </div>

                                </TableCell>
                                <TableCell>
                                    <IconButton style={{ color: "#37474F", marginRight: 5 }}
                                        onClick={() => navigate(`/user/search/${user.id}`)}>
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
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                />
            </TableContainer>
        </div>


    );

}