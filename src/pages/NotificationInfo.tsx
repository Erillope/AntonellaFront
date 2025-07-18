import { Box } from "@mui/material"
import { NotificationInputs } from "../components/inputs/notificationInputs/NotificationInputs"
import { useNotification } from "../hooks/useNotification"
import { useParams } from "react-router-dom"

export const NotificationInfo = () => {
    const { id } = useParams<{ id: string }>()
    const { getProps } = useNotification({ id: id ?? '' })
    return (
        <Box width="90%" display="flex" flexDirection="column" alignItems="center">
            <NotificationInputs {...getProps()} disabled={true} />
        </Box>
    )
}