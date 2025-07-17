import { useEffect } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useNotificationDate } from "../components/inputs/notificationInputs/NotificationDate"
import { NotificationInputsProps } from "../components/inputs/notificationInputs/NotificationInputs"
import { useSelectInput } from "../components/inputs/SelectInput"
import { Notification, NotificationApi } from "../api/notification"

export const useNotification = () => {
    const titleController = useInputTextField()
    const typeController = useSelectInput()
    const bodyController = useInputTextField()
    const dateController = useNotificationDate()
    const notificationApi = new NotificationApi();

    useEffect(() => {
        typeController.setValues(['Instantanea', 'Programada'])
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

    const getNotification = (): Notification => {
        return {
            title: titleController.value,
            body: bodyController.value,
            to: typeController.value,
            type: typeController.value,
            publishDate: dateController.dateController.value ? new Date(dateController.dateController.value) : undefined
        }
    }

    const sendNotification = async() => {
        const notification = getNotification()
        await notificationApi.sendNotification(notification)   
    }

    return {
        getProps,
        sendNotification
    }
}