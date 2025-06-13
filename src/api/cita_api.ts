import { API_URL } from "./config";
import { AbsctractApi } from "./abstract_api";
import axios from "axios";
import { fromDayTimeString, toDate, toDateString, toTimeString } from "./utils";

const orderApiUrl = API_URL + "order/";

export interface DateInfo {
    start: Date;
    end?: Date;
}

export interface Payment {
    employeeId: string;
    percentage: number;
    employeeName?: string
    paymentType?: "porcentaje" | "salario" | "mixto";
}

export interface ServiceItem {
    id?: string;
    orderId?: string;
    type?: string;
    name?: string;
    serviceId: string;
    dateInfo: DateInfo;
    status: 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO'
    basePrice?: number;
    payments: Payment[];
    paymentPercentage?: number;
}

export interface OrderStatus {
    status: 'CONFIRMADO' | 'NO_CONFIRMADO';
    progressStatus: 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO';
    paymentStatus: 'PENDIENTE' | 'PAGADO';
    paymentType: 'EFECTIVO' | 'TARJETA';
}

export interface CreateOrder {
    clientId: string;
    status: OrderStatus;
}

export interface OrderDto {
    id: string;
    clientId: string;
    status: OrderStatus;
    createdDate: Date;
}


export class OrderApi extends AbsctractApi {

    async getOrders(): Promise<OrderDto[] | undefined> {
        try {
            const response = await axios.get(orderApiUrl);
            return response.data.data.map((order: any) => this.map(order));
        } catch (error) {
            this.catchError(error);
        }
    }

    async getServiceItems(orderId: string): Promise<ServiceItem[] | undefined> {
        try {
            const response = await axios.get(orderApiUrl + "service-item/", { params: {order_id: orderId} });
            return response.data.data.map((serviceItem: any) => this.mapServiceItem(serviceItem));
        } catch (error) {
            this.catchError(error);
        }
    }

    async createOrder(order: CreateOrder): Promise<OrderDto | undefined> {
        try {
            const requestData = this.mapCreateOrder(order);
            const response = await axios.post(orderApiUrl, requestData);
            return this.map(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async addServiceItem(serviceItem: ServiceItem): Promise<ServiceItem | undefined> {
        try {
            const requestData = this.mapCreateServiceItem(serviceItem);
            const response = await axios.post(orderApiUrl + "service-item/", requestData);
            return this.mapServiceItem(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    private mapCreateOrder(order: CreateOrder): any {
        return {
            client_id: order.clientId,
            status: {
                status: order.status.status,
                progress_status: order.status.progressStatus,
                payment_status: order.status.paymentStatus,
                payment_type: order.status.paymentType
            }
        }
    }

    private mapCreateServiceItem(serviceItem: ServiceItem): any {
        return {
            order_id: serviceItem.orderId,
            service_id: serviceItem.serviceId,
            date_info: {
                day: toDateString(serviceItem.dateInfo.start),
                start: toTimeString(serviceItem.dateInfo.start),
                end: toTimeString(serviceItem.dateInfo.end??new Date())
            },
            status: serviceItem.status,
            base_price: serviceItem.basePrice,
            payments: serviceItem.payments.map(payment => ({
                employee_id: payment.employeeId,
                percentage: payment.percentage / 100,
            })),
            payment_percentage: serviceItem.paymentPercentage && serviceItem.paymentPercentage / 100,
        }
    }

    private map(order: any): OrderDto {
        return {
            id: order.id,
            clientId: order.client_id,
            status: {
                status: order.status.status,
                progressStatus: order.status.progress_status,
                paymentStatus: order.status.payment_status,
                paymentType: order.status.payment_type
            },
            createdDate: toDate(order.created_date),
        }
    }

    private mapServiceItem(serviceItem: any): ServiceItem {
        const s: ServiceItem = {
            orderId: serviceItem.order_id,
            serviceId: serviceItem.service_id,
            paymentPercentage: serviceItem.payment_percentage !== null ? serviceItem.payment_percentage * 100 : undefined,
            dateInfo: {
                start: fromDayTimeString(serviceItem.date_info.day, serviceItem.date_info.start_time),
                end: serviceItem.date_info.end_time !==null ? fromDayTimeString(serviceItem.date_info.day, serviceItem.date_info.end_time): undefined,
            },
            status: serviceItem.status,
            basePrice: serviceItem.base_price !== null ? serviceItem.base_price : undefined,
            payments: serviceItem.payments.map((payment: any) => ({
                employeeId: payment.employee_id,
                percentage: payment.percentage !== null ? payment.percentage * 100 : undefined,
            })),
        }
        return s   
    }
}