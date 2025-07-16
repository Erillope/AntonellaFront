import { Box, Typography } from "@mui/material"
import { SelectInput } from "../components/inputs/SelectInput"
import { DateInput } from "../components/inputs/DateInput"
import { InputTextField2 } from "../components/inputs/InputTextField"
import { ProductTable } from "../components/tables/ProductTable"
import { useSearchProduct } from "../hooks/useSearchProduct"
import { useNavigate } from "react-router-dom"

export const SearchProduct = () => {
    const navigate = useNavigate()
    const { nameProps, typeProps, startDateProps, endDateProps, products, page, onChangePage, totalFilteredProducts, totalProducts } = useSearchProduct()

    return (
        <Box width="90%" gap={5} display="flex" flexDirection="column">
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} gap={10}>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'50%'} gap={2}>
                    <InputTextField2 labelText="Nombre del producto" {...nameProps}/>
                    <SelectInput labelText="Tipo de servicio" {...typeProps}/>
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'50%'} gap={2}>
                    <DateInput labelText="Fecha desde" {...startDateProps}/>
                    <DateInput labelText="Fecha hasta" {...endDateProps}/>
                </Box>
            </Box>
            <Box paddingBottom={5} display='flex' alignContent='flex-start' justifyContent='flex-start' flexDirection='column' width='100%' gap={1}>
                <Typography fontSize={20} fontWeight='bold' color="black" width='30%'>
                    Lista de productos {`(${totalProducts})`}
                </Typography>
                <ProductTable products={products} page={page} onChangePage={onChangePage} totalRows={totalFilteredProducts}
                    onViewAction={(id: string) => navigate('/product/search/'+id)}/>
            </Box>
        </Box>
    )
}