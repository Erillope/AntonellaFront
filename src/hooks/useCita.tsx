import { useEffect, useState } from "react"
import { CalendarInputProps, DateValue, useCalendar } from "../components/inputs/CalendarInput"
import { useEmployeePayments } from "../components/inputs/citaInputs/EmployeePayments"
import { usePercentPayment } from "../components/inputs/citaInputs/PercentPayment"
import { useDynamicMultipleSelect } from "../components/inputs/DynamicMultipleSelect"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useSelectInput } from "../components/inputs/SelectInput"
import { CitaFormInputsProps } from "../components/inputs/citaInputs/CitaForm"
import { movilCategories } from "../api/config"
import { StoreServiceApi, Question, StoreService } from "../api/store_service_api"
import { AuthUserApi } from "../api/user_api"
import { AnswerProps, ImageAnswerProps, ImageChoiceAnswerProps, TextAnswerProps, TextChoiceAnswerProps } from "../components/inputs/citaInputs/AnswerForm"
import { OrderApi, ServiceItem } from "../api/cita_api"
import { v4 as uuid } from 'uuid';
import { Item } from "../components/tables/ItemsTable"
import { useSwitchInput } from "../components/inputs/SwitchInput"
import { notSelectedItemMessage, successOrderCreatedMessage } from "../utils/alerts"

export interface AnswerData {
    itemId: string;
    answers: AnswerProps[];
}

