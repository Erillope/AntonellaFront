import { Box, Switch, Typography } from "@mui/material";
import { InputBox } from "./InputBox";
import { useState } from "react";

export interface SwitchInputProps {
    disabled?: boolean;
    labelText?: string;
    active?: boolean;
    activeText?: string;
    inactiveText?: string;
    onChange?: (value: boolean) => void;
    width?: string;
}

export function SwitchInput(props: SwitchInputProps) {
    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width}>
            <Box display="flex" flexDirection='row' alignItems='center' justifyContent='flex-start' width={'100%'}>
                <Switch checked={props.active} onChange={(e) => props.onChange?.(e.target.checked)}
                    disabled={props.disabled} className="switchInput"/>
                <Typography variant="subtitle2" sx={{ marginLeft: 1, color: '#B0B0B0', fontSize: 14, marginTop: 0.8 }}>
                    {!!props.active ? props.activeText : props.inactiveText}
                </Typography>
            </Box>
        </InputBox>
    )
}


export const useSwitchInput = () => {
    const [active, setActive] = useState<boolean>(false);

    const getProps = (): SwitchInputProps => {
        return {
            active: active,
            onChange: setActive,
        };
    }

    return {
        active,
        setActive,
        getProps,
    }
}