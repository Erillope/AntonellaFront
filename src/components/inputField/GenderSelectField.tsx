import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import React from "react";

interface GenderSelectFieldProps {
    control: Control<FieldValues>;
    errors: FieldErrors;
    value?: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
    controlStyle?: React.CSSProperties;
    disabled?: boolean;
}

export const GenderSelectField: React.FC<GenderSelectFieldProps> = ({ control, errors, value, onChange, style, controlStyle, disabled }) => {
    return (
        <FormControl variant='outlined' style={controlStyle} error={!!errors.gender}>
            <InputLabel>Género</InputLabel>
            <Controller
                name="gender"
                control={control}
                rules={{ required: "Seleccione un género por favor" }}
                render={({ field }) => (
                    <Select {...field}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => { onChange?.(e.target.value); field.onChange(e.target.value) }}
                        style={style}>
                        <MenuItem value="MASCULINO">Masculino</MenuItem>
                        <MenuItem value="FEMENINO">Femenino</MenuItem>
                    </Select>
                )}
            />
            {errors.gender && <FormHelperText>
                {typeof errors.gender?.message === 'string' ? errors.gender.message : ""}
            </FormHelperText>}
        </FormControl>
    )
}