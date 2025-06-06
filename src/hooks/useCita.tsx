import { DateValue, useCalendar } from "../components/inputs/CalendarInput"
import { CreateCitaFormProps } from "../components/inputs/citaInputs/CreateCitaForm"
import { useEmployeePayments } from "../components/inputs/citaInputs/EmployeePayments"
import { useDynamicMultipleSelect } from "../components/inputs/DynamicMultipleSelect"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useSelectInput } from "../components/inputs/SelectInput"
import { movilCategories } from "../api/config"
import { useEffect, useState } from "react"
import { StoreService, StoreServiceApi } from "../api/store_service_api"
import { usePercentPayment } from "../components/inputs/citaInputs/PercentPayment"
import { AuthUserApi, User } from "../api/user_api"
import { ServiceItem } from "../api/cita_api"
import { Item } from "../components/tables/ItemsTable"
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs"

export interface EmployeeSchedule {
    employeeId: string;
    schedule: DateValue[];
}

export const useCita = () => {
    const clientEmailController = useDynamicMultipleSelect()
    const serviceTypeController = useSelectInput()
    const serviceNameController = useDynamicMultipleSelect()
    const priceController = useInputTextField()
    const percentageController = usePercentPayment()
    const employeePaymentsController = useEmployeePayments()
    const calendarController = useCalendar()
    const serviceApi = new StoreServiceApi()
    const userApi = new AuthUserApi()
    const [allEmployees, setAllEmployees] = useState<User[]>([]);
    const [allServices, setAllServices] = useState<StoreService[]>([]);
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const [schedule, setSchedule] = useState<{ employeeId: string, dateValues: DateValue[] }[]>([]);
    const [discartedSchedule, setDiscardedSchedule] = useState<{ employeeId: string, dateValues: DateValue[] }[]>([]);
    const [viewItemId, setViewItemId] = useState<string>('');
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const addServiceItem = () => {
        if (!validateServiceItemData()) return;
        setServiceItems(prevItems => [...prevItems, getServiceItem()]);
        const schedule = calendarController.values.filter(s => s.color !== 'gray').map(s => {
            return {
                start: s.start,
                end: s.end,
                color: 'gray',
            }
        })
        const newSchedule = employeePaymentsController.employeePayments.map(p => {
            return {
                employeeId: p.employeeEmail,
                dateValues: schedule,
            }
        })
        setSchedule(prev => [...prev, ...newSchedule]);
    }

    const getServiceItem = (): ServiceItem => {
        const calendarIdex = calendarController.values.length - 1;
        return {
            id: uuidv4(),
            serviceId: allServices.find(service => service.name.toLowerCase() === serviceNameController.values[0].toLowerCase())?.id || "",
            paymentPercentage: percentageController.percentContoller.value ? parseFloat(percentageController.percentContoller.value) : 0,
            dateInfo: {
                start: calendarController.values[calendarIdex].start,
                end: calendarController.values[calendarIdex].end,
            },
            status: "PENDIENTE",
            basePrice: parseFloat(priceController.value),
            payments: employeePaymentsController.employeePayments.map(payment => ({
                employeeId: payment.employeeEmail,
                percentage: payment.paymentPercentage,
                employeeName: payment.employeeName,
                paymentType: payment.paymentType
            })),
            type: serviceTypeController.value,
            name: allServices.find(service => service.name.toLowerCase() === serviceNameController.selectedValue.toLowerCase())?.name || "",
        }
    }

    const initServiceItem = (itemId: string) => {
        clearServiceItemsErrors()
        const item = serviceItems.find(i => i.id === itemId);
        setViewItemId(itemId);
        setMode('edit');
        if (!item) return;
        serviceTypeController.setValue(item.type ?? '');
        serviceNameController.setValues(allServices.filter(service => service.type.toLowerCase() === item.type?.toLowerCase()).map(service => service.name));
        serviceNameController.setSelectedValue(item.name ?? '');
        priceController.setValue(item.basePrice.toString());
        percentageController.percentContoller.setValue(item.paymentPercentage.toFixed(2));
        employeePaymentsController.setAllEmployees(allEmployees.filter(e => e.categories?.includes(item.type ?? '')));
        employeePaymentsController.setSelectedValue('');
        employeePaymentsController.setEmployeePayments(item.payments.map(payment => ({
            employeeEmail: payment.employeeId,
            employeeName: payment.employeeName ?? '',
            paymentPercentage: payment.percentage,
            paymentType: payment.paymentType ?? 'porcentaje'
        })));
        const selectedEmployees = item.payments.map(payment => payment.employeeId);
        const employeeSchedule = schedule.filter(s => selectedEmployees.includes(s.employeeId)).map(s => {
            return {
                employeeId: s.employeeId,
                dateValues: s.dateValues.filter(s => !dayjs(s.start).isSame(item.dateInfo.start) || !dayjs(s.end).isSame(item.dateInfo.end))
            }
        });
        const _schedule = joinSchedules(employeeSchedule.map(s => s.dateValues).flat());
        calendarController.setValues([..._schedule, {
            start: item.dateInfo.start,
            end: item.dateInfo.end,
            color: '#F87171'
        }])
    }

    const init = () => {
        const fetchInit = async () => {
            serviceTypeController.setValues(movilCategories);
            await initAllServices();
            await initAllUsers();
        }
        fetchInit();
    }

    useEffect(init, [])

    const initAllServices = async () => {
        const allServices = await serviceApi.getAll();
        if (allServices)
            setAllServices(allServices);
    }

    const initAllUsers = async () => {
        const allUsers = await userApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
        if (allUsers) {
            setAllEmployees(allUsers.filter(user => !!user.dni));
            clientEmailController.setValues(
                allUsers.filter(user => user.dni === undefined).map(user => user.email)
            );
        }
    }

    const initConcreteService = (type: string) => {
        const serviceType = type;
        const concreteServices = allServices.filter(service => service.type.toLowerCase() === serviceType.toLowerCase());
        serviceNameController.setValues(concreteServices.map(service => service.name));
    }

    const initConcreteUsers = (type: string) => {
        const serviceType = type;
        const employees = allEmployees.filter(e => e.categories?.includes(serviceType));
        employeePaymentsController.setEmployeePayments([]);
        employeePaymentsController.setSelectedValue('');
        employeePaymentsController.setAllEmployees(employees);
    }

    const updatedServiceType = (type: string) => {
        calendarController.setValues(calendarController.values.filter(s => s.color !== 'gray'))
        serviceNameController.clearInput();
        initConcreteService(type);
        initConcreteUsers(type);
    }

    useEffect(() => percentageController.setPrice(priceController.value ? parseFloat(priceController.value) : 0), [priceController.value])

    useEffect(() => employeePaymentsController.setTotalPayment(percentageController.value), [percentageController.value])

    const getCreateCitaProps = (): CreateCitaFormProps => {
        return {
            serviceTypeProps: {
                ...serviceTypeController.getProps(),
                onSelect: (value: string) => {
                    serviceTypeController.setValue(value);
                    updatedServiceType(value);
                }
            },
            serviceNameProps: serviceNameController.getAutocompleteProps(),
            priceProps: priceController.getProps(),
            percentageProps: percentageController.getProps(),
            employeePaymentsProps: {
                ...employeePaymentsController.getProps(),
                onAdd: (employeeEmail: string) => {
                    employeePaymentsController.addEmployeePayment(employeeEmail);
                    const selectedEmployees = [...employeePaymentsController.employeePayments.map(payment => payment.employeeEmail), employeeEmail];
                    const employeeSchedule = schedule.filter(s => selectedEmployees.includes(s.employeeId));
                    let _schedule = joinSchedules(employeeSchedule.map(s => s.dateValues).flat());
                    const pink = calendarController.values.find(s => s.color !== 'gray');
                    let discarted = [...discartedSchedule];
                    if (pink) {
                        _schedule = _schedule.filter(s => !(s.start.getTime() === pink.start.getTime() && s.end.getTime() === pink.end.getTime()));
                        setSchedule(schedule.map(s => {
                            if (s.dateValues.some(d => d.start.getTime() === pink.start.getTime() && d.end.getTime() === pink.end.getTime())) {
                                if (!discarted.some(d => d.employeeId === s.employeeId)) {
                                    discarted = [...discarted, {
                                        employeeId: s.employeeId,
                                        dateValues: [pink]
                                    }]
                                }
                            }
                            return {
                                employeeId: s.employeeId,
                                dateValues: s.dateValues.filter(d => !(d.start.getTime() === pink.start.getTime() && d.end.getTime() === pink.end.getTime()))
                            }
                        }))
                        setDiscardedSchedule(discarted);
                    }
                    calendarController.setValues(_schedule);
                },
                onDelete: (employeeEmail: string) => {
                    employeePaymentsController.deleteEmployeePayment(employeeEmail);
                    const selectedEmployees = employeePaymentsController.employeePayments.filter(payment => payment.employeeEmail !== employeeEmail).map(payment => payment.employeeEmail);
                    const employeeSchedule = schedule.filter(s => selectedEmployees.includes(s.employeeId));
                    let _schedule = joinSchedules(employeeSchedule.map(s => s.dateValues).flat());

                    calendarController.setValues(_schedule);
                },
            },
            calendarProps: {
                values: calendarController.values,
                onSelect: (start: Date, end: Date) => {
                    calendarController.addValue(start, end);
                },
                onRemove: (start: Date, end: Date) => {
                    const value = calendarController.values.find(v => v.start.getTime() === start.getTime() && v.end.getTime() === end.getTime());
                    if (!value) return;

                    const isEditable = value.color !== 'gray';
                    if (isEditable) {
                        calendarController.removeValue(start, end);
                    }
                },
                selectable: isSelectable(),
                error: calendarController.error,
            },
            onCreateSubmit: addServiceItem,
            onEditSubmit: () => updateServiceItem(viewItemId),
            onDiscard: () => initServiceItem(viewItemId),
            onDelete: () => deleteServiceItem(viewItemId),
            mode: mode,
            
        }
    }

    const updateServiceItem = (itemId: string) => {
        if (!validateServiceItemData()) return;
        const oldItem = serviceItems.find(i => i.id === itemId);
        if (!oldItem) return;
        const item = getServiceItem();
        item.payments.map(p => p.employeeId).forEach(e => {
            const oldEmployeeSchedule = schedule.filter(s => s.employeeId === e).map(s => s.dateValues).flat();
            if (!oldEmployeeSchedule) return;
            let updatedEmployeeSchedule = oldEmployeeSchedule.filter(s => !(s.start.getTime() === oldItem.dateInfo.start.getTime() && s.end.getTime() === oldItem.dateInfo.end.getTime()));
            updatedEmployeeSchedule = [...updatedEmployeeSchedule, {
                start: item.dateInfo.start,
                end: item.dateInfo.end,
                color: 'gray'
                }
            ]
            let newSchedule = schedule.filter(s => s.employeeId !== e);
            newSchedule = [...newSchedule, {
                employeeId: e,
                dateValues: updatedEmployeeSchedule
            }];
            setSchedule(newSchedule);

        })
        setServiceItems(prevItems => prevItems.map(i => i.id === itemId ? item : i));
    }

    const deleteServiceItem = (itemId: string) => {
        const item = serviceItems.find(i => i.id === itemId);
        if (!item) return;
        const employeeSchedule = schedule.map(s => {
            if (item.payments.map(p => p.employeeId).includes(s.employeeId)) {
                return {
                    employeeId: s.employeeId,
                    dateValues: s.dateValues.filter(d => !(d.start.getTime() === item.dateInfo.start.getTime() && d.end.getTime() === item.dateInfo.end.getTime()))
                }
            }
            else {
                return s;
            }
        })
        setSchedule(employeeSchedule);
        setServiceItems(prevItems => prevItems.filter(i => i.id !== itemId));
    }

    const isSelectable = (): boolean => {
        if (calendarController.values.filter(s => s.color === 'gray').length > 0) {
            return calendarController.values.filter(s => s.color !== 'gray').length === 0;
        }
        return calendarController.isEmpty();
    }

    const clearServiceItem = () => {
        serviceTypeController.clearInput();
        serviceNameController.clearInput();
        priceController.clearInput();
        percentageController.clearInput();
        employeePaymentsController.clearInputs();
        calendarController.clearInput();
    }

    const clearServiceItemsErrors = () => {
        serviceTypeController.setError("");
        serviceNameController.setError("");
        priceController.setError("");
        percentageController.percentContoller.setError("");
        employeePaymentsController.clearError();
        calendarController.clearError();
    }

    const validateServiceItemData = (): boolean => {
        clearServiceItemsErrors();
        let isValid = true;
        if (serviceTypeController.value === "") {
            serviceTypeController.setError("Seleccione un tipo de servicio");
            isValid = false;
        }
        if (serviceNameController.selectedValue === "") {
            serviceNameController.setError("Seleccione un servicio");
            isValid = false;
        }
        if (priceController.value === "") {
            priceController.setError("Ingrese un precio");
            isValid = false;
        }
        if (percentageController.percentContoller.value === "") {
            percentageController.percentContoller.setError("Ingrese un porcentaje");
            isValid = false;
        }
        if (employeePaymentsController.employeePayments.length === 0) {
            employeePaymentsController.setError("Debe agregar al menos un empleado");
            isValid = false;
        }
        if (calendarController.values.filter(s => s.color !== 'gray').length === 0) {
            calendarController.setError("Seleccione un horario");
            isValid = false;
        }
        if (employeePaymentsController.employeePayments.reduce((acc, payment) => acc + payment.paymentPercentage, 0) !== 100 && employeePaymentsController.employeePayments.filter(payment => payment.paymentType !== "salario").length > 0) {
            employeePaymentsController.setError("La suma de los porcentajes de pago debe ser 100%");
            isValid = false;
        }
        return isValid
    }

    const getItems = (): Item[] => {
        return serviceItems.map(item => {
            return {
                id: item.id ?? '',
                name: item.name??'',
                type: item.type ?? '',
            }
        })
    }

    const joinSchedules = (schedules: DateValue[]): DateValue[] => {
        if (schedules.length === 0) return [];
        const sorted = schedules.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
        const result: DateValue[] = [];
        let current = { ...sorted[0] };
        for (let i = 1; i < sorted.length; i++) {
            const next = sorted[i];
            if (current.end >= next.start) {
                current.end = new Date(Math.max(current.end.getTime(), next.end.getTime()));
            } else {
                result.push(current);
                current = { ...next };
            }
        }
        result.push(current);
        return result;
    };

    return {
        getCreateCitaProps,
        initNewServiceItem: () => {
            clearServiceItem();
            clearServiceItemsErrors();
            setMode('create');
            serviceNameController.setValues([])
            discartedSchedule.forEach(s => {
                setSchedule(prev => prev.map(d => {
                    if (d.employeeId === s.employeeId) {
                        return {
                            employeeId: d.employeeId,
                            dateValues: [...d.dateValues, ...s.dateValues.map(v => {
                                return {
                                    start: v.start,
                                    end: v.end,
                                    color: 'gray'
                                }
                            })]
                        }
                    }
                    return d;
                }))
            })
            setDiscardedSchedule([]);
        },
        getItems,
        initServiceItem,
        serviceItems
    }
}