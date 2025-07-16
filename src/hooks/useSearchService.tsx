import { useEffect, useState } from "react"
import { StoreService, StoreServiceApi } from "../api/store_service_api"
import { PermissionVerifier } from "../api/verifyPermissions"
import { useNavigate } from "react-router-dom"
import { ServiceTypeInfo } from "../components/tables/ServiceTable"
import { AuthUserApi } from "../api/user_api"
import { movilCategories } from "../api/config"
import { ConfigApi } from "../api/config_api"
import { capitalizeFirstLetter } from "../api/utils"

export const useSearchService = (props?: {category: string}) => {
    const navigate = useNavigate()
    const storeServiceApi = new StoreServiceApi()
    const userApi = new AuthUserApi()
    const permissionsVerifier = new PermissionVerifier()
    const configApi = new ConfigApi()
    const [services, setServices] = useState<StoreService[]>([])
    const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({})
    const [serviceTypeInfo, setServiceTypeInfo] = useState<ServiceTypeInfo[]>([])
    
    useEffect(() => {
        const init = async () => {
            const permissions = await permissionsVerifier.getServiceAccessPermissions()
            if (!permissions.read) { navigate('/'); return }
            const subCategories = await configApi.getCategoriesConfig()
            setSubCategories(subCategories)
            const services = await storeServiceApi.getByType(props?.category ?? '')
            setServices(services??[])
            const serviceTypeInfo = await getAllServiceTypeInfo(subCategories)
            setServiceTypeInfo(serviceTypeInfo)
        }
        init()
    }, [])

    const getAllServiceTypeInfo = async(subCategories: {[key: string]: string[];}): Promise<ServiceTypeInfo[]> => {
        return Promise.all(movilCategories.map(async (c) => await getServiceTypeInfo(c, subCategories)))
    }

    const getServiceTypeInfo = async(category: string, subCategories: {[key: string]: string[];}): Promise<ServiceTypeInfo> => {
        const subCategory = subCategories[category.toUpperCase()] ?? []
        const userCategories = await userApi.filterUsers({ serviceCategory: category, onlyCount: true}).then(data => data?.filteredCount ?? 0)
        return {
            name: category,
            quantity: await storeServiceApi.getByType(category).then(data => data?.length ?? 0),
            professionals: userCategories,
            subcategories: subCategory.map(capitalizeFirstLetter)
        }
    }

    return {
        servicesTypeInfo: serviceTypeInfo,
        subCategories,
        services
    }
}