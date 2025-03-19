import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { InputAdornment, TextField } from "@mui/material";
import { Fingerprint } from '@mui/icons-material';

interface DniInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    dniError: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const DniInputField: React.FC<DniInputFieldProps> = ({ register, errors, dniError, style,
    value, onChange, disabled
}) => {
    return (
        <TextField
            label="Cedula"
            variant="outlined"
            margin="normal"
            value={value}
            disabled={disabled}
            {...register('dni', { required: 'La cedula es obligatoria' })}
            onChange={(e) => onChange?.(e.target.value)}
            error={!!errors.dni || !!(dniError.length > 0)}
            helperText={typeof errors.dni?.message === 'string' ? errors.dni.message : dniError}
            inputMode="numeric"
            style={style}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Fingerprint />
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}