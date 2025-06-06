import { Autocomplete, Box, FormHelperText, IconButton } from "@mui/material";
import React from "react";
import { InputTextField2 } from "./InputTextField";
import { Delete } from "@mui/icons-material";
import { InputBox } from "./InputBox";

export interface DynamicMultipleSelectProps {
    error?: string;
    disabled?: boolean;
    labelText?: string;
    values?: string[];
    selectedValues?: string[];
    onAdd?: (value: string) => void;
    onRemove?: (value: string) => void;
    width?: string;
}

export function DynamicMultipleSelect(props: DynamicMultipleSelectProps) {
    const [selectedValue, setSelectedValue] = React.useState<string>('');
    
    return (
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' width={props.width ?? "100%"}>
            {!!!props.disabled ?
            <DynamicAutocomplete {...props} selectedValue={selectedValue} onSelect={setSelectedValue}/>:
             <InputBox labelText={props.labelText}/>
             }
            {!!props.selectedValues && props.selectedValues.length > 0 &&
                <DynamicSelectedValues {...props}
                onRemove={(value) => {props.onRemove?.(value); setSelectedValue('')}}/>
            }
        </Box>
    )
}

export interface DynamicAutocompleteProps extends DynamicMultipleSelectProps {
    selectedValue?: string;
    onSelect?: (value: string) => void;
    showAllOptions?: boolean;
}

export function DynamicAutocomplete(props: DynamicAutocompleteProps) {
    return (
        <>
            <Autocomplete
                disablePortal
                fullWidth
                value={props.selectedValue}
                options={ props.showAllOptions ? props.values ?? [] :
                    props.values?.filter((value) => !props.selectedValues?.includes(value)) ?? []}
                onChange={(_, value) => { if (value) { props.onSelect?.(value); props.onAdd?.(value) } }}
                renderInput={(params) => (
                    <InputTextField2
                        labelText={props.labelText}
                        textFieldProps={{
                            ...params,
                            sx: {
                                "& .MuiFilledInput-root input": {
                                    marginTop: "-15px !important",
                                },
                            }
                        }}
                    />
                )}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '24px',
                        },
                    },
                }}
            />
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </>
    )
}


function DynamicSelectedValues(props: DynamicMultipleSelectProps) {
    return (
        <Box className='dynamicSelect-selectedValuesBox'>
            {props.selectedValues?.map((value) => (
                <DynamicSelectedValue key={value} value={value} onRemove={props.onRemove}
                disabled={props.disabled} />
            ))}
        </Box>
    )
}


function DynamicSelectedValue(props: { value: string, onRemove?: (value: string) => void, disabled?: boolean }) {
    return (
        <Box className='dynamicSelect-selectedValue'>
            <span className="dynamicSelect-selectedValueText">{props.value}</span>
            {!!!props.disabled &&
                <IconButton onClick={() => props.onRemove?.(props.value)}>
                    <Delete style={{ color: "#F44565" }}
                    />
                </IconButton>
            }
        </Box>
    )
}


export const useDynamicMultipleSelect = () => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
    const [values, setValues] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');
    const [selectedValue, setSelectedValue] = React.useState<string>('');

    const getProps = (): DynamicMultipleSelectProps => {
        return {
            selectedValues: selectedValues,
            values: values,
            onAdd: (value) => { setSelectedValues([...selectedValues, value]) },
            onRemove: (value) => { setSelectedValues(selectedValues.filter((v) => v !== value)) },
            error: error,
        }
    }

    const getAutocompleteProps = (): DynamicAutocompleteProps => {
        return {
            selectedValue: selectedValue,
            onSelect: (value) => { setSelectedValue(value)},
            values: values,
            selectedValues: selectedValues,
            error: error,
        }
    }

    const isEmpty = () => selectedValues.length === 0;
    const clearInput = () => {setSelectedValues([]); setSelectedValue('')}
    const clearError = () => setError('');

    return {
        getProps,
        setValues,
        values,
        selectedValues,
        setSelectedValues,
        error,
        setError,
        isEmpty,
        clearInput,
        clearError,
        getAutocompleteProps,
        selectedValue,
        setSelectedValue,
    }
}