import { HeaderInfo, RowComponent, TableView } from "./TableView"
import { CalendarMonth } from "@mui/icons-material"
import { Person} from "@mui/icons-material";
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BoxIcon from '@mui/icons-material/Inbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import { Box } from "@mui/material";
import { JSX } from "react";
import { SelectPermissions, SelectPermissionsProps } from "../inputs/PermissionsInput";
import { capitalizeFirstLetter } from "../../api/utils";

const headers: HeaderInfo[] = [
    { label: "Acceso", width: "20%" },
    { label: "Acciones", width: "80%" }
]

export const permissionsIcons: {[key: string]: JSX.Element} = {
    citas: <CalendarMonth/>,
    usuarios: <Person/>,
    servicios: <StorefrontIcon/>,
    productos: <BoxIcon/>,
    roles: <ManageAccountsIcon/>,
    notificaciones: <NotificationsIcon/>,
    chats: <ChatIcon/>,
    pagos: <PaymentIcon/>,
    movil: <SmartphoneIcon/>
}

interface RolePermissionsTableProps {
    permissions?: {[key: string]: SelectPermissionsProps}
    disabled?: boolean
}

export const RolePermissionsTable = (props: RolePermissionsTableProps) => {
    const buildRow = (permission: string): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='flex-start' gap={1} width='100%'>
                    {permissionsIcons[permission.toLowerCase()]}
                    {capitalizeFirstLetter(permission)}
                </Box>,
                <SelectPermissions {...props.permissions?.[permission.toLowerCase()]} disabled={props.disabled}/>
            ]
        }
    }

    return (
        <TableView headers={headers} showPaginator={false}
            rows={Object.keys(props.permissions??{}).map(buildRow)}/>
    )
}