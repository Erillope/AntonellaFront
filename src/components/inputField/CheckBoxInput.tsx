import { Checkbox, FormControlLabel } from "@mui/material"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";

interface CheckboxInputProps {
    checked?: boolean;
    onChecked?: (value: boolean) => void;
    label?: string;
    disabled?: boolean;
}
export const CheckboxInput: React.FC<CheckboxInputProps> = ({ checked, onChecked, label, disabled}) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    icon={<RadioButtonUncheckedIcon fontSize="large" />}
                    disabled={disabled}
                    checkedIcon={<CheckCircleIcon fontSize="large" color="primary" />}
                    checked={checked}
                    onChange={(e) => onChecked?.(e.target.checked)}
                    color="primary"
                    sx={{
                        padding: '10px',
                        "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                />
            }
            label={label}
        />
    )
}