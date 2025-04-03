import React from "react"
import { TextField } from "@mui/material"
import { FieldErrors, useForm } from "react-hook-form"

export interface NumberInputFieldProps {
    register?: ReturnType<typeof useForm>["register"]
    errors?: FieldErrors
    value?: number
    onValueChange?: (value: number) => void
    inputError?: string
    name?: string
    requiredErrorText?: string
    labelText?: string
    style?: React.CSSProperties
    disable?: boolean
}

export const NumberInputField: React.FC<NumberInputFieldProps> = ({ register, errors = {}, name = '', requiredErrorText, labelText, inputError = '', value, onValueChange, style, disable }) => {
    return (
        <TextField
            label={labelText}
            variant="outlined"
            value={value??''}
            margin="normal"
            disabled={disable}
            type="number"
            {...(register ? register(name+'', { required: requiredErrorText }) : {})}
            onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                    onValueChange && onValueChange(Number(e.target.value))
                }
            }}
            error={!!errors[name] || !!(inputError.length > 0)}
            helperText={typeof errors[name]?.message === 'string' ? errors[name].message : inputError}
            style={style}
        />
    )
}

export const useNumberInputField = (register?: ReturnType<typeof useForm>['register'],
    errors: FieldErrors = {}) => {
    const [value, setValue] = React.useState<number>()
    const [error, setError] = React.useState<string>()

    const getNumberInputFieldProps = (): NumberInputFieldProps => {
        return {
            register: register,
            errors: errors,
            value: value,
            onValueChange: setValue,
            inputError: error,
        }
    }

    const clearInput = () => setValue(0)
    const clearError = () => setError('')

    return {
        getNumberInputFieldProps,
        setError,
        clearInput,
        clearError,
        setValue,
        value,
        error
    }
}