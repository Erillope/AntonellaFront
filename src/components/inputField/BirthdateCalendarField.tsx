import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Control, Controller, FieldValues, FieldErrors } from 'react-hook-form';
import dayjs from 'dayjs';
import React from 'react';

interface BirthdateCalendarFieldProps {
    control: Control<FieldValues>;
    errors: FieldErrors;
    birthdateError: string;
    value?: Date;
    onChange?: (value: Date | undefined) => void;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const BirthdateCalendarField: React.FC<BirthdateCalendarFieldProps> = ({ control, errors, birthdateError, value, onChange, style, disabled}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <Controller
                name="birthdate"
                control={control}
                rules={{ required: "La fecha de nacimiento es obligatoria" }}
                disabled={disabled}
                render={({ field }) => (
                    <DatePicker sx={style}
                        {...field}
                        label="Fecha de nacimiento"
                        value={value ? dayjs(value) : null}
                        onChange={(date) => { onChange?.(date?.toDate()); field.onChange(date) }}
                        slotProps={{
                            textField: {
                                error: !!errors.birthdate || !!(birthdateError.length > 0),
                                helperText: typeof errors.birthdate?.message === 'string' ? errors.birthdate.message : birthdateError,
                            },
                        }} />
                )}
            />
        </LocalizationProvider>
    )
}