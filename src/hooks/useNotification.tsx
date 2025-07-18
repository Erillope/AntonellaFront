import { useEffect } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useNotificationDate } from "../components/inputs/notificationInputs/NotificationDate"
import { NotificationInputsProps } from "../components/inputs/notificationInputs/NotificationInputs"
import { useSelectInput } from "../components/inputs/SelectInput"
import { Notification, NotificationApi } from "../api/notification"
import { loadingMessage, successNotificationCreatedMessage } from "../utils/alerts"
import { PermissionVerifier } from "../api/verifyPermissions"
import { useNavigate } from "react-router-dom"

export const useNotification = (props?: { id: string }) => {
    const titleController = useInputTextField()
    const typeController = useSelectInput()
    const bodyController = useInputTextField()
    const dateController = useNotificationDate()
    const notificationApi = new NotificationApi();
    const permissionVerifier = new PermissionVerifier()
    const navigate = useNavigate()

    useEffect(() => {
        typeController.setValues(['Instantanea', 'Programada'])
        typeController.setValue('Instantanea');
        dateController.clearInputs();
        dateController.clearError();
        dateController.dateController.setValue(null as any);
        dateController.setDisabled(true);
        if (props?.id) {
            const init = async () => {
                const permissions = await permissionVerifier.getNotificationAccessPermissions();
                if (!permissions?.create) { navigate('/') }
                const notification = await notificationApi.getById(props.id);
                if (notification) {
                    initNotification(notification);
                }
            }
            init();
        }
    }, [])

    const getProps = (): NotificationInputsProps => {
        return {
            titleProps: titleController.getProps(),
            typeProps: {
                ...typeController.getProps(),
                onSelect: (value: string) => {
                    typeController.setValue(value);
                    if (value === 'Instantanea') {
                        dateController.clearInputs();
                        dateController.clearError();
                        dateController.dateController.setValue(null as any);
                        dateController.setDisabled(true);
                    }
                    else {
                        dateController.setDisabled(false);
                    }
                }
            },
            bodyProps: bodyController.getProps(),
            dateProps: dateController.getProps()
        }
    }

    const initNotification = (notificación: Notification) => {
        titleController.setValue(notificación.title);
        bodyController.setValue(notificación.body);
        typeController.setValue(notificación.type ?? 'Instantanea');
        if (notificación.type === 'Programada' && notificación.publishDate) {
            dateController.dateController.setValue(notificación.publishDate);
            dateController.hourController.setValue((new Date(notificación.publishDate)).getHours().toString());
            dateController.minutesController.setValue((new Date(notificación.publishDate)).getMinutes().toString());
        }
    }

    const getNotification = (): Notification => {
        return {
            title: titleController.value,
            body: bodyController.value,
            to: 'client',
            type: typeController.value,
            publishDate: typeController.value === 'Programada' ? dateController.getDate() : undefined
        }
    }

    const sendNotification = async () => {
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