import { NotificationApi, Notification, NotificationFilter } from "../api/notification"
import { useEffect, useState } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useSelectInput } from "../components/inputs/SelectInput"
import { useDateInput } from "../components/inputs/DateInput"



export const useSearchNotification = () => {
    const notificationApi = new NotificationApi()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [totalNotifications, setTotalNotifications] = useState<number>(0)
    const [filteredNotifications, setFilteredNotifications] = useState<number>(0)
    const [page, setPage] = useState<number>(0)

    const titleController = useInputTextField()
    const typeController = useSelectInput()
    const startDateController = useDateInput()
    const endDateController = useDateInput()

    useEffect(() => {
        typeController.setValues(['Todos', 'Instantanea', 'Programada'])
        typeController.setValue('Todos');
        startDateController.setValue(null as any);
        endDateController.setValue(null as any);
        const fetchNotifications = async () => {
            const response = await notificationApi.filterNotifications({limit: 5})
            setNotifications(response.notifications)
            setTotalNotifications(response.totalCount)
            setFilteredNotifications(response.totalCount)
        }

        fetchNotifications()
    }, [])

    const getFilters = (offset: number, limit: number): NotificationFilter => {
        return {
            title: titleController.isEmpty() ? undefined : titleController.value,
            type: typeController.value === 'Todos' ? undefined : typeController.value === "" ? undefined : typeController.value,
            startPublishDate: startDateController.value,
            endPublishDate: endDateController.value,
            limit,
            offset,
            onlyCount: false
        }
    }

    const onChangePage = async (page: number) => {
        const notificationsData = await notificationApi.filterNotifications(getFilters(page * 5, 5))
        setPage(page)
        if (notificationsData) {
            setNotifications(notificationsData.notifications)
            setTotalNotifications(notificationsData.totalCount)
            setFilteredNotifications(notificationsData.filteredCount)
        }
    }

    const filter = async () => {
        console.log("Filtering notifications with:")
        const notificationsData = await notificationApi.filterNotifications(getFilters(0, 5))
        setPage(0)
        if (notificationsData) {
            setNotifications(notificationsData.notifications)
            setTotalNotifications(notificationsData.totalCount)
            setFilteredNotifications(notificationsData.filteredCount)
        }
    }

    useEffect(() => {
        filter()
    }, [titleController.value, typeController.value, startDateController.value, endDateController.value])

    return {
        notifications,
        totalNotifications,
        filteredNotifications,
        onChangePage,
        page,
        titleProps: titleController.getProps(),
        typeProps: typeController.getProps(),
        startDateProps: startDateController.getProps(),
        endDateProps: endDateController.getProps(),
    }
}