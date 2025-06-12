import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import '../../styles/form.css';
import React, { useEffect } from "react";

export interface FormBoxProps {
    handleSubmit?: () => void;
    children?: React.ReactNode;
    width?: string;
    submitChildren?: React.ReactNode;
    className?: string;
}


export function FormBox(props: FormBoxProps) {
    const { handleSubmit } = useForm();

    useEffect(() => {
        const handleBeforeUnload = (e: any) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return (
        <form onSubmit={props.handleSubmit && handleSubmit(props.handleSubmit)} className="form-control"
            style={{ width: props.width ?? '50%' }}>
            <div className={props.className ?? "login-box"}>
                {props.children}
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
                {props.submitChildren}
            </div>
        </form>
    )
}


export function SubmitButton(props: { className?: string; text?: string; style?: React.CSSProperties; onClick?: () => void; }) {
    return (
        <Button type={props.onClick !== undefined ? undefined : "submit"} className={props.className ?? "login-button"} style={props.style} onClick={props.onClick}>
            {props.text}
        </Button>
    )
}