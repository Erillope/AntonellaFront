import { Box } from "@mui/material"
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"

const headers: HeaderInfo[] = [
    {label: "Servicio", width: "20%"},
    {label: "Tipo", width: "20%"},
    {label: "Gestionar", width: "10%"}
]

const serviceTypeColor = (serviceType: string) => {
    if (serviceType === "cabello") return "#29AAE1"
    if (serviceType === "uñas") return '#39B44A'
    if (serviceType === "maquillaje") return '#FBB03B'
    if (serviceType === "spa") return '#E596A9'
}

export interface Item {
    id: string;
    name: string;
    type: string;
}

export interface ItemsTableProps {
    items?: Item[];
    onSelectItem?: (itemId: string) => void;
}

export const ItemsTable = (props: ItemsTableProps) => {
    const buildRows = (item: Item): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='flex-start' width='100%' justifyContent={'center'}>{item.name}</Box>,
                <Box display='flex' alignItems='center' justifyContent='center' width='30%'
                    bgcolor={serviceTypeColor(item.type.toLowerCase())} 
                    color='white' height='30px' borderRadius={2}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Box>,
                <ManageActionCell color="black" viewAction={() => props.onSelectItem?.(item.id)}/>
            ]
        }
    }

    return (
        <TableView headers={headers} rows={props.items?.map(buildRows)}/>
    )
}