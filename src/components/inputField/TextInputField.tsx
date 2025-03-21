import { TextField } from "@mui/material"
import { FieldErrors, useForm } from "react-hook-form";
import React from "react";

interface TextInputFieldProps {
    register?: ReturnType<typeof useForm>["register"];
    errors?: FieldErrors;
    value?: string;
    onValueChange?: (value: string) => void;
    inputError?: string;
    name?: string;
    requiredErrorText?: string;
    labelText?: string;
    style?: React.CSSProperties;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({ register, errors = {}, name='', requiredErrorText, labelText, inputError='', value, onValueChange, style}) => {
    return (
        <TextField
            label={labelText}
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