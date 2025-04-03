import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material"
import React, { useEffect } from "react";
import { Control, FieldErrors, FieldValues, Controller } from "react-hook-form";

export interface SelectInputProps {
    control?: Control<FieldValues>;
    disabled?: boolean;
    errors?: FieldErrors,
    requiredErrorText?: string;
    name?: string;
    label?: string;
    values?: string[];
    value?: string;
    onSelect?: (value: string) => void;
    width?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, values = [], value, onSelect,
    width = "100%", control, errors = {}, name = '', requiredErrorText, disabled
}) => {
    useEffect(() => {}, [value])

    return (
        <FormControl sx={{ marginTop: '15px', width: width }} variant='outlined' error={!!errors[name]}>
            <InputLabel>{label}</InputLabel>
            {control != undefined ? (
                <>
                    <Controller
                        name={name}
                        control={control}
                        rules={{ required: requiredErrorText }}
                        render={({ field }) => (
                            <Select {...field}
                                value={value}
                                disabled={disabled}
                                onChange={(e) => { onSelect?.(e.target.value); field.onChange(e.target.value) }}
                                style={{ width: '100%' }}>
                                {values?.map(value => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors[name] && <FormHelperText>
                        {typeof errors[name]?.message === 'string' ? errors[name].message : ""}
                    </FormHelperText>}
                </>
            ) :
                <Select
                    value={value}
                    disabled={disabled}
                    onChange={(e) => { onSelect?.(e.target.value) }}
                    style={{ width: '100%' }}>
                    {values?.map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                </Select>
            }
        </FormControl>
    )
}

export const useSelectInput = (values: string[], control: Control<FieldValues>, errors: FieldErrors) => {
    const [selectedValue, setSelectedValue] = React.useState<string>('');
    const [valuesList, setValuesList] = React.useState<string[]>(values);

    const getSelectInputProps = (): SelectInputProps => {
        return {
            control: control,
            errors: errors,
            values: valuesList,
            value: selectedValue,
            onSelect: setSelectedValue
        }
    }

    const clearInput = () => setSelectedValue('')
    const clearError = () => setSelectedValue('')

    return {
        getSelectInputProps,
        clearInput,
        clearError,
        setSelectedValue,
        selectedValue,
        valuesList,
        setValuesList
    }
}