import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { SelectPermissions, SelectPermissionsProps } from "./inputField/SelectPermissions"
import { CalendarMonth } from "@mui/icons-material"
import { Person} from "@mui/icons-material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import React, { JSX } from "react"

interface RolePermissionsTableProps extends RolePermissionsTableBodyProps {}

export const RolePermissionsTable: React.FC<RolePermissionsTableProps> = ({
    onSelectCitasPermissions, onSelectUsuariosPermissions, onSelectServiciosPermissions,
    onSelectProductosPermissions, onSelectRolesPermissions, onSelectNotificacionesPermissions,
    onSelectChatsPermissions, onSelectPagosPermissions, citasPermissions, usuariosPermissions,
    serviciosPermissions, productosPermissions, rolesPermissions, notificacionesPermissions,
    chatsPermissions, pagosPermissions, disabled
}) => {
    return (
        <TableContainer component={Paper} style={{ width: "100%", margin: "auto" }}>
            <Table>
                <RolePermissionsTableHeader />
                <RolePermissionsTableBody 
                    onSelectCitasPermissions={onSelectCitasPermissions}
                    onSelectUsuariosPermissions={onSelectUsuariosPermissions}
                    onSelectServiciosPermissions={onSelectServiciosPermissions}
                    onSelectProductosPermissions={onSelectProductosPermissions}
                    onSelectRolesPermissions={onSelectRolesPermissions}
                    onSelectNotificacionesPermissions={onSelectNotificacionesPermissions}
                    onSelectChatsPermissions={onSelectChatsPermissions}
                    onSelectPagosPermissions={onSelectPagosPermissions}
                    citasPermissions={citasPermissions} usuariosPermissions={usuariosPermissions}
                    serviciosPermissions={serviciosPermissions} productosPermissions={productosPermissions}
                    rolesPermissions={rolesPermissions} notificacionesPermissions={notificacionesPermissions}
                    chatsPermissions={chatsPermissions} pagosPermissions={pagosPermissions} disabled={disabled}
                />
            </Table>
        </TableContainer>
    )
}


const RolePermissionsTableHeader = () => {
    return (
        <TableHead style={{ backgroundColor: "#37474F" }}>
            <TableRow>
                <TableCell style={{ width: "50%" }} className="header">
                    Acceso
                </TableCell>
                <TableCell className="header" style={{ width: "50%" }}>Acciones</TableCell>
            </TableRow>
        </TableHead>
    )
}

interface RolePermissionsTableBodyProps {
    citasPermissions?: string[];
    usuariosPermissions?: string[];
    serviciosPermissions?: string[];
    productosPermissions?: string[];
    rolesPermissions?: string[];
    notificacionesPermissions?: string[];
    chatsPermissions?: string[];
    pagosPermissions?: string[];
    onSelectCitasPermissions?: (permissions: string[]) => void;
    onSelectUsuariosPermissions?: (permissions: string[]) => void;
    onSelectServiciosPermissions?: (permissions: string[]) => void;
    onSelectProductosPermissions?: (permissions: string[]) => void;
    onSelectRolesPermissions?: (permissions: string[]) => void;
    onSelectNotificacionesPermissions?: (permissions: string[]) => void;
    onSelectChatsPermissions?: (permissions: string[]) => void;
    onSelectPagosPermissions?: (permissions: string[]) => void;
    disabled?: boolean;
}

const RolePermissionsTableBody: React.FC<RolePermissionsTableBodyProps> = ({
    onSelectCitasPermissions, onSelectUsuariosPermissions, onSelectServiciosPermissions,
    onSelectProductosPermissions, onSelectRolesPermissions, onSelectNotificacionesPermissions,
    onSelectChatsPermissions, onSelectPagosPermissions, citasPermissions, usuariosPermissions,
    serviciosPermissions, productosPermissions, rolesPermissions, notificacionesPermissions,
    chatsPermissions, pagosPermissions, disabled
}) => {
    const withoutDelete = ["READ", "CREATE", "EDIT"];
    const onlyReadAndCreate = ["READ", "CREATE"];

    return (
        <TableBody>
            <AccessRow accessName="Citas" icon={<CalendarMonth />} availablePermissions={withoutDelete}
            onSelectPermissions={onSelectCitasPermissions} selectedPermissions={citasPermissions} disabled={disabled}/>
            <AccessRow accessName="Usuarios" icon={<Person />} availablePermissions={withoutDelete}
            onSelectPermissions={onSelectUsuariosPermissions} selectedPermissions={usuariosPermissions} disabled={disabled}/>
            <AccessRow accessName="Servicios" icon={<StorefrontIcon />}
            onSelectPermissions={onSelectServiciosPermissions} selectedPermissions={serviciosPermissions} disabled={disabled}/>
            <AccessRow accessName="Productos" icon={<BoxIcon />}
            onSelectPermissions={onSelectProductosPermissions} selectedPermissions={productosPermissions} disabled={disabled}/>
            <AccessRow accessName="Roles" icon={<ManageAccountsIcon />}
            onSelectPermissions={onSelectRolesPermissions} selectedPermissions={rolesPermissions} disabled={disabled}/>
            <AccessRow accessName="Notificaciones" icon={<NotificationsIcon/>}
            availablePermissions={withoutDelete} onSelectPermissions={onSelectNotificacionesPermissions}
            selectedPermissions={notificacionesPermissions} disabled={disabled}/> 
            <AccessRow accessName="Chats" icon={<ChatIcon />} availablePermissions={onlyReadAndCreate}
            onSelectPermissions={onSelectChatsPermissions} selectedPermissions={chatsPermissions} disabled={disabled}/>
            <AccessRow accessName="Pagos" icon={<PaymentIcon />} availablePermissions={onlyReadAndCreate}
            onSelectPermissions={onSelectPagosPermissions} selectedPermissions={pagosPermissions} disabled={disabled}/>
        </TableBody>
    )
}

interface AccessRowProps extends SelectPermissionsProps {
    accessName: string;
    icon: JSX.Element;
    disabled?: boolean;
}

const AccessRow: React.FC<AccessRowProps> = ({ accessName, icon, availablePermissions,
    onSelectPermissions, selectedPermissions, disabled }) => {
    return (
        <TableRow>
            <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {icon}
                    {accessName}
                </div>
            </TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                <SelectPermissions availablePermissions={availablePermissions}
                onSelectPermissions={onSelectPermissions} selectedPermissions={selectedPermissions}
                disabled={disabled}/>
            </TableCell>
        </TableRow>
    )
}