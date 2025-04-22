import { Select, MenuItem, FormControl, FormHelperText } from "@mui/material";
import { InputBox } from "./InputBox";
import "../../styles/inputs.css"
import { useState } from "react";

export interface SelectInputProps {
    error?: string;
    disabled?: boolean;
    labelText?: string;
    values?: string[];
    value?: string;
    onSelect?: (value: string) => void;
    width?: string;
}

export function SelectInput(props: SelectInputProps) {
    return (
        <InputBox labelText={props.labelText} width={props.width} disabled={props.disabled}>
            <FormControl className="select-form-control" style={{ width: props.width ?? '100%' }}
                sx={{
                    backgroundColor: !!props.disabled ? "transparent" : "#f3f3f3",
                    "& .MuiOutlinedInput-root": {
                        color: !!props.disabled ? "#999999" : "black",
                        pointerEvents: !!props.disabled ? "none" : "auto",
                        "&.Mui-disabled": {
                            backgroundColor: "transparent"
                        },
                    },
                }}>
                <Select
                    IconComponent={!!props.disabled ? () => null : undefined}
                    className="inputTextField2"
                    value={props.value}
                    onChange={(e) => { props.onSelect?.(e.target.value) }}
                    MenuProps={{
                        PaperProps: {
                            className: 'select-menu'
                        }
                    }}>
                    {props.values?.map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }

        </InputBox>
    )
}

interface SelectInputHookProps {
    values?: string[];
}

export const useSelectInput = (props?: SelectInputHookProps) => {
    const [values, setValues] = useState<string[]>(props?.values || []);
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string>('');

    const getProps = (): SelectInputProps => {
        return {
            values: values,
            value: value,
            error: error,
            onSelect: setValue
        }
    }

    const isEmpty = (): boolean => value.trim() === '';
    const clearInput = () => setValue('');
    const clearError = () => setError('');

    return {
        value,
        error,
        setError,
        setValue,
        values: values,
        getProps,
        setValues,
        isEmpty,
        clearInput,
        clearError,
    };
}