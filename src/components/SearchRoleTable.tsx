import { Person, Visibility } from "@mui/icons-material";
import { CalendarMonth } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import {
    TableContainer, Table, TableRow, TableBody, TableCell, TableSortLabel, TableHead,
    TablePagination, Paper, IconButton
} from "@mui/material"
import React, { JSX } from "react";
import { RoleData } from "../hooks/useSearchRole";
import { v4 as uuidv4 } from "uuid";

interface SearchRoleTableProps {
    order: "asc" | "desc";
    handleSort: () => void;
    roles: RoleData[];
    page: number;
    rowsPerPage: number;
    onViewAction: (id: string) => void;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

export const SearchRoleTable: React.FC<SearchRoleTableProps> = ({ order, handleSort, roles, page,
    rowsPerPage, onViewAction, setPage, setRowsPerPage
}) => {
    return (
        <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
            <Table>
                <SearchRoleTableHeader order={order} handleSort={handleSort}/>
                <SearchRoleTableBody roles={roles} page={page} setPage={setPage} onViewAction={onViewAction}
                rowsPerPage={rowsPerPage}/>
            </Table>
            <SearchRoleTablePagination rolesLength={roles.length} page={page} rowsPerPage={rowsPerPage}
            setPage={setPage} setRowsPerPage={setRowsPerPage}/>
        </TableContainer>
    )
}


interface SearchRoleTableHeaderProps {
    order: "asc" | "desc";
    handleSort: () => void;
}

const SearchRoleTableHeader: React.FC<SearchRoleTableHeaderProps> = ({ order, handleSort }) => {
    return (
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
    )
}


interface SearchRoleTableBodyProps {
    roles: RoleData[];
    page: number;
    rowsPerPage: number;
    onViewAction: (id: string) => void;
    setPage: (page: number) => void;
}

const SearchRoleTableBody: React.FC<SearchRoleTableBodyProps> = ({ roles, page, rowsPerPage,
    onViewAction
}) => {
    return (
        <TableBody>
            {roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => (
                <TableRow key={role.name}>
                    <RoleInfoCell name={role.name} />
                    <RoleAccessCell accesses={role.accesses.map((access) => access.access)} />
                    <RoleUserNumCell numUsers={role.numUsers} />
                    <RoleViewCell onViewAction={() => onViewAction(role.id)} />
                </TableRow>
            ))}
        </TableBody>
    )
}


interface SearchRoleTablePaginationProps {
    rolesLength: number;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

const SearchRoleTablePagination: React.FC<SearchRoleTablePaginationProps> = ({ rolesLength, page,
    rowsPerPage, setPage, setRowsPerPage
}) => {
    return (
        <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={rolesLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
    )
}

const RoleInfoCell: React.FC<{ name: string }> = ({ name }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <p>{name}</p>
        </TableCell>
    )
}

const RoleAccessCell: React.FC<{ accesses: string[] }> = ({ accesses }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {accesses.map((access) => (
                    <div key={uuidv4()}>{accessIcon[access]}</div>
                ))}
            </div>
        </TableCell>
    )
}

const RoleUserNumCell: React.FC<{ numUsers: number }> = ({ numUsers }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <p>{numUsers}</p>
        </TableCell>
    )
}

const RoleViewCell: React.FC<{ onViewAction: () => void }> = ({ onViewAction }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <IconButton style={{ color: "#37474F", marginRight: 5 }}
                onClick={onViewAction}>
                <Visibility />
            </IconButton>
        </TableCell>
    )
}

const accessIcon: { [key: string]: JSX.Element } = {
    CITAS: <CalendarMonth style={{ color: "#8B1C3A" }} />,
    USUARIOS: <Person style={{ color: "#8B1C3A" }} />,
    SERVICIOS: <StorefrontIcon style={{ color: "#8B1C3A" }} />,
    PRODUCTOS: <BoxIcon style={{ color: "#8B1C3A" }} />,
    ROLES: <ManageAccountsIcon style={{ color: "#8B1C3A" }} />,
    NOTIFICACIONES: <NotificationsIcon style={{ color: "#8B1C3A" }} />,
    CHATS: <ChatIcon style={{ color: "#8B1C3A" }} />,
    PAGOS: <PaymentIcon style={{ color: "#8B1C3A" }} />,
    MOVIL: <SmartphoneIcon style={{ color: "#8B1C3A" }} />,
}