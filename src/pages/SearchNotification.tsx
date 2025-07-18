import { Box } from "@mui/material"
import { NotificationTable } from "../components/tables/NotificationTable"
import { useSearchNotification } from "../hooks/useSearchNotification"
import { useNavigate } from "react-router-dom"
import { InputTextField2 } from "../components/inputs/InputTextField"
import { SelectInput } from "../components/inputs/SelectInput"
import { DateInput } from "../components/inputs/DateInput"


export const SearchNotification = () => {
    const { notifications, filteredNotifications, onChangePage, page, titleProps, typeProps, startDateProps, endDateProps } = useSearchNotification()
    const navigate = useNavigate()

    return (
        <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={5} alignItems={"center"} >
            <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
                <InputTextField2 labelText="Título" {...titleProps} />
                <SelectInput labelText="Tipo" {...typeProps} />
                <DateInput labelText="Fecha inicio" {...startDateProps} />
                <DateInput labelText="Fecha fin" {...endDateProps} />
            </Box>
            <Box width={'100%'} display="flex" flexDirection="column" alignItems="center" paddingBottom={5}>
                <NotificationTable notifications={notifications} totalRows={filteredNotifications}
                    onChangePage={onChangePage} page={page} onViewAction={(id) => navigate(`/notification/search/${id}`)}
                />
            </Box>
        </Box>
    )
}