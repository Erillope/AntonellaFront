import { useEffect, useState } from "react";
import { OrderApi, OrderDto } from "../api/cita_api";
import { OrderItemInfo } from "../components/tables/OrderItemTable";
import { AuthUserApi, User } from "../api/user_api";
import { StoreServiceApi } from "../api/store_service_api";

export const useSearchCita = () => {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [ordersInfo, setOrdersInfo] = useState<OrderItemInfo[]>([]);
    const orderApi = new OrderApi();
    const userApi = new AuthUserApi();
    const serviceApi = new StoreServiceApi()

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await orderApi.getOrders();
            if (!orders) return;
            setOrders(orders);
            const ordersInfo = await Promise.all(
                orders.map(async order => {
                    const serviceItems = await orderApi.getServiceItems(order.id) ?? [];
                    const user = await userApi.getUser(order.clientId) ?? {} as User;
                    return await Promise.all(
                        serviceItems.map(async serviceItem => {
                            const service = await serviceApi.get(serviceItem.serviceId);
                            return {
                                serviceItem: {...serviceItem, name: service?.name, type: service?.type},
                                order,
                                user,
                            } as OrderItemInfo;
                        })
                    );
                })
            );
            setOrdersInfo(ordersInfo.flat());
        };

        fetchOrders();
    }, [])


    return {
        ordersInfo,
        orders
    }
}