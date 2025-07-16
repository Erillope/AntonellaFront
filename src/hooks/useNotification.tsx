import { useEffect } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useNotificationDate } from "../components/inputs/notificationInputs/NotificationDate"
import { NotificationInputsProps } from "../components/inputs/notificationInputs/NotificationInputs"
import { useSelectInput } from "../components/inputs/SelectInput"

export const useNotification = () => {
    const titleController = useInputTextField()
    const typeController = useSelectInput()
    const bodyController = useInputTextField()
    const dateController = useNotificationDate()

    useEffect(() => {
        dateController.dateController.setValue(null as any);
    }, [])

    const getProps = (): NotificationInputsProps => {
        return {
            titleProps: titleController.getProps(),
            typeProps: typeController.getProps(),
            bodyProps: bodyController.getProps(),
            dateProps: dateController.getProps()
        }
    }

    return {
        getProps
    }
}