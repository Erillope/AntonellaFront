import { useService } from "../hooks/useService"
import { ServiceForm } from "../components/forms/ServiceForm"
import { ServiceInputs } from "../components/inputs/serviceInputs/ServiceInputs"
import { useNavigate, useParams } from "react-router-dom"
import { confirmDeleteServiceMessage } from "../utils/alerts"

export const ServiceInfo = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { serviceInputProps, mode, permissions, setMode, discartChanges,
        updateService, deleteService, validate
    } = useService({ mode: 'read', serviceId: id })

    return (
        <ServiceForm width="90%" mode={mode} allowEdit={permissions?.edit} edit={() => setMode('update')} discartChanges={discartChanges} handleSubmit={updateService} allowDelete={permissions?.delete} delete={() => confirmDeleteServiceMessage(deleteService)}
            toForm={() => validate() ? navigate(`/service/search/form/${id}`) : undefined}>
            <ServiceInputs {...serviceInputProps} disabled={mode === 'read'} showExtraInfo />
        </ServiceForm>

    )
}