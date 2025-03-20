import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import React from "react";

interface SelectInputProps {
    values?: string[];
    value?: string;
    onSelect?: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({ values, value, onSelect}) => {
    return (
        <FormControl sx={{ m: 2, width: "90%" }}>
            <InputLabel>Filtrar por rol</InputLabel>
            <Select value={value} onChange={(e) => onSelect?.(e.target.value)}>
                {values?.map(value => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}