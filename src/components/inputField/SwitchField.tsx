import { FormControlLabel, Switch } from "@mui/material"
import React from "react";

interface SwitchFieldProps {
    active?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    label?: string;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({ active, onChange, disabled, label }) => {
    return (
        <FormControlLabel
            control={
                <Switch checked={active} onChange={(e) => onChange?.(e.target.checked)
                } disabled={disabled} />
            }
            label={label}
        />
    )
}