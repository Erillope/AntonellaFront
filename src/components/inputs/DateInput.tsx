import { FormHelperText } from "@mui/material";
import { InputBox } from "./InputBox";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

export interface DateInputProps {
    disabled?: boolean;
    error?: string,
    labelText?: string;
    value?: Date;
    onSelect?: (value: Date) => void;
    width?: string;
}

export function DateInput(props: DateInputProps) {
    return (
        <InputBox labelText={props.labelText} width={props.width} disabled={props.disabled}>

            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DatePicker
                    slotProps={{
                        textField: {
                            variant: 'filled',
                            className: "inputTextField2",
                            sx: {
                                width: '100%',
                                "& .MuiFilledInput-root": {
                                    color: !!props.disabled ? "#999999" : "black",
                                    pointerEvents: !!props.disabled ? "none" : "auto",
                                    backgroundColor: !!props.disabled ? "transparent" : "#f3f3f3",
                                },
                            },
                            InputProps: {
                                ...(props.disabled && { endAdornment: null })
                            },
                        },
                        desktopPaper: {
                            sx: {
                                backgroundColor: '#FAE2E1',
                                borderRadius: '16px',
                            },
                        },
                    }}
                    value={props.value ? dayjs(props.value) : null}
                    onChange={(date) => { date && props.onSelect?.(date.toDate()) }}
                    sx={{ width: props.width ?? '100%' }}
                />
            </LocalizationProvider>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </InputBox>
    )

}

export const useDateInput = () => {
    const [value, setValue] = useState<Date>(new Date());
    const [error, setError] = useState<string>('');

    const getProps = (): DateInputProps => {
        return {
            value: value,
            onSelect: setValue,
            error: error,
        };
    }


    const clearInput = () => setValue(new Date());
    const clearError = () => setError('');

    return {
        value,
        setValue,
        error,
        setError,
        getProps,
        clearInput,
        clearError,
    }
}
