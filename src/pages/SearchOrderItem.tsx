import { Box } from "@mui/material"
import { OrderItemTable } from "../components/tables/OrderItemTable"
import { useSearchCita } from "../hooks/useSearchCita"
import { SelectInput } from "../components/inputs/SelectInput"
import { DateInput } from "../components/inputs/DateInput"
import { InputTextField2 } from "../components/inputs/InputTextField"


export const SearchOrderItem = () => {
    const searchCitaController = useSearchCita()

    return (
        <Box width="90%" gap={5} display="flex" flexDirection="column">
            <Box display='flex' flexDirection='row' width='100%' gap={3}>
                <Box display='flex' flexDirection='column' width='100%' gap={3}>
                    <InputTextField2 labelText="Cliente" {...searchCitaController.clientProps}/>
                    <SelectInput labelText="Tipo de servicio" {...searchCitaController.serviceTypeProps}/>
                </Box>
                <Box display='flex' flexDirection='column' width='100%' gap={3}>
                    <SelectInput labelText="Estado" {...searchCitaController.statusProps}/>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} gap={2}>
                        <DateInput labelText="Fecha desde" {...searchCitaController.startDateProps}/>
                        <DateInput labelText="Fecha hasta" {...searchCitaController.endDateProps}/>
                    </Box>
                </Box>
            </Box>
            <Box paddingBottom={5}>
                <OrderItemTable info={searchCitaController.ordersInfo} />
            </Box>
            
        </Box>
    )
}