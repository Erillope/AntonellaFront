import { Box } from "@mui/material"
import { StoreService } from "../api/store_service_api";
import { Avatar } from "@mui/material"

interface ServiceTypeCardProps {
    type: string;
    services: StoreService[]
    onViewAction?: (serviceId: string) => void;
}

export const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({ type, services, onViewAction }) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <h2 style={{ fontSize: '16px' }}>{type}</h2>
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" gap={2}
            sx={{ overflowX: "auto", width: "100%"}} bgcolor={'#E0E0E0'}>
            {services.length > 0 ? (
                services.map((service) => (
                    <ServiceCard key={service.id} service={service} onViewAction={onViewAction}/>
                ))
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" padding={2}>
                    <p style={{ fontSize: '14px', color: '#666' }}>No services available</p>
                </Box>
            )}
            </Box>
        </Box>
    )
}


interface ServiceCardProps {
    service: StoreService
    onViewAction?: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewAction }) => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
            sx={{ 
            cursor: "pointer", 
            padding: 2, 
            border: "1px solid #ccc", 
            borderRadius: "8px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
            }} 
            onClick={() => onViewAction?.(service.id)}>
            <Box sx={{ width: 150, height: 150, borderRadius: "8px", overflow: "hidden", marginBottom: 1 }}>
            <Avatar src={service.images[0]} variant="square" sx={{ width: "100%", height: "100%" }} />
            </Box>
            <h3 style={{ fontSize: '14px', margin: '8px 0', textAlign: 'center' }}>{service.name}</h3>
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{service.description}</p>
        </Box>
    )
}