import { FormControlLabel, Checkbox, Avatar } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import checked from "../../assets/checked.png"
import unChecked from "../../assets/unchecked.svg"

interface CheckInputProps {
    checked?: boolean;
    onChecked?: (value: boolean) => void;
    labelText?: string;
    disabled?: boolean;
}

export function CheckInput(props: CheckInputProps) {
    const loadIcon = () => {
        const size = !!props.checked ? 20 : 15
        return (
            <Avatar src={!!props.checked ? checked : unChecked}
            sx={{borderRadius: 0, width: size , height: size, backgroundColor: 'transparent'}}/> 
        )
    }

    return (
        <FormControlLabel
            control={
                <Checkbox
                    icon={<RadioButtonUncheckedIcon fontSize="large" />}
                    disabled={props.disabled}
                    checkedIcon={loadIcon()}
                    checked={props.checked}
                    onChange={(e) => props.onChecked?.(e.target.checked)}
                    color="primary"
                    sx={{
                        padding: '10px',
                        "& .MuiSvgIcon-root": { fontSize: 20 },
                    }}
                />
            }
            label={props.labelText}
        />
    )
}

