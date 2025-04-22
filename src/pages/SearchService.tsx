import { Box } from "@mui/material"
import { ServiceTable } from "../components/tables/ServiceTable"
import { useSearchService } from "../hooks/useSearchService"
import { useNavigate } from "react-router-dom"

export const SearchService = () => {
    const navigate = useNavigate()
    const { servicesTypeInfo } = useSearchService()
    return (
        <Box width="90%" gap={2} display="flex" flexDirection="column">
            <ServiceTable serviceTypes={servicesTypeInfo} onViewAction={(type) => navigate(`/service/${type}`)} />
        </Box>
    )
}