export const useCita = (initId?: string) => {
    const clientController = useDynamicMultipleSelect()
    const paymentTypeController = useSelectInput()
    const orderStatusController = useSwitchInput()
    const orderPaymentStatusController = useSwitchInput()
    const clientConfirmedController = useSwitchInput()
    const serviceTypeController = useSelectInput()
    const serviceNameController = useDynamicMultipleSelect()
    const priceController = useInputTextField()
    const percentageController = usePercentPayment()
    const employeePaymentsController = useEmployeePayments()
    const calendarController = useCitaCalendar()
    const [services, setServices] = useState<StoreService[]>()
    const [newAnswers, setNewAnswers] = useState<AnswerProps[]>([])
    const [answerError, setAnswerError] = useState<string>('');
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    const [answersData, setAnswersData] = useState<AnswerData[]>([]);
    const [serviceItemId, setServiceItemId] = useState<string | undefined>(undefined);
    const [loadedAnswers, setLoadedAnswers] = useState<AnswerProps[]>([]);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const serviceApi = new StoreServiceApi();
    const userApi = new AuthUserApi();
    const citaApi = new OrderApi();

    const init = async () => {
        serviceTypeController.setValues(movilCategories);
        const clients = await userApi.filterUsers({ onlyClients: true }).then(data => data?.users?? []);
        clientController.setValues(clients.map(c => c.name));
        paymentTypeController.setValues(['Efectivo', 'Tarjeta'])
        if (initId) {
            setMode('edit');
            setServiceItemId(initId);
            const service = await citaApi.get(initId);
            const storeService = await serviceApi.get(service?.serviceId || '');
            if (service && storeService) {
                service.type = storeService.type;
                service.name = storeService.name;
                await Promise.all(service.payments.map(async p => {
                    p.employeeName = (await userApi.getUser(p.employeeId))?.name;
                }))
                initServiceItemData(service);
            }
            const answers = await citaApi.getAnswers(initId || '')
            if (!answers) return;
            let answerProps: AnswerProps[] = answers.map(a => {
                const question = storeService?.questions.find(q => q.id === a.questionId)!;
                const type = mapType(a.inputType, a.choiceType ?? 'TEXT');
                const textAnswer = Array.isArray(a.answer) ? undefined : a.answer;
                const images = Array.isArray(a.answer) ? a.answer : undefined;
                return {
                    type: type,
                    ...mapAnswer(question, type, textAnswer, images)
                }
            });
            setLoadedAnswers(answerProps);
        }
    }

    useEffect(() => { init() }, [])

    const initServiceItem = () => {
        setMode('create');
        clearServiceItemForm();
        clearServiceItemError();
        employeePaymentsController.setAllEmployees([]);
        setAnswerError('');
        setNewAnswers([]);
    }

    const clearServiceItemForm = () => {
        serviceTypeController.clearInput();
        serviceNameController.clearInput();
        priceController.clearInput();
        percentageController.clearInput();
        employeePaymentsController.clearInputs();
        calendarController.clearInput();
    }

    const clearServiceItemError = () => {
        serviceTypeController.clearError();
        serviceNameController.clearError();
        priceController.clearError();
        percentageController.percentContoller.clearError();
        employeePaymentsController.clearError();
        calendarController.calendarController.clearError();
    }

    const getCitaProps = (): CitaFormInputsProps => {
        const selectedServicie = services?.find(s => s.name === serviceNameController.selectedValue);
        return {
            serviceTypeProps: {
                ...serviceTypeController.getProps(),
                onSelect: onSelectServiceType,
            },
            serviceNameProps: {
                ...serviceNameController.getAutocompleteProps(),
                onSelect: onSelectServiceName,
            },
            priceProps: {
                ...priceController.getProps(),
                onValueChange: onChangePrice
            },
            percentageProps: percentageController.getProps(),
            employeePaymentsProps: {
                ...employeePaymentsController.getProps(),
                onAdd: (employeeName: string) => {
                    const employeeEmail = employeePaymentsController.allEmployees.find(e => e.name === employeeName)?.email ?? '';
                    employeePaymentsController.addEmployeePayment(employeeEmail);
                }
            },
            calendarProps: calendarController.getProps(),
            priceRange: selectedServicie && {
                min: selectedServicie.prices[0].minPrice,
                max: selectedServicie.prices[selectedServicie.prices.length - 1]?.maxPrice
            },
        }
    }

    useEffect(() => {
        const dates: DateValue[] = []
        if (mode === 'create') {
            if (employeePaymentsController.employeePayments.length === 0) { calendarController.clearOtherDates(); return; }
            employeePaymentsController.employeePayments.map(p => p.employeeEmail).forEach(email => {
                serviceItems.filter(item => item.payments.some(payment => payment.employeeId === email)).forEach(item => {
                    dates.push({
                        start: item.dateInfo.start,
                        end: item.dateInfo.end ?? new Date(),
                    })
                })
            })
            calendarController.setOthers(dates);
        }
        if (mode === 'edit') {
            if (employeePaymentsController.employeePayments.length === 0) { calendarController.clearOtherDates(); return; }
            employeePaymentsController.employeePayments.map(p => p.employeeEmail).forEach(email => {
                serviceItems.filter(item => item.payments.some(payment => payment.employeeId === email) && item.id !== serviceItemId).forEach(item => {
                    dates.push({
                        start: item.dateInfo.start,
                        end: item.dateInfo.end ?? new Date(),
                    })
                })
            })
            calendarController.setOthers(dates);
        }
    }, [employeePaymentsController.employeePayments])

    const addServiceItem = (): boolean => {
        if (!validateServiceItem()) return false;
        const serviceItem = getServiceItem();
        const answers = getAnswers()
        setServiceItems(prev => [...prev, serviceItem]);
        setAnswersData(prev => [...prev, { itemId: serviceItem.id ?? '', answers: answers }]);
        return true;
    }

    const getServiceItem = (): ServiceItem => {
        return {
            id: uuid(),
            type: serviceTypeController.value,
            name: serviceNameController.selectedValue,
            serviceId: services?.find(s => s.name === serviceNameController.selectedValue)?.id || '',
            dateInfo: {
                start: calendarController.selectedDate?.start || new Date(),
                end: calendarController.selectedDate?.end || new Date(),
            },
            status: 'PENDIENTE',
            basePrice: parseFloat(priceController.value),
            payments: employeePaymentsController.employeePayments.map(p => {
                return {
                    employeeId: p.employeeEmail,
                    percentage: p.paymentPercentage??0,
                    employeeName: p.employeeName,
                    paymentType: p.paymentType
                }
            }),
            paymentPercentage: percentageController.percentContoller.value ? parseFloat(percentageController.percentContoller.value) : 0,
        }
    }

    const getAnswers = (): AnswerProps[] => {
        if (mode === 'create') {
            return newAnswers
        }
        if (mode === 'edit') {
            return loadedAnswers
        }
        return []
    }

    const getItems = (): Item[] => {
        return serviceItems.map(item => {
            return {
                id: item.id ?? '',
                name: item.name ?? '',
                type: item.type ?? '',
            }
        })
    }

    const createOrder = async () => {
        if (!validateOrder()) return;
        const client = (await userApi.filterUsers({ exactName: clientController.selectedValue ?? '', onlyClients: true }).then(data => data?.users??[]))[0]
        const order = await citaApi.createOrder({
            clientId: client.id,
            status: {
                status: orderStatusController.active ? 'CONFIRMADO' : 'NO_CONFIRMADO',
                progressStatus: 'EN_PROGRESO',
                paymentStatus: orderPaymentStatusController.active ? 'PENDIENTE' : 'PAGADO',
                paymentType: paymentTypeController.value.toUpperCase() as 'EFECTIVO' | 'TARJETA',
                clientConfirmed: clientConfirmedController.active ? 'CONFIRMADO' : 'NO_CONFIRMADO',
            }
        })
        for (const item of serviceItems) {
            const selectedService = services?.find(s => s.name === item.name);
            const serviceItem = await citaApi.addServiceItem({
                orderId: order?.id ?? '',
                serviceId: selectedService?.id ?? '',
                dateInfo: item.dateInfo,
                status: item.status,
                basePrice: item.basePrice,
                payments: await Promise.all(
                    item.payments.map(async p => {
                        return {
                            employeeId: (await userApi.getUser(p.employeeId))?.id ?? '',
                            percentage: p.percentage,
                        };
                    })
                ),
                paymentPercentage: item.paymentPercentage,
            })
            for (const answer of answersData) {
                for (const a of answer.answers) {
                    const text = a.textAnswer?.answer || a.textChoiceAnswer?.selected || a.imageChoiceAnswer?.selected || ''
                    await citaApi.createAnswer({
                        clientId: client.id,
                        questionId: a.textAnswer?.questionId || a.imageAnswer?.questionId || a.textChoiceAnswer?.questionId || a.imageChoiceAnswer?.questionId || '',
                        serviceItemId: serviceItem?.id ?? '',
                        answer: {
                            text: text.trim() === '' ? undefined : text,
                            images: a.imageAnswer?.images,
                        }
                    })
                }
            }
        }
        successOrderCreatedMessage();
        clearOrderErrors();
        clearOrder()
    }

    const clearOrder = () => {
        clientController.clearInput();
        paymentTypeController.clearInput();
        orderStatusController.setActive(false);
        orderPaymentStatusController.setActive(false);
        clientConfirmedController.setActive(false);
    }

    const validateOrder = (): boolean => {
        clearOrderErrors();
        let isValid = true;
        if (clientController.selectedValue.trim() === '') {
            clientController.setError('Debe seleccionar un cliente');
            isValid = false;
        }
        if (paymentTypeController.value === '') {
            paymentTypeController.setError('Debe seleccionar un metodo de pago');
            isValid = false;
        }
        if (serviceItems.length === 0) {
            notSelectedItemMessage()
            isValid = false;
        }
        return isValid;
    }

    const clearOrderErrors = () => {
        clientController.clearError();
        paymentTypeController.clearError();
    }

    const onDeleteServiceItem = () => {
        setLoadedAnswers([]);
        setServiceItems(prev => prev.filter(item => item.id !== serviceItemId));
        setAnswersData(prev => prev.filter(data => data.itemId !== serviceItemId));
    }

    const editServiceItem = (): boolean => {
        if (!validateServiceItem()) return false;
        const serviceItem = getServiceItem();
        const answers = getAnswers();
        setServiceItems(prev => prev.map(item => item.id === serviceItemId ? { ...serviceItem, id: item.id } : item));
        setAnswersData(prev => prev.map(data => data.itemId === serviceItemId ? { ...data, answers: answers } : data));
        return true;
    }

    const discartChanges = () => {
        const serviceItem = serviceItems.find(item => item.id === serviceItemId);
        if (serviceItem) {
            initServiceItemData(serviceItem);
            setLoadedAnswers(answersData.find(data => data.itemId === serviceItemId)?.answers || []);
        }
    }

    const loadServiceItem = (id: string) => {
        setServiceItemId(id);
        setMode('edit');
        const serviceItem = serviceItems.find(item => item.id === id);
        if (serviceItem) {
            initServiceItemData(serviceItem);
            setLoadedAnswers(answersData.find(data => data.itemId === id)?.answers || []);
        }

    }

    const initServiceItemData = (serviceItem: ServiceItem) => {
        serviceTypeController.setValue(serviceItem.type ?? '')
        serviceNameController.setSelectedValue(serviceItem.name ?? '');
        priceController.setValue(serviceItem.basePrice?.toString() ?? '');
        percentageController.percentContoller.setValue(serviceItem.paymentPercentage?.toFixed(2) ?? '');
        employeePaymentsController.setEmployeePayments(serviceItem.payments.map(p => ({
            employeeEmail: p.employeeId,
            employeeName: p.employeeName ?? '',
            paymentPercentage: p.percentage,
            paymentType: p.paymentType ?? 'porcentaje'
        })));
        percentageController.setPrice(serviceItem.basePrice ?? 0);
        employeePaymentsController.setTotalPayment(percentageController.value)
        calendarController.selectDate(serviceItem.dateInfo.start, serviceItem.dateInfo.end ?? new Date());
    }

    const validateServiceItem = (): boolean => {
        clearServiceItemError();
        setAnswerError('');
        let isValid = true;
        if (serviceTypeController.value === '') {
            serviceTypeController.setError('Debe seleccionar un tipo de servicio');
            isValid = false;
        }
        if (serviceNameController.selectedValue === '') {
            serviceNameController.setError('Debe seleccionar un nombre de servicio');
            isValid = false;
        }
        if (priceController.value === '') {
            priceController.setError('Debe ingresar un precio');
            isValid = false;
        }
        if (employeePaymentsController.employeePayments.length === 0) {
            employeePaymentsController.setError("Debe agregar al menos un empleado");
            isValid = false;
        }
        if (calendarController.selectedDate === undefined) {
            calendarController.calendarController.setError("Debe seleccionar una fecha");
            isValid = false;
        }
        if (employeePaymentsController.employeePayments.reduce((acc, payment) => acc + (payment.paymentPercentage??0), 0) !== 100 && employeePaymentsController.employeePayments.filter(payment => payment.paymentType !== "salario").length > 0) {
            employeePaymentsController.setError("La suma de los porcentajes de pago debe ser 100%");
            isValid = false;
        }
        const service = services?.find(s => s.name === serviceNameController.selectedValue);
        const price = parseFloat(priceController.value);
        if (price < (service?.prices[0].minPrice ?? 0) || price > (service?.prices[service.prices.length - 1].maxPrice ?? Infinity)) {
            priceController.setError("El precio se escapa del rango sugerido")
            isValid = false;
        }
        const now = new Date();
        const marginMs = 10 * 60 * 1000;
        if (calendarController.selectedDate && calendarController.selectedDate.start.getTime() < now.getTime() + marginMs) {
            calendarController.calendarController.setError("La fecha debe ser al menos 10 minutos en el futuro");
            isValid = false;
        }
        if (!validateAnswers()) {
            setAnswerError("Debe responder todas las preguntas del servicio");
            isValid = false;
        }
        return isValid;
    }

    const validateAnswers = (): boolean => {
        let isValid = true
        if (mode === 'create') {
            newAnswers.forEach(a => {
                if (a.type === 'text' && a.textAnswer?.answer?.trim() === '') {
                    isValid = false;
                }
                if (a.type === 'image' && a.imageAnswer?.images?.length === 0) {
                    isValid = false;
                }
                if (a.type === 'choiceText' && a.textChoiceAnswer?.selected?.trim() === '') {
                    isValid = false;
                }
                if (a.type === 'choiceImage' && a.imageChoiceAnswer?.selected?.trim() === '') {
                    isValid = false;
                }
            })
        }
        if (mode === 'edit') {
            loadedAnswers.forEach(a => {
                if (a.type === 'text' && a.textAnswer?.answer?.trim() === '') {
                    isValid = false;
                }
                if (a.type === 'image' && a.imageAnswer?.images?.length === 0) {
                    isValid = false;
                }
                if (a.type === 'choiceText' && a.textChoiceAnswer?.selected?.trim() === '') {
                    isValid = false;
                }
                if (a.type === 'choiceImage' && a.imageChoiceAnswer?.selected?.trim() === '') {
                    isValid = false;
                }
            })
        }
        return isValid;
    }

    const onChangePrice = (value: string) => {
        priceController.setValue(value);
        percentageController.setPrice(parseFloat(value) || 0);
    }

    useEffect(() => employeePaymentsController.setTotalPayment(percentageController.value), [percentageController.value])

    const onSelectServiceType = async (value: string) => {
        serviceTypeController.setValue(value);
        const users = await userApi.filterUsers({ serviceCategory: value.toUpperCase() }).then(data => data?.users ?? []);
        employeePaymentsController.setAllEmployees(users)
        const services = await serviceApi.getByType(value.toUpperCase());
        if (services) {
            setServices(services)
            serviceNameController.setValues(services.map(s => s.name));
        }
        else {
            serviceNameController.setValues([])
        }
        serviceNameController.clearInput();
        setNewAnswers([]);
        if (mode === 'edit') {
            setLoadedAnswers([]);
        }
        employeePaymentsController.clearInputs()
    }

    const onSelectServiceName = (value: string) => {
        serviceNameController.setSelectedValue(value)
        const selectedServicie = services?.find(s => s.name === value);
        if (selectedServicie) {
            const questions = selectedServicie.questions;
            const answers: AnswerProps[] = questions.map(q => {
                const type = mapType(q.inputType, q.choiceType ?? 'TEXT');
                return {
                    type: type,
                    ...mapAnswer(q, type),
                }
            });
            setNewAnswers(answers);
        }
    }

    const generateAnswersProps = (): AnswerProps[] => {
        let answers: AnswerProps[] = [];
        if (mode === "create") {
            answers = [...newAnswers]
        }
        if (mode === "edit") {
            answers = loadedAnswers;
        }
        return answers.map(a => getAnswerProps(a))
    }

    const getAnswerProps = (answer: AnswerProps): AnswerProps => {
        if (answer.type === 'text') {
            return {
                ...answer,
                textAnswer: {
                    question: answer.textAnswer?.question || '',
                    answer: answer.textAnswer?.answer || '',
                    setAnswer: (a: string) => writeTextAnswer(answer.textAnswer?.questionId || '', a),
                }
            }
        }
        if (answer.type === 'choiceText') {
            return {
                ...answer,
                textChoiceAnswer: {
                    question: answer.textChoiceAnswer?.question || '',
                    options: answer.textChoiceAnswer?.options || [],
                    selected: answer.textChoiceAnswer?.selected || '',
                    setSelected: (selected: string) => selectTextChoiceAnswer(answer.textChoiceAnswer?.questionId || '', selected),
                }
            }
        }
        if (answer.type === 'choiceImage') {
            return {
                ...answer,
                imageChoiceAnswer: {
                    question: answer.imageChoiceAnswer?.question || '',
                    options: answer.imageChoiceAnswer?.options || [],
                    selected: answer.imageChoiceAnswer?.selected || '',
                    setSelected: (selected: string) => selectImageChoiceAnswer(answer.imageChoiceAnswer?.questionId || '', selected),
                }
            }
        }
        if (answer.type === 'image') {
            return {
                ...answer,
                imageAnswer: {
                    question: answer.imageAnswer?.question || '',
                    images: answer.imageAnswer?.images || [],
                    setImages: (images: string[]) => selectImageAnswer(answer.imageAnswer?.questionId || '', images),
                }
            }
        }
        return answer;
    }

    const writeTextAnswer = (questionId: string, answer: string) => {
        let answers: AnswerProps[] = [];
        if (mode === 'create') {
            answers = newAnswers.map(a => {
                if (a.textAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        textAnswer: {
                            question: a.textAnswer?.question || '',
                            answer: answer,
                            questionId: a.textAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            })
            setNewAnswers(answers);
        }
        if (mode === 'edit') {
            setLoadedAnswers(prev => prev.map(a => {
                if (a.textAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        textAnswer: {
                            question: a.textAnswer?.question || '',
                            answer: answer,
                            questionId: a.textAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            }));
        }
    }

    const selectImageAnswer = (questionId: string, images: string[]) => {
        if (mode === 'create') {
            setNewAnswers(prev => prev.map(a => {
                if (a.imageAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        imageAnswer: {
                            question: a.imageAnswer?.question || '',
                            images: images,
                            questionId: a.imageAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            }));
        }
        if (mode === 'edit') {
            setLoadedAnswers(prev => prev.map(a => {
                if (a.imageAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        imageAnswer: {
                            question: a.imageAnswer?.question || '',
                            images: images,
                            questionId: a.imageAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            }));
        }
    }

    const selectTextChoiceAnswer = (questionId: string, selected: string) => {
        let answers: AnswerProps[] = [];
        if (mode === 'create') {
            answers = newAnswers.map(a => {
                if (a.textChoiceAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        textChoiceAnswer: {
                            question: a.textChoiceAnswer?.question || '',
                            options: a.textChoiceAnswer?.options || [],
                            selected: selected,
                            questionId: a.textChoiceAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            })
            setNewAnswers(answers);
        }
        if (mode === 'edit') {
            setLoadedAnswers(prev => prev.map(a => {
                if (a.textChoiceAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        textChoiceAnswer: {
                            question: a.textChoiceAnswer?.question || '',
                            options: a.textChoiceAnswer?.options || [],
                            selected: selected,
                            questionId: a.textChoiceAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            }));
        }
    }

    const selectImageChoiceAnswer = (questionId: string, selected: string) => {
        let answers: AnswerProps[] = [];
        if (mode === 'create') {
            answers = newAnswers.map(a => {
                if (a.imageChoiceAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        imageChoiceAnswer: {
                            question: a.imageChoiceAnswer?.question || '',
                            options: a.imageChoiceAnswer?.options || [],
                            selected: selected,
                            questionId: a.imageChoiceAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            })
            setNewAnswers(answers);
        }
        if (mode === 'edit') {
            setLoadedAnswers(prev => prev.map(a => {
                if (a.imageChoiceAnswer?.questionId === questionId) {
                    return {
                        type: a.type,
                        imageChoiceAnswer: {
                            question: a.imageChoiceAnswer?.question || '',
                            options: a.imageChoiceAnswer?.options || [],
                            selected: selected,
                            questionId: a.imageChoiceAnswer?.questionId || '',
                        }
                    }
                }
                return a;
            }));
        }
    }

    const mapType = (type: "TEXT" | "IMAGE" | "CHOICE", choiceType: "TEXT" | "IMAGE"): 'choiceImage' | 'choiceText' | 'text' | 'image' => {
        if (type === "TEXT") return "text";
        if (type === "IMAGE") return "image";
        if (type === "CHOICE" && choiceType === "TEXT") return "choiceText";
        return "choiceImage";
    }

    const mapAnswer = (question: Question, type: 'choiceImage' | 'choiceText' | 'text' | 'image',
        answer?: string, images?: string[]
    ) => {
        switch (type) {
            case 'text':
                return {
                    textAnswer: generateTextAnswer(question, answer)
                }
            case 'image':
                return {
                    imageAnswer: generateImageAnswer(question, images)
                }
            case 'choiceText':
                return {
                    textChoiceAnswer: generateTextChoiceAnswer(question, answer)
                }
            case 'choiceImage':
                return {
                    imageChoiceAnswer: generateImageChoiceAnswer(question, answer)
                }
        }
    }

    const generateTextAnswer = (question: Question, answer?: string): TextAnswerProps => {
        return {
            question: question.title,
            questionId: question.id,
            answer: answer ?? '',
        }
    }

    const generateImageAnswer = (question: Question, images?: string[]): ImageAnswerProps => {
        return {
            question: question.title,
            questionId: question.id,
            images: images || [],
        }
    }

    const generateTextChoiceAnswer = (question: Question, answer?: string): TextChoiceAnswerProps => {
        return {
            question: question.title,
            questionId: question.id,
            selected: answer ?? '',
            options: question.choices ? question.choices.map(c => c.option) : [],
        }
    }

    const generateImageChoiceAnswer = (question: Question, answer?: string): ImageChoiceAnswerProps => {
        return {
            question: question.title,
            questionId: question.id,
            selected: answer ?? '',
            options: question.choices ? question.choices.map(c => {
                return {
                    value: c.option,
                    image: c.image ? c.image : ''
                }
            }) : [],
        }
    }

    return {
        getCitaProps,
        initServiceItem,
        generateAnswersProps,
        addServiceItem,
        answerError,
        getItems,
        createOrder,
        answersData,
        onDeleteServiceItem,
        editServiceItem,
        serviceItems,
        loadServiceItem,
        mode,
        discartChanges,
        clientProps: clientController.getAutocompleteProps(),
        paymentTypeProps: paymentTypeController.getProps(),
        orderStatusProps: orderStatusController.getProps(),
        orderPaymentStatusProps: orderPaymentStatusController.getProps(),
        clientConfirmedProps: clientConfirmedController.getProps(),
    }
}

const useCitaCalendar = () => {
    const calendarController = useCalendar();
    const [selectedDate, setSelectedDate] = useState<DateValue>();
    const [otherDates, setOtherDates] = useState<DateValue[]>([]);

    const addOtherDates = (dates: DateValue[]) => {
        const newOtherDates = [...otherDates, ...dates.map(d => { return { ...d, color: 'gray' } })];
        const joinedDates = joinSchedules(newOtherDates);
        setOtherDates(joinedDates);
        calendarController.setValues(joinedDates);
    }

    const setOthers = (dates: DateValue[]) => {
        const newOtherDates = dates.map(d => { return { ...d, color: 'gray' } });
        const joinedDates = joinSchedules(newOtherDates);
        setOtherDates(joinedDates);
        if (selectedDate) {
            calendarController.setValues([...joinedDates, selectedDate]);
        }
        else {
            calendarController.setValues(joinedDates);
        }
    }

    const clearOtherDates = () => {
        otherDates.forEach(d => {
            calendarController.removeValue(d.start, d.end);
        });
        setOtherDates([]);
    }

    const selectDate = (start: Date, end: Date) => {
        setSelectedDate({ start, end, color: '#F87171' });
        calendarController.addValue(start, end, '#F87171');
    }

    const desSelectDate = () => {
        if (selectedDate) {
            calendarController.removeValue(selectedDate.start, selectedDate.end);
            setSelectedDate(undefined);
        }
    }

    const isSelectable = () => {
        if (otherDates.length > 0) {
            return selectedDate === undefined;
        }
        return calendarController.isEmpty()
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

    const getProps = (): CalendarInputProps => {
        return {
            values: calendarController.values,
            onSelect: selectDate,
            onRemove: desSelectDate,
            selectable: isSelectable(),
            error: calendarController.error,
        }
    }

    const clearInput = () => {
        calendarController.clearInput();
        setSelectedDate(undefined);
        setOtherDates([]);
    }

    return {
        calendarController,
        selectedDate,
        otherDates,
        addOtherDates,
        selectDate,
        desSelectDate,
        clearInput,
        getProps,
        clearOtherDates,
        setOthers
    }
}