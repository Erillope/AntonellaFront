import { Box } from "@mui/material"
import { AnswerForm, AnswerFormProps } from "./AnswerForm"
import { ActionForm } from "../../forms/ActionForm"
import { SelectInput, SelectInputProps } from "../SelectInput"
import { DynamicAutocomplete, DynamicAutocompleteProps } from "../DynamicMultipleSelect"
import { InputTextFieldProps, NumberInputField } from "../InputTextField"
import { EmployeePayments, EmployeePaymentsProps } from "./EmployeePayments"
import { PercentPayment, PercentPaymentProps } from "./PercentPayment"
import { Calendar, CalendarInputProps } from "../CalendarInput"

export interface CitaFormProps {
    citaInputsProps?: CitaFormInputsProps;
    answerFormProps?: AnswerFormProps;
    onCreateSubmit?: () => void;
    onEditSubmit?: () => void;
    onDiscard?: () => void;
    onDelete?: () => void;
    mode?: 'create' | 'edit';
    width?: string;
    disabled?: boolean;
}

export const CitaForm = (props: CitaFormProps) => {
    return (
        <ActionForm width={props.width ?? '90%'} onClick={props.mode === 'create' ? props.onCreateSubmit : props.onEditSubmit} mode={props.mode === 'create' ? 'create' : 'update'} discartChanges={props.onDiscard}
            allowDelete={props.mode === 'edit'} delete={props.onDelete}>
            <Box display={'flex'} flexDirection='row' gap={10} p={2} paddingTop={5} width={'100%'} height={'100%'}>
                <AnswerForm {...props.answerFormProps ?? {} as AnswerFormProps} width="40%" disabled={props.disabled} />
                <CitaFormInputs {...props.citaInputsProps} />
            </Box>
        </ActionForm>
    )
}

export interface CitaFormInputsProps {
    serviceTypeProps?: SelectInputProps;
    serviceNameProps?: DynamicAutocompleteProps;
    priceProps?: InputTextFieldProps;
    percentageProps?: PercentPaymentProps
    employeePaymentsProps?: EmployeePaymentsProps;
    calendarProps?: CalendarInputProps;
    priceRange?: { min?: number; max?: number };

}
const CitaFormInputs = (props: CitaFormInputsProps) => {
    const price = props.priceRange ? `sugerido (${props.priceRange.min} - ${props.priceRange.max})` : '';

    return <Box display="flex" flexDirection="column" gap={2} width="50%" sx={{ overflowY: 'auto', height: '100%' }}>
        <SelectInput labelText="Tipo de servicio" {...props.serviceTypeProps} />
        <DynamicAutocomplete labelText="Nombre del servicio" {...props.serviceNameProps} />
        <NumberInputField labelText={`Precio ${price}`} {...props.priceProps} />
        <PercentPayment {...props.percentageProps} />
        <EmployeePayments {...props.employeePaymentsProps} />
        <Calendar height="50%" {...props.calendarProps} />
    </Box>
}