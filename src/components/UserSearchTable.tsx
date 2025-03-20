import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from "@mui/icons-material/Man";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Visibility } from '@mui/icons-material';
import { IconButton, Paper, TablePagination } from "@mui/material";
import React from "react";
import { User } from "../api/user_api";

interface UserSearchTableProps {
    order: "asc" | "desc";
    handleSort: () => void;
    users: User[];
    page: number;
    rowsPerPage: number;
    onViewAction: (id: string) => void;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

export const UserSearchTable: React.FC<UserSearchTableProps> = ({ order, handleSort, users, page,
    rowsPerPage, onViewAction, setPage, setRowsPerPage
}) => {
    return (
        <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
            <Table>
                <UserSearchTableHeader order={order} handleSort={handleSort} />
                <UserSearchTableBody users={users} page={page} rowsPerPage={rowsPerPage} onViewAction={onViewAction} />
            </Table>
            <UserSearchTablePagination usersLength={users.length} page={page} rowsPerPage={rowsPerPage}
                setPage={setPage} setRowsPerPage={setRowsPerPage} />
        </TableContainer>
    )
}


interface UserSearchTableHeaderProps {
    order: "asc" | "desc";
    handleSort: () => void;
}

const UserSearchTableHeader: React.FC<UserSearchTableHeaderProps> = ({ order, handleSort }) => {
    return (
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
    )
}


interface UserSearchTableBodyProps {
    users: User[];
    page: number;
    rowsPerPage: number;
    onViewAction: (id: string) => void;
}

const UserSearchTableBody: React.FC<UserSearchTableBodyProps> = ({ users, page, rowsPerPage, onViewAction }) => {
    return (
        <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id}>
                    <UserInfo gender={user.gender} name={user.name} />
                    <UserContact phoneNumber={user.phoneNumber} email={user.email} />
                    <ManageUser onViewAction={() => onViewAction(user.id)} />
                </TableRow>
            ))}
        </TableBody>
    )
}

interface UserSearchTablePaginationProps {
    usersLength: number;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

const UserSearchTablePagination: React.FC<UserSearchTablePaginationProps> = ({ usersLength, page, 
    rowsPerPage, setPage, setRowsPerPage }) => {
    return (
        <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={usersLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
    )
}


interface UserInfoProps {
    gender: string;
    name: string
}

export const UserInfo: React.FC<UserInfoProps> = ({ gender, name }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                {gender === "MASCULINO" ? <ManIcon style={{ color: "#16417C", marginRight: 5 }} /> : <WomanIcon style={{ color: "#AF234A", marginRight: 5 }} />}
                {name}
            </div>
        </TableCell>
    )
}


interface UserContctProps {
    phoneNumber: string;
    email: string;
}

export const UserContact: React.FC<UserContctProps> = ({ phoneNumber, email }) => {
    return (
        <TableCell style={{ color: "#37474F" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon style={{ color: "#AF234A", marginRight: 5 }} />
                {phoneNumber}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <EmailIcon style={{ color: "#AF234A", marginRight: 5 }} />
                {email}
            </div>
        </TableCell>
    )
}


interface ManageUserProps {
    onViewAction: () => void;
}

export const ManageUser: React.FC<ManageUserProps> = ({ onViewAction }) => {
    return (
        <TableCell>
            <IconButton style={{ color: "#37474F", marginRight: 5 }}
                onClick={onViewAction}>
                <Visibility />
            </IconButton>
        </TableCell>
    )
}