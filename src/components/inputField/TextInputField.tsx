import { TextField } from "@mui/material"
import { FieldErrors, useForm } from "react-hook-form";
import React from "react";

export interface TextInputFieldProps {
    register?: ReturnType<typeof useForm>["register"];
    errors?: FieldErrors;
    value?: string;
    onValueChange?: (value: string) => void;
    inputError?: string;
    name?: string;
    requiredErrorText?: string;
    labelText?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({ register, errors = {}, name='', requiredErrorText, labelText, inputError='', value, onValueChange, style, disabled}) => {
    return (
        <TextField
            label={labelText}
            disabled={disabled}
            variant="outlined"
            value={value}
            margin="normal"
            {...(register ? register(name, { required: requiredErrorText }) : {})}
            onChange={(e) => onValueChange && onValueChange(e.target.value)}
            error={!!errors[name] || !!(inputError.length > 0)}
            helperText={typeof errors[name]?.message === 'string' ? errors[name].message : inputError}
            style={style}
        />
    )
}

export const useTexInputFiled = (register: ReturnType<typeof useForm>['register'], errors: FieldErrors) => {
    const [value, setValue] = React.useState<string>('')
    const [inputError, setInputError] = React.useState<string>()
    const getTextInputFieldProps = (): TextInputFieldProps => {
        return {
            register: register,
            errors: errors,
            value: value,
            onValueChange: setValue,
            inputError: inputError,
        };
    };

    const clearInput = () => setValue('')
    const clearError = () => setInputError('')

    return {
        getTextInputFieldProps,
        setInputError,
        clearInput,
        clearError,
        setValue,
        value,
        inputError,
    };
}