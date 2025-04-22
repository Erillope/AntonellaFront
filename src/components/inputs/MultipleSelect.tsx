import { Box, FormHelperText } from "@mui/material";
import { InputBox } from "./InputBox";
import { CheckInput } from "./CheckInput";
import { useState } from "react";

export interface MultipleSelectProps {
    labelText?: string;
    selectedValues?: string[];
    values?: string[];
    disabled?: boolean;
    onSelect?: (selectedValues: string[]) => void;
    width?: string;
    columns?: number;
    error?: string;
    centerLabel?: boolean;
}

export function MultipleSelect(props: MultipleSelectProps) {
    const includeValue = (value: string) => !!(props.selectedValues?.includes(value))
    const selectValue = (value: string) => {
        let values = []
        if (props.selectedValues && includeValue(value)) {
            values = props.selectedValues?.filter((selectedValue) => selectedValue !== value);
            props.onSelect?.(values); return
        }
        values = [...(props.selectedValues || []), value];
        props.onSelect?.(values);
    };
    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width ?? '100%'}
            centerLabel={props.centerLabel}>
            <Box display="grid" gridTemplateColumns={`repeat(${props.columns ?? 2}, 1fr)`} gap={1}
                bgcolor={'#f3f3f3'} borderRadius={3} paddingLeft={2}>
                {props.values && props.values.map((value, index) => (
                    <CheckInput checked={includeValue(value)} disabled={props.disabled} labelText={value}
                        onChecked={() => selectValue(value)} key={index}/>
                ))}
            </Box>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </InputBox>
    )
}

interface MultipleSelectHookProps {
    values?: string[];
}

export const useMultipleSelect = (props?: MultipleSelectHookProps) => {
    const [values, setValues] = useState<string[]>(props?.values || []);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    const getProps = (): MultipleSelectProps => {
        return {
            selectedValues: selectedValues,
            values: values,
            onSelect: setSelectedValues,
            error: error,
        }
    }

    const isEmpty = () => selectedValues.length === 0
    const clearInput = () => setSelectedValues([])
    const clearError = () => setError('');

    return {
        selectedValues,
        setSelectedValues,
        getProps,
        setValues,
        values,
        isEmpty,
        clearInput,
        error,
        setError,
        clearError
    }
}