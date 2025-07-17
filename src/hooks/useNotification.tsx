import { useEffect } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useNotificationDate } from "../components/inputs/notificationInputs/NotificationDate"
import { NotificationInputsProps } from "../components/inputs/notificationInputs/NotificationInputs"
import { useSelectInput } from "../components/inputs/SelectInput"
import { Notification, NotificationApi } from "../api/notification"
import { loadingMessage, successNotificationCreatedMessage } from "../utils/alerts"

export const useNotification = () => {
    const titleController = useInputTextField()
    const typeController = useSelectInput()
    const bodyController = useInputTextField()
    const dateController = useNotificationDate()
    const notificationApi = new NotificationApi();

    useEffect(() => {
        typeController.setValues(['Instantanea', 'Programada'])
        typeController.setValue('Instantanea');
        dateController.dateController.setValue(null as any);
    }, [])

    useEffect(() => {
        if (typeController.value === 'Instantanea') {
            dateController.clearInputs();
            dateController.dateController.setValue(null as any);
            dateController.setDisabled(true);
        }
        else {
            dateController.setDisabled(false);
        }
    }, [typeController.value])

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
            publishDate: typeController.value === 'Programada' ? dateController.getDate() : undefined
        }
    }

    const sendNotification = async() => {
        if (!validate()) return;
        const notification = getNotification()
        loadingMessage("Creando notificación...");
        await notificationApi.sendNotification(notification)
        clearInputs();
        successNotificationCreatedMessage()
    }

    const validate = (): boolean => {
        clearErrors();
        let isValid = true;
        if (titleController.isEmpty()) {
            titleController.setError('El título es obligatorio');
            isValid = false;
        }
        if (bodyController.isEmpty()) {
            bodyController.setError('El cuerpo es obligatorio');
            isValid = false;
        }
        if (typeController.isEmpty()) {
            typeController.setError('El tipo es obligatorio');
            isValid = false;
        }
        if (typeController.value === 'Programada') {
            isValid = dateController.validate() && isValid;
        }
        return isValid;
    }

    const clearInputs = () => {
        titleController.clearInput();
        bodyController.clearInput();
        dateController.clearInputs();
        dateController.dateController.setValue(null as any);
    }

    const clearErrors = () => {
        titleController.clearError();
        bodyController.clearError();
        typeController.clearError();
        dateController.clearError();
    }

    return {
        getProps,
        sendNotification
    }
}