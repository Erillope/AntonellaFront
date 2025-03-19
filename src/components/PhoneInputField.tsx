import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import "../styles/login.css";
import { TextField, InputAdornment } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

interface PhoneInputFieldProps {
    register: ReturnType<typeof useForm>["register"];
    errors: FieldErrors;
    phoneNumberError: string;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ register, errors, phoneNumberError }) => {
    return (
        <TextField
            label="Celular"
            variant="outlined"
            margin="normal"
            className="input"
            {...register('phoneNumber', { required: 'El cecular es obligatorio' })}
            error={!!errors.phoneNumber || !!(phoneNumberError.length > 0)}
            helperText={typeof errors.phoneNumber?.message === 'string' ? errors.phoneNumber.message : phoneNumberError}
            inputMode="numeric"
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <PhoneIcon style={{ color: "#AF234A" }} />
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}