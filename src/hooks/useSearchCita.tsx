import { useEffect, useState } from "react";
import { OrderApi } from "../api/cita_api";
import { OrderItemInfo } from "../components/tables/OrderItemTable";
import { AuthUserApi, User } from "../api/user_api";
import { StoreServiceApi } from "../api/store_service_api";
import { useSelectInput } from "../components/inputs/SelectInput";
import { useDateInput } from "../components/inputs/DateInput";
import { movilCategories } from "../api/config";
import { useInputTextField } from "../components/inputs/InputTextField";

export const useSearchCita = () => {
    const [allOrdersInfo, setAllOrdersInfo] = useState<OrderItemInfo[]>([]);
    const [ordersInfo, setOrdersInfo] = useState<OrderItemInfo[]>([]);
    const clientController = useInputTextField()
    const statusController = useSelectInput()
    const serviceTypeController = useSelectInput();
    const startDate = useDateInput()
    const endDate = useDateInput()
    const orderApi = new OrderApi();
    const userApi = new AuthUserApi();
    const serviceApi = new StoreServiceApi()

    useEffect(() => {
        const fetchOrders = async () => {
            statusController.setValues(['Todos', 'Pendiente', 'En proceso', 'Finalizado']);
            statusController.setValue('Todos');
            serviceTypeController.setValues(['Todos', ...movilCategories]);
            serviceTypeController.setValue('Todos');
            startDate.setValue(null as any)
            endDate.setValue(null as any)
            const orders = await orderApi.getOrders();
            if (!orders) return;
            const ordersInfo = await Promise.all(
                orders.map(async order => {
                    const serviceItems = await orderApi.getServiceItems(order.id) ?? [];
                    const user = await userApi.getUser(order.clientId) ?? {} as User;
                    return await Promise.all(
                        serviceItems.map(async serviceItem => {
                            const service = await serviceApi.get(serviceItem.serviceId);
                            return {
                                serviceItem: { ...serviceItem, name: service?.name, type: service?.type },
                                user,
                            } as OrderItemInfo;
                        })
                    );
                })
            );
            setOrdersInfo(ordersInfo.flat());
            setAllOrdersInfo(ordersInfo.flat());
        };

        fetchOrders();
    }, [])

    const filterOrders = () => {
        const filteredOrders = allOrdersInfo
            .filter(item => includesName(item))
            .filter(item => includesType(item))
            .filter(item => isGreaterThanStartDate(item))
            .filter(item => isLessThanEndDate(item))
            .filter(item => includesStatus(item));
        setOrdersInfo(filteredOrders);
    }

    useEffect(filterOrders, [clientController.value, statusController.value, serviceTypeController.value, startDate.value, endDate.value]);

    const includesName = (item: OrderItemInfo): boolean => {
        if (clientController.isEmpty()) return true
        return item.user.name.toLowerCase().includes(clientController.value.toLowerCase())
    }

    const includesType = (item: OrderItemInfo): boolean => {
        if (serviceTypeController.isEmpty()) return true
        if (serviceTypeController.value === 'Todos') return true
        if (!item.serviceItem.type) return false
        return item.serviceItem.type?.toLowerCase().includes(serviceTypeController.value.toLowerCase())
    }

    const isGreaterThanStartDate = (item: OrderItemInfo): boolean => {
            if (!startDate.value) return true
            return item.serviceItem.dateInfo.start >= startDate.value
        }
    
    const isLessThanEndDate = (item: OrderItemInfo): boolean => {
        if (!endDate.value) return true
        return item.serviceItem.dateInfo.start <= endDate.value
    }

    const includesStatus = (item: OrderItemInfo): boolean => {
        if (statusController.isEmpty()) return true
        if (statusController.value === 'Todos') return true
        return item.serviceItem.status.toLowerCase().includes(statusController.value.toLowerCase())
    }


    return {
        ordersInfo,
        clientProps: clientController.getProps(),
        statusProps: statusController.getProps(),
        serviceTypeProps: serviceTypeController.getProps(),
        startDateProps: startDate.getProps(),
        endDateProps: endDate.getProps(),
    }
}