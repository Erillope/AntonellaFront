import { CreateStoreService, StoreService } from "../api/store_service_api";
import { useServiceForm } from "./useServiceForm"
import { StoreServiceApi } from "../api/store_service_api";
import { useState } from "react";
import { ServiceTypeInfo } from "../api/types";
import { successServiceCreatedMessage } from "../utils/alerts";
import { useNavigate } from "react-router-dom";
import { PermissionVerifier } from "../api/verifyPermissions";
import { successServiceUpdatedMessage } from "../utils/alerts";

export interface UseServiceInputsProps {
    notSelectedImageAction?: () => void;
    notHaveCreatePermissions?: () => void;
}

export const useService = ({  }: UseServiceInputsProps) => {
    const navigate = useNavigate()
    const permissionsVerifier = new PermissionVerifier()
    const storeServiceApi = new StoreServiceApi()
    const [services, setServices] = useState<StoreService[]>([])
    const { getCreateData, handleSubmit, getServiceInputsProps, initCreate, categories, configApi, initEditData, getUpdateData, verifyErrors} = useServiceForm() 
    const [typeInfo, setTypeInfo] = useState<ServiceTypeInfo[]>([])
    const [editService, setEditService] = useState<StoreService>({} as StoreService)
    const [editable, setEditable] = useState(false)

    const createService = async(data: CreateStoreService) => {
        const service = await storeServiceApi.createStoreService(data)
        if (service) {
            successServiceCreatedMessage()
            localStorage.removeItem('createServiceData')
            navigate(`/service/search/`)
        }
    }
    
    const deleteService = async(id: string) => {
        await storeServiceApi.deleteStoreService(id)
        navigate(`/service/search/`)
    }

    const updateService = async(id: string) => {
        const data = getUpdateData(id)
        if (verifyErrors()){return}
        const service = await storeServiceApi.update(data)
        if (service) {
            setEditService(service)
            successServiceUpdatedMessage()
        }
    }

    const initSearch = () => {
        const fetchData = async () => {
            const services = await storeServiceApi.getAll()
            if (services) {
                setServices(services)
                initTypeInfo(services)
            }
        }
        fetchData()
    }

    const initTypeInfo = async(services: StoreService[]) => {
        const subCategories = await configApi.getCategoriesConfig()
        const types: ServiceTypeInfo[] = categories.map((category) => {
            return {
                type: category,
                num: services.filter((service) => service.type === category).length,
                employees: 0,
                subTypes: subCategories[category]
            }
        })
        setTypeInfo(types)
    } 

    const getServicesBySubType = (subType: string) => {
        return services.filter((service) => service.subType === subType)
    }

    const initEdit = (id: string) => {
        const fetchData = async () => {
            const service = await storeServiceApi.get(id)
            const permissions = await permissionsVerifier.getServiceAccessPermissions()
            if (!permissions.read){
                navigate('/'); return
            }
            setEditable(permissions.edit)
            if (service) {
                setEditService(service)
                initEditData(service)
            }
        }
        fetchData()
    }

    return {
        getServiceInputsProps,
        handleSubmit,
        createService,
        initCreate,
        getCreateData,
        initSearch,
        typeInfo,
        getServicesBySubType,
        initEdit,
        updateService,
        editService,
        storeServiceApi,
        verifyErrors,
        initEditData,
        deleteService,
        editable
    }
}