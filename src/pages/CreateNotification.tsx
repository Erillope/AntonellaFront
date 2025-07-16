import { ActionForm } from "../components/forms/ActionForm"
import { NotificationInputs } from "../components/inputs/notificationInputs/NotificationInputs"
import { useNotification } from "../hooks/useNotification"

export const CreateNotification = () => {
    const { getProps } = useNotification()
    
    return <ActionForm width="90%" handleSubmit={() => { }}>
        <NotificationInputs {...getProps()}/>
    </ActionForm>
}