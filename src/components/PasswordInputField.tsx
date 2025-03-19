import { TextField, InputAdornment, IconButton } from "@mui/material";
import { FieldErrors, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    passwordError: string;
}


export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ register, errors, passwordError }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            className="input"
            {...register('password', { required: 'La contraseña es obligatoria' })}
            error={!!errors.password || !!(passwordError.length > 0)}
            helperText={typeof errors.password?.message === 'string' ? errors.password.message : passwordError}
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