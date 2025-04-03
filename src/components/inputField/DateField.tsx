import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

interface DateFieldProps {
    control?: Control<FieldValues>;
    name?: string;
    labelText?: string;
    requiredErrorText?: string;
    errors?: FieldErrors;
    dateError?: string;
    value?: Date;
    onChange?: (value: Date | undefined) => void;
    style?: React.CSSProperties;
    disabled?: boolean;
}


export const DateField: React.FC<DateFieldProps> = ({ control, errors = {}, dateError='', value, onChange, style, disabled, name = '', requiredErrorText, labelText }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            {control != undefined ? (
                <Controller
                    name={name}
                    control={control}
                    rules={{ required: requiredErrorText }}
                    disabled={disabled}
                    render={({ field }) => (
                        <DatePicker sx={style}
                            {...field}
                            label={labelText}
                            value={value ? dayjs(value) : null}
                            onChange={(date) => { onChange?.(date?.toDate()); field.onChange(date) }}
                            slotProps={{
                                textField: {
                                    error: !!errors[name] || !!(dateError.length > 0),
                                    helperText: typeof errors[name]?.message === 'string' ? errors[name].message : dateError,
                                },
                            }} />
                    )}
                />
            ) :
                (
                    <DatePicker sx={style}
                        label={labelText}
                        value={value ? dayjs(value) : null}
                        onChange={(date) => { onChange?.(date?.toDate()) }}
                        />
                )
            }

        </LocalizationProvider>
    )
}