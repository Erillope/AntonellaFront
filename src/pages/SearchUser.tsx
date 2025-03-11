import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, Select, MenuItem, FormControl, InputLabel, IconButton
} from "@mui/material";
import "../styles/table.css";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { AuthUserApi, User } from "../api/user_api";
import { Visibility } from '@mui/icons-material';

const roles = ["Todos", "ADMIN", "CLIENTE", "EMPLEADO"];

export const SearchUser = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRole, setSelectedRole] = useState("Todos");
    const authApi = new AuthUserApi();

    useEffect(() => {
        const fetchRoles = async () => {
            const users = await authApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
            setUsers(users);
        }
        fetchRoles();
    }, [])
    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        setUsers(users.reverse());
    };

    return (
        <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
            <FormControl sx={{ m: 2, minWidth: 120 }}>
                <InputLabel>Filtrar por rol</InputLabel>
                <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    {roles.map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                                    {user.gender === "MASCULINO" ? <ManIcon style={{ color: "#16417C", marginRight: 5}} /> : <WomanIcon style={{ color: "#AF234A", marginRight: 5 }} />}
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
                                    <Visibility/>
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
    );

}