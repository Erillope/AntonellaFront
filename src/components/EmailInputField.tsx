import { FieldErrors, useForm } from 'react-hook-form';
import { TextField, InputAdornment } from "@mui/material";
import React from 'react';
import EmailIcon from '@mui/icons-material/Email';

interface EmailInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    emailError: string;
}

export const EmailInputField: React.FC<EmailInputFieldProps> = ({ register, errors, emailError }) => {
    return (
        <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            className="input"
            {...register('email', { required: 'El email es obligatorio' })}
            error={!!errors.email || !!(emailError.length > 0)}
            helperText={typeof errors.email?.message === 'string' ? errors.email.message : emailError}
            type="email"
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <EmailIcon style={{ color: "#AF234A" }} />
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}