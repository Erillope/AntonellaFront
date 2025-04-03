import { TextField } from "@mui/material"
import React from "react";
import { TextInputFieldProps } from "./TextInputField";

export const TextAreaField: React.FC<TextInputFieldProps> = ({ labelText, value, register, name='', requiredErrorText, onValueChange, errors={}, inputError='', style }) => {
    return (
        <TextField
            label={labelText}
            multiline
            rows={4}
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