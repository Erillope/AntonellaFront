import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import "../../styles/inputs.css"
import React, { JSX } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputBox } from "./InputBox";

export interface InputTextFieldProps {
    error?: string
    type?: "password" | "text" | "email" | "number" | 'date';
    value?: string;
    rows?: number;
    onValueChange?: (value: string) => void;
    labelText?: string;
    width?: string;
    disabled?: boolean;
    name?: string;
    requiredErrorText?: string;
    inputSlotProps?: {
        endAdornment: JSX.Element;
    };
    textFieldProps?: TextFieldProps 
}

export function InputTextField<Variant extends InputTextFieldProps>(props: Variant) {
    return (
        <TextField
            label={props.labelText}
            type={props.type ?? "text"}
            disabled={props.disabled}
            variant="outlined"
            value={props.value}
            rows={props.rows}
            multiline={props.rows !== undefined && props.rows > 1}
            margin="normal"
            onChange={(e) => props.onValueChange && props.onValueChange(e.target.value)}
            error={!!props.error?.length && props.error.length > 0}
            helperText={props.error}
            style={{ width: props.width ?? '100%' }}
            className="inputTextField"
            slotProps={{
                input: {
                    ...props.inputSlotProps,
                    style: { MozAppearance: 'textfield' }
                },
            }}
        />
    )
}


interface IconInputFieldProps extends InputTextFieldProps {
    icon?: React.ReactNode;
    onClickIcon?: () => void;
}

export function IconInputField<Variant extends IconInputFieldProps>(props: Variant) {
    return (
        <InputTextField
            {...props}
            icon={props.icon}
            onClickIcon={props.onClickIcon}
            inputSlotProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {!!props.onClickIcon ? (
                            <IconButton onClick={props.onClickIcon} style={{ color: "#999999" }}>
                                {props.icon}
                            </IconButton>
                        ) : <>{props.icon}</>
                        }
                    </InputAdornment>
                )
            }}
        />
    )
}


export function PasswordInputField<Variant extends IconInputFieldProps>(props: Variant) {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <IconInputField
            {...props}
            type={showPassword ? "text" : "password"}
            onClickIcon={() => setShowPassword(!showPassword)}
            icon={showPassword ? <VisibilityOff /> : <Visibility />}
        />
    )
}

export function InputTextField2(props: InputTextFieldProps) {
    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width}>
            <TextField
                type={props.type ?? "text"}
                variant="filled"
                style={{ width: '100%' }}
                className="inputTextField2"
                value={props.value}
                rows={props.rows}
                multiline={props.rows !== undefined && props.rows > 1}
                onChange={(e) => props.onValueChange && props.onValueChange(e.target.value)}
                error={!!props.error?.length && props.error.length > 0}
                helperText={props.error}
                sx={{
                    "& .MuiFilledInput-root": {
                        color: !!props.disabled ? "#999999" : "black",
                        pointerEvents: !!props.disabled ? "none" : "auto",
                        backgroundColor: !!props.disabled ? "transparent" : "#f3f3f3",
                    },
                }}
                {...props.textFieldProps}
            />
        </InputBox>
    )
}

export function NumberInputField(props: InputTextFieldProps) {
    const isInteger = (value: string) => {
        const regex = /^\d+$/;
        return regex.test(value);
    }

    return (
        <InputTextField2
            {...props}
            value={(props.value && isInteger(props.value)) ? props.value : ''}
            onValueChange={(value) => {
                if (isInteger(value) || value === '') {
                    props.onValueChange && props.onValueChange(value);
                }
            }}

        />
    )
}

export const useInputTextField = () => {
    const [value, setValue] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')

    const getProps = (): InputTextFieldProps => {
        return {
            value: value,
            onValueChange: setValue,
            error: error,
        };
    }

    const isEmpty = (): boolean => value.trim() === '';
    const clearInput = () => setValue('');
    const clearError = () => setError('');

    return {
        value,
        setValue,
        error,
        setError,
        getProps,
        isEmpty,
        clearInput,
        clearError,
    }
}