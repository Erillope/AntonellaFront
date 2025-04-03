import { useEffect } from "react"
import { CreateServiceForm } from "../components/CreateServiceForm"
import { ServiceInputs } from "../components/inputField/ServiceInputs"
import { useService } from "../hooks/useService"
import { useServiceFormActions } from "../hooks/useServiceFormActions"

export const CreateService = () => {
    const { getUseServiceInputsProps, toForm, notHaveCreatePermissions} = useServiceFormActions({})
    const { getServiceInputsProps, getCreateData, initCreate, handleSubmit, verifyErrors } = useService({...getUseServiceInputsProps()})
    
    useEffect(() => initCreate(notHaveCreatePermissions), [])

    return (
        <CreateServiceForm handleSubmit={() => handleSubmit(() => {
            if (verifyErrors()) return
            toForm(getCreateData)
        })}>
            <ServiceInputs {...getServiceInputsProps()} />
        </CreateServiceForm>
    )
}