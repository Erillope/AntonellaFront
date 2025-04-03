import { useNavigate, useParams } from "react-router-dom"
import { useService } from "../hooks/useService"
import { useEffect } from "react"
import { Box } from "@mui/material"
import { ServiceTypeCard } from "../components/ServiceTypeCard"
import { v4 as uuidv4 } from 'uuid'

export const ServiceTypeInfo = () => {
    const { type } = useParams()
    const navigate = useNavigate()
    const { initSearch, getServicesBySubType, typeInfo} = useService({})

    useEffect(initSearch, [])

    return (
        <Box display="flex" flexDirection="column" width="100%">
            {typeInfo.find((info) => info.type === type)?.subTypes.map((subType) => (
                <ServiceTypeCard key={uuidv4()} type={subType} services={getServicesBySubType(subType)}
                onViewAction={(id) => navigate(`/service/search/${id}`)}/>
            ))}
        </Box>
    )
}