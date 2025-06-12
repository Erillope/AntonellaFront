import { ServiceInputs } from "../components/inputs/serviceInputs/ServiceInputs"
import { useService } from "../hooks/useService"
import { ServiceForm } from "../components/forms/ServiceForm"

export const CreateService = () => {
    const { serviceInputProps, saveServiceInCache } = useService()

    return (
        <ServiceForm width="90%" handleSubmit={saveServiceInCache}>
            <ServiceInputs {...serviceInputProps}/>
        </ServiceForm>
    )
}