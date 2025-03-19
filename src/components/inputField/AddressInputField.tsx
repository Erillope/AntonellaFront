import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { TextField } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { InputAdornment } from '@mui/material';

interface AddressInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const AddressInputField: React.FC<AddressInputFieldProps> = ({ register, errors, style,
    value, onChange, disabled
}) => {
    return (
        <TextField
            label="Dirección"
            variant="outlined"
            margin="normal"
            value={value}
            disabled={disabled}
            {...register('address', { required: 'El dirección es obligatoria' })}
            onChange={(e) => onChange?.(e.target.value)}
            error={!!errors.address}
            helperText={typeof errors.address?.message === 'string' ? errors.address.message : ""}
            style={style}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <HomeIcon />
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}