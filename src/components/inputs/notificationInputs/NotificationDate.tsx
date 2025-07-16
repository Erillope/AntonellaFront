import { Box } from "@mui/material"
import { DateInput, DateInputProps, useDateInput } from "../DateInput"
import { InputTextFieldProps, NumberInputField, useInputTextField } from "../InputTextField"

export interface NotificationDateProps {
    dateProps?: DateInputProps;
    hourProps?: InputTextFieldProps;
    minutesProps?: InputTextFieldProps;
}

export const NotificationDate = (props: NotificationDateProps) => {
    return <Box display="flex" flexDirection="column" alignItems="center" width="100%" gap={2}>
        <DateInput labelText="Fecha" {...props.dateProps}/>
        <Box display="flex" flexDirection="row" alignItems="center" width="100%" gap={2}>
            <NumberInputField labelText="Hora" {...props.hourProps}/>
            <NumberInputField labelText="Minutos" {...props.minutesProps}/>
        </Box>
    </Box>
}


export const useNotificationDate = () => {
    const dateController = useDateInput()
    const hourController = useInputTextField()
    const minutesController = useInputTextField()

    const getDate = (): Date => {
        const date = dateController.value;
        const hour = parseInt(hourController.value) || 0;
        const minutes = parseInt(minutesController.value) || 0;

        date.setHours(hour, minutes, 0, 0);
        return date;
    }

    const validate = (): boolean => {
        dateController.clearError();
        const date = getDate();
        const now = new Date();
        if (date < now) {
            dateController.setError("La fecha y hora de publicación debe ser futura");
            return false;
        }
        return true;
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
            minutesProps: minutesController.getProps()
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
        getProps
    }
}