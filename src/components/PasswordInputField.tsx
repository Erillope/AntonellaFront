import { TextField, InputAdornment, IconButton } from "@mui/material";
import { FieldErrors, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    passwordError: string;
    name?: string;
    requiredErrorText?: string;
    labelText?: string;
}


export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ register, errors,
    passwordError, name, requiredErrorText, labelText}) => {
    const [showPassword, setShowPassword] = useState(false);
    const fieldName = name??'password';

    return (
        <TextField
            label={labelText??'Contraseña'}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            className="input"
            {...register(fieldName, { required: requiredErrorText??'La contraseña es obligatoria' })}
            error={!!errors[fieldName] || !!(passwordError.length > 0)}
            helperText={typeof errors[fieldName]?.message === 'string' ? errors[fieldName].message : passwordError}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} style={{ color: "#AF234A" }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}