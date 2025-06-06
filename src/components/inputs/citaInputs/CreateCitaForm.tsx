import { Box } from "@mui/material"
import { InputTextFieldProps, NumberInputField } from "../InputTextField"
import { DynamicAutocomplete, DynamicAutocompleteProps } from "../DynamicMultipleSelect"
import { SelectInput, SelectInputProps } from "../SelectInput"
import { EmployeePayments, EmployeePaymentsProps } from "./EmployeePayments"
import { Calendar, CalendarInputProps } from "../CalendarInput"
import { ActionForm } from "../../forms/ActionForm"
import { PercentPayment, PercentPaymentProps } from "./PercentPayment"

export interface CreateCitaFormProps {
    serviceTypeProps?: SelectInputProps;
    serviceNameProps?: DynamicAutocompleteProps;
    priceProps?: InputTextFieldProps;
    percentageProps?: PercentPaymentProps
    employeePaymentsProps?: EmployeePaymentsProps;
    calendarProps?: CalendarInputProps;
    onCreateSubmit?: () => void;
    onEditSubmit?: () => void;
    onDiscard?: () => void;
    onDelete?: () => void;
    mode?: 'create' | 'edit';
}

export const CreateCitaForm = (props: CreateCitaFormProps) => {
    return (
        <ActionForm width="100%" handleSubmit={props.mode === 'create' ? props.onCreateSubmit : props.onEditSubmit} mode={props.mode === 'create' ? 'create' : 'update'} discartChanges={props.onDiscard}
        allowDelete={props.mode === 'edit'} delete={props.onDelete}>
            <Box width={'90%'} display='flex' flexDirection='row' gap={2} p={2} height={'100%'} padding={5}>
                <Box display='flex' flexDirection='column' gap={2} width={'100%'}>
                    <SelectInput labelText="Tipo de servicio" {...props.serviceTypeProps}/>
                    <DynamicAutocomplete labelText="Nombre del servicio" {...props.serviceNameProps}/>
                    <NumberInputField labelText="Precio" {...props.priceProps}/>
                    <PercentPayment {...props.percentageProps}/>
                    <EmployeePayments {...props.employeePaymentsProps}/>
                </Box>
                <Box display='flex' flexDirection='column' gap={2} width={'100%'}>
                    <Calendar {...props.calendarProps}/>
                </Box>
            </Box>
        </ActionForm>
    )
}