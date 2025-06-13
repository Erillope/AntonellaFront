import { Box, Typography } from "@mui/material"
import { ServiceItem } from "../../api/cita_api"
import { User } from "../../api/user_api"
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { toDateString, toTimeString } from "../../api/utils";

const headers: HeaderInfo[] = [
    { label: 'Información de cita', width: '40%' },
    { label: 'Cliente', width: '30%' },
    { label: 'Estado', width: '20%' },
    { label: 'Gestionar', width: '10%' }
]

export interface OrderItemInfo {
    serviceItem: ServiceItem
    user: User
}

export interface OrderItemTableProps {
    info?: OrderItemInfo[];
}

export const OrderItemTable = (props: OrderItemTableProps) => {
    const buildRows = (orderItemInfo: OrderItemInfo): RowComponent => {
        return {
            cells: [
                <ServiceInfoCell serviceItem={orderItemInfo.serviceItem} />,
                <ClientInfoCell user={orderItemInfo.user} />,
                <Box display='flex' alignItems='center' justifyContent='center' width='100%'
                    bgcolor={statusInfo[orderItemInfo.serviceItem.status].color}
                    color='white' height='30px' borderRadius={2}>
                    {statusInfo[orderItemInfo.serviceItem.status].text}
                </Box>,
                <ManageActionCell color="black" viewAction={() => {}} />
            ]
        }
    }
    return <TableView headers={headers} rows={props.info?.map(buildRows)}/>
}


const ServiceInfoCell = ({ serviceItem }: { serviceItem: ServiceItem}) => {
    const priceText = serviceItem.basePrice !== undefined ? `$${serviceItem.basePrice}` : 'Precio no definido';

    return (
        <Box display='flex' flexDirection='row' width='100%' gap={0}>
            <Box display='flex' flexDirection='column' width='100%' gap={1}>
                <Typography variant="body1">{serviceItem.name}</Typography>
                <Typography variant="body1" color="gray">{serviceItem.type}</Typography>
            </Box>
            <Box display='flex' flexDirection='column' width='100%' gap={1}>
                <Box display='flex' flexDirection='row' width='100%' gap={1}>
                    <CalendarMonthIcon />
                    <Typography variant="body1">{toDateString(serviceItem.dateInfo.start)}</Typography>
                </Box>
                <Box display='flex' flexDirection='row' width='100%' gap={1}>
                    <AccessTimeIcon />
                    <Typography variant="body1">{toTimeString(serviceItem.dateInfo.start)}</Typography>
                </Box>
                <Typography variant="body1" color="#F44565" fontWeight={"bold"}>{priceText}</Typography>
            </Box>
        </Box>
    )
}


const ClientInfoCell = ({ user }: { user: User }) => {
    return (
        <Box display='flex' flexDirection='column' width='100%' gap={1}>
            <Typography variant="body1" color="#F44565" fontWeight={"bold"}>{user.name}</Typography>
            <Box display='flex' flexDirection='row' width='100%' gap={1}>
                <EmailIcon />
                <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box display='flex' flexDirection='row' width='100%' gap={1}>
                <PhoneIcon />
                <Typography variant="body1">{user.phoneNumber}</Typography>
            </Box>
        </Box>
    )
}

const statusInfo: {[status: string]: {color: string, text: string} } = {
    'PENDIENTE': {color: '#FBB03B', text: 'Pendiente'},
    'EN PROGRESO': {color: '#39B44A', text: 'En progreso'},
    'FINALIZADO': {color: '#29AAE1', text: 'Finalizado'},
}