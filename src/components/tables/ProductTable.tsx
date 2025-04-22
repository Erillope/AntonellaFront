import { Box, Typography } from "@mui/material"
import { Product } from "../../api/product_api"
import { TableView, HeaderInfo, RowComponent, ManageActionCell } from "./TableView"
import { toDateString } from "../../api/utils"

const header: HeaderInfo[] = [
    { label: 'Producto', width: '25%'},
    { label: 'Precio', width: '10%'},
    { label: 'Stock', width: '25%'},
    { label: 'Volumen (mL)', width: '15%'},
    { label: 'Fecha modificación stock', width: '25%'},
    { label: 'Gestionar', width: '10%'}
]

interface ProductTableProps {
    products?: Product[];
    onViewAction?: (id: string) => void;
}

export const ProductTable = (props: ProductTableProps) => {
    const buildRows = (product: Product): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='flex-start' width='50%'>{product.name}</Box>,
                <Typography>${product.price}</Typography>,
                <Typography>{product.stock}</Typography>,
                <Typography>{product.volume}</Typography>,
                <Typography>{toDateString(product.stockModifiedDate)}</Typography>,
                <ManageActionCell viewAction={() => props.onViewAction?.(product.id)} color="black"/>
            ]
        }
    }

    return (
        <TableView headers={header} rows={props.products?.map(buildRows)}/>
    )
}