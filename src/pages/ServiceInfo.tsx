import { useParams } from "react-router-dom"
import { EditServiceForm } from "../components/EditServiceForm"
import { ServiceInputs } from "../components/inputField/ServiceInputs"
import { useService } from "../hooks/useService"
import { useServiceFormActions } from "../hooks/useServiceFormActions"
import { useEffect } from "react"
import { confirmDeleteRoleMessage } from "../utils/alerts"

export const ServiceInfo = () => {
    const { id } = useParams()
    const { getUseServiceInputsProps, toEditForm } = useServiceFormActions({})
    const { getServiceInputsProps, initEdit, updateService, handleSubmit, editService, initEditData,
        deleteService, editable
     } = useService({ ...getUseServiceInputsProps() })
    
    useEffect(() => initEdit(id??''), [])

    return (
        <EditServiceForm handleSubmit={() => handleSubmit(() => updateService(id??''))}
            toForm={() => toEditForm(id??'')} discart={() => initEditData(editService)}
            del={() => confirmDeleteRoleMessage(() => deleteService(id??''))} editable={editable}>
            <ServiceInputs {...getServiceInputsProps()} disabled={!editable}/>
        </EditServiceForm>
    )
}