import { useNavigate } from "react-router-dom"
import { notSelectedImageMessage } from "../utils/alerts"
import { UseServiceInputsProps } from "./useService"

interface ServiceFormActions {
}

export const useServiceFormActions = ({}: ServiceFormActions) => {
    const navigate = useNavigate()
    
    const getUseServiceInputsProps = (): UseServiceInputsProps => {
        return {
            notSelectedImageAction: notSelectedImageMessage
        }
    }

    const notHaveCreatePermissions = () => navigate('/')

    const toForm = (getCreateData: () => void) => {
        navigate('/service/form/create/')
        localStorage.setItem('createServiceData', JSON.stringify(getCreateData()))
    }

    const toEditForm = (id: string) => {
        navigate(`/service/form/${id}`)
    }

    return {
        getUseServiceInputsProps,
        toForm,
        notHaveCreatePermissions,
        toEditForm
    }
}