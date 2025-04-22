import { Box, FormHelperText, Typography } from "@mui/material";
import { InputBox } from "./InputBox"
import { InputTextFieldProps, NumberInputField, useInputTextField } from "./InputTextField";
import { useState } from "react";
import { Time } from "../../api/types";

export interface DurationInputProps {
    labelText?: string;
    disabled?: boolean;
    width?: string;
    hoursProps?: InputTextFieldProps;
    minutesProps?: InputTextFieldProps;
    error?: string;
}

export const DurationInput = (props: DurationInputProps) => {
    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width}>
            <Box display="flex" flexDirection="row" gap={1} alignItems={'center'}>
                <NumberInputField {...props.hoursProps} disabled={props.disabled}/>
                <Typography>:</Typography>
                <NumberInputField {...props.minutesProps} disabled={props.disabled}/>
            </Box>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </InputBox>
    )
}


export const useDurationInput = () => {
    const hoursControl = useInputTextField()
    const minutesControl = useInputTextField()
    const [error, setError] = useState<string>('')

    const getDurationInputProps = (): DurationInputProps => {
        return {
            hoursProps: hoursControl.getProps(),
            minutesProps: minutesControl.getProps(),
            error: error,
        }
    }

    const clearInput = () => { hoursControl.clearInput(); minutesControl.clearInput() }
    const isEmpty = () => { return hoursControl.isEmpty() || minutesControl.isEmpty() }
    const clearError = () => { setError('') }
    const validate = () => {
        clearError()
        let isValid = true
        if (hoursControl.isEmpty() || minutesControl.isEmpty()) {
            setError('La duración es requerida')
            isValid = false
        }
        const minutes = parseInt(minutesControl.value)
        if (minutes < 0 || minutes > 59) {
            setError('Los minutos deben estar entre 0 y 59')
            isValid = false
        }
        return isValid
    }

    const getData = (): Time => {
        return {
            hours: parseInt(hoursControl.value),
            minutes: parseInt(minutesControl.value)
        }
    }

    const setData = (data: Time) => {
        hoursControl.setValue(data.hours.toString())
        minutesControl.setValue(data.minutes.toString())
    }

    return {
        getDurationInputProps,
        clearInput,
        isEmpty,
        clearError,
        validate,
        getData,
        setData
    }

}