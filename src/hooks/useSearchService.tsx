import { useEffect, useState } from "react"
import { StoreService, StoreServiceApi } from "../api/store_service_api"
import { PermissionVerifier } from "../api/verifyPermissions"
import { useNavigate } from "react-router-dom"
import { ServiceTypeInfo } from "../components/tables/ServiceTable"
import { AuthUserApi, User } from "../api/user_api"
import { movilCategories } from "../api/config"
import { ConfigApi } from "../api/config_api"
import { capitalizeFirstLetter } from "../api/utils"

export const useSearchService = () => {
    const navigate = useNavigate()
    const storeServiceApi = new StoreServiceApi()
    const userApi = new AuthUserApi()
    const permissionsVerifier = new PermissionVerifier()
    const configApi = new ConfigApi()
    const [services, setServices] = useState<StoreService[]>([])
    const [users, setUsers] = useState<User[]>()
    const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({})
    
    useEffect(() => {
        const init = async () => {
            const permissions = await permissionsVerifier.getServiceAccessPermissions()
            if (!permissions.read) { navigate('/'); return }
            const services = await storeServiceApi.getAll()
            const subCategories = await configApi.getCategoriesConfig()
            const user = await userApi.filterUsers({ orderBy: "name", orderDirection: "ASC" })
            setSubCategories(subCategories)
            if (user) {
                setUsers(user)
            }
            if (services) {
                setServices(services)
            }
        }
        init()
    }, [])

    const getAllServiceTypeInfo = (): ServiceTypeInfo[] => {
        return movilCategories.map(getServiceTypeInfo)
    }

    const getServiceTypeInfo = (category: string): ServiceTypeInfo => {
        const subCategory = subCategories[category.toUpperCase()] ?? []
        return {
            name: category,
            quantity: services?.filter((service) => capitalizeFirstLetter(service.type) === category).length??0,
            professionals: users?.filter((user) => user.categories?.includes(category)).length??0,
            subcategories: subCategory.map(capitalizeFirstLetter)
        }
    }

    return {
        services,
        servicesTypeInfo: getAllServiceTypeInfo(),
        subCategories
    }
}