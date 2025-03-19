import { FieldErrors, useForm } from 'react-hook-form';
import { TextField, InputAdornment } from "@mui/material";
import React from 'react';
import EmailIcon from '@mui/icons-material/Email';

interface EmailInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    emailError: string;
    style?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const EmailInputField: React.FC<EmailInputFieldProps> = ({ register, errors, emailError,
    style, iconStyle, value, onChange, disabled}) => {
    return (
        <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            className="input"
            value={value}
            disabled={disabled}
            {...register('email', { required: 'El email es obligatorio' })}
            onChange={(e) => onChange?.(e.target.value)}
            error={!!errors.email || !!(emailError.length > 0)}
            helperText={typeof errors.email?.message === 'string' ? errors.email.message : emailError}
            type="email"
            style={style}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <EmailIcon style={iconStyle} />
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}