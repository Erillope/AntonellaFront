import { Box } from "@mui/material"
import { OrderItemTable } from "../components/tables/OrderItemTable"
import { useSearchCita } from "../hooks/useSearchCita"
import { DynamicAutocomplete } from "../components/inputs/DynamicMultipleSelect"
import { SelectInput } from "../components/inputs/SelectInput"
import { DateInput } from "../components/inputs/DateInput"


export const SearchOrderItem = () => {
    const searchCitaController = useSearchCita()

    return (
        <Box width="90%" gap={5} display="flex" flexDirection="column">
            <Box display='flex' flexDirection='row' width='100%' gap={3}>
                <Box display='flex' flexDirection='column' width='100%' gap={3}>
                    <DynamicAutocomplete labelText="Cliente" />
                    <SelectInput labelText="Tipo de servicio" />
                </Box>
                <Box display='flex' flexDirection='column' width='100%' gap={3}>
                    <SelectInput labelText="Estado" />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} gap={2}>
                        <DateInput labelText="Fecha desde"/>
                        <DateInput labelText="Fecha hasta"/>
                    </Box>
                </Box>
            </Box>
            <OrderItemTable info={searchCitaController.ordersInfo} />
        </Box>
    )
}