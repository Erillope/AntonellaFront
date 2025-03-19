import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { TextField } from "@mui/material";

interface UserNameInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    nameError: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const UserNameInputField: React.FC<UserNameInputFieldProps> = ({ register, errors, nameError, style,
    value, onChange, disabled
}) => {
    return (
        <TextField
            label="Nombre"
            variant="outlined"
            margin="normal"
            disabled={disabled}
            value={value}
            {...register('name', { required: 'El nombre es obligatorio' })}
            onChange={(e) => onChange?.(e.target.value)}
            error={!!errors.name || !!(nameError.length > 0)}
            helperText={typeof errors.name?.message === 'string' ? errors.name.message : nameError}
            style={style}
        />
    )
}