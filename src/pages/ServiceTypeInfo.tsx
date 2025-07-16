import { Box } from "@mui/material"
import { ServiceTypeCard } from "../components/inputs/serviceInputs/ServiceTypeCard"
import { useSearchService } from "../hooks/useSearchService"
import { useNavigate, useParams } from "react-router-dom"

export const ServiceTypeInfo = () => {
    const { type } = useParams()
    const navigate = useNavigate()
    const { services, subCategories } = useSearchService({ category: type ?? '' })
    const subCategory = subCategories[type?.toUpperCase() ?? '']
    return (
        <Box width="90%" gap={2} display="flex" flexDirection="column">
            {subCategory && subCategory.map((type, index) => (
                <ServiceTypeCard key={index} services={services.filter(s => s.subType.toUpperCase() === type)} type={type} onViewAction={(id) => navigate(`/service/search/${id}`)}/>
            ))}
        </Box>
    )
}