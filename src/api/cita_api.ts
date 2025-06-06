
export interface DateInfo {
    start: Date;
    end: Date;
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
    basePrice: number;
    payments: Payment[];
    paymentPercentage: number;
}

export interface CreateOrder {
    clientEmail: string;
    serviceItems: ServiceItem[];
    status: {
        status: 'CONFIRMADO' | 'NO_CONFIRMADO'
        progressStatus: 'PENDIENTE' | 'EN_PROGRESO' | 'FINALIZADO'
        paymentStatus: 'PENDIENTE' | 'PAGADO'
        paymentType: 'EFECTIVO' | 'TARJETA'
    }
}