import { Avatar, Box } from "@mui/material";
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"
import cabelloIcon from '../../assets/CABELLO.png'
import maquillajeIcon from '../../assets/MAQUILLAJE.png'
import unaIcon from '../../assets/UÑAS.png'
import spaIcon from '../../assets/SPA.png'

const headers: HeaderInfo[] = [
    {label: 'Tipo de servicio', width: '20%'},
    {label: 'Cantidad', width: '10%'},
    {label: 'Profesionales', width: '10%'},
    {label: 'Subcategorías', width: '40%'},
    {label: 'Gestionar', width: '10%'}
]

const icons: {[key: string]: string} = {
    'Cabello': cabelloIcon,
    'Maquillaje': maquillajeIcon,
    'Uñas': unaIcon,
    'Spa': spaIcon
}

export interface ServiceTypeInfo {
    name: string;
    quantity: number;
    professionals: number;
    subcategories: string[];
}

interface ServiceTableProps {
    serviceTypes?: ServiceTypeInfo[];
    onViewAction?: (type: string) => void;
}

export const ServiceTable = (props: ServiceTableProps) => {
    const buildRows = (serviceType: ServiceTypeInfo): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='center' width='50%' gap={2} justifyContent={'flex-start'}>
                    <Avatar src={icons[serviceType.name]} />
                    {serviceType.name}
                    </Box>,
                <Box display='flex' alignItems='center' width='10%'>{serviceType.quantity}</Box>,
                <Box display='flex' alignItems='center' width='10%'>{serviceType.professionals}</Box>,
                <Box display='flex' alignItems='flex-start' width='70%'>{serviceType.subcategories.join(', ')}</Box>,
                <ManageActionCell color="black" viewAction={() => props.onViewAction?.(serviceType.name)}/>
            ]
        }
    }
    return (
        <TableView headers={headers} rows={props.serviceTypes?.map(buildRows)} showPaginator={false}/>
    )
}