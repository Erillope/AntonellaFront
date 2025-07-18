import { Box } from "@mui/material"
import { DateInput, DateInputProps, useDateInput } from "../DateInput"
import { InputTextFieldProps, NumberInputField, useInputTextField } from "../InputTextField"
import { useState } from "react";

export interface NotificationDateProps {
    dateProps?: DateInputProps;
    hourProps?: InputTextFieldProps;
    minutesProps?: InputTextFieldProps;
    disabled?: boolean;
}

export const NotificationDate = (props: NotificationDateProps) => {
    return <Box display="flex" flexDirection="column" alignItems="center" width="100%" gap={2}>
        <DateInput labelText="Fecha" {...props.dateProps} disabled={props.disabled}/>
        <Box display="flex" flexDirection="row" alignItems="center" width="100%" gap={2}>
            <NumberInputField labelText="Hora" {...props.hourProps} disabled={props.disabled}/>
            <NumberInputField labelText="Minuto" {...props.minutesProps} disabled={props.disabled}/>
        </Box>
    </Box>
}


export const useNotificationDate = () => {
    const dateController = useDateInput()
    const hourController = useInputTextField()
    const minutesController = useInputTextField()
    const [disabled, setDisabled] = useState(false);

    const getDate = (): Date => {
        const date = dateController.value;
        const hour = parseInt(hourController.value) || 0;
        const minutes = parseInt(minutesController.value) || 0;

        date.setHours(hour, minutes, 0, 0);
        return date;
    }

    const validate = (): boolean => {
        dateController.clearError();
        let isValid = true;
        if (dateController.value === null) {
            dateController.setError("La fecha es obligatoria");
            isValid = false;
        }
        if (hourController.isEmpty()) {
            hourController.setError("La hora es obligatoria");
            isValid = false;
        }
        if (minutesController.isEmpty()) {
            minutesController.setError("Los minutos son obligatorios");
            isValid = false;
        }
        if (minutesController.value && (parseInt(minutesController.value) < 0 || parseInt(minutesController.value) > 59)) {
            minutesController.setError("Debería ser entre 0 y 59");
        }
        if (hourController.value && (parseInt(hourController.value) < 0 || parseInt(hourController.value) > 23)) {
            hourController.setError("Debería ser entre 0 y 23");
            isValid = false;
        }
        if (!isValid) return false;
        const date = getDate();
        const now = new Date();
        if (date < now) {
            dateController.setError("La fecha y hora de publicación debe ser futura");
            isValid = false;
        }
        return isValid;
    }
    
    const clearError = () => {
        dateController.clearError();
        hourController.clearError();
        minutesController.clearError();
    }

    const clearInputs = () => {
        dateController.clearInput();
        hourController.clearInput();
        minutesController.clearInput();
    }

    const getProps = (): NotificationDateProps => {
        return {
            dateProps: dateController.getProps(),
            hourProps: hourController.getProps(),
            minutesProps: minutesController.getProps(),
            disabled: disabled
        }
    }

    return {
        dateController,
        hourController,
        minutesController,
        getDate,
        validate,
        clearError,
        clearInputs,
        getProps,
        disabled,
        setDisabled
    }
}