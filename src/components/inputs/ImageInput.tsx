import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../../utils/toBase64";
import { Box, Avatar, Typography, FormHelperText } from "@mui/material";
import { InputBox } from "./InputBox";
import uploadIcon from "../../assets/UPLOAD.svg";

export interface ImageInputProps {
    error?: string;
    disabled?: boolean;
    labelText?: string;
    onChange?: (value: string) => void;
    value?: string;
    width?: string;
    height?: string;
}

export const ImageInput = (props: ImageInputProps) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const base64 = await toBase64(file);
            if (props.onChange) props.onChange(`data:image/jpeg;base64,${base64}`);
        }
    }, [props.onChange]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const boxWidthHeigth = (): { width: string | number, height: string | number } => {
        if (props.value) {
            return { width: props.width?? 200, height: props.height ?? 200 };
        }
        return { width: props.width?? '100%', height: props.height ?? 200 }
    };

    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width ?? "100%"}>
            <Box
                {...getRootProps()}
                sx={{ ...boxWidthHeigth(), cursor: props.disabled ? "" : "pointer" }}
                className="imageInputBox">
                <input {...getInputProps()} disabled={props.disabled} />
                <ImageInputBox value={props.value} />
            </Box>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </InputBox>
    );
}


function ImageInputBox(props: ImageInputProps) {
    return (
        <>
            {props.value ? (
                <Avatar src={props.value} variant="square" sx={{ width: '100%', height: '100%', borderRadius: '8px' }} />
            ) : (
                <DropImageBox />
            )}
        </>
    )
}


export const DropImageBox = (props: {color?: string, width?: string, height?: string}) => {
    return (
        <Box display={"flex"} flexDirection="column" alignItems="center" justifyContent="center" gap={1} bgcolor={props.color ?? '#f3f3f3'} borderRadius={2} padding={2} minWidth={props.width} minHeight={props.height}>
            <Avatar src={uploadIcon} />
            <Typography variant="body2" align="center" color="#8D8D8D">
                Haz clic o arrastra una imagen
            </Typography>
        </Box>
    )
}

export const useImageInput = () => {
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const getProps = (): ImageInputProps => {
        return {
            value: value,
            onChange: setValue,
            error: error,
        };
    };

    const isEmpty = (): boolean => value.trim() === "";
    const clearInput = () => setValue("");
    const clearError = () => setError("");

    return {
        value,
        setValue,
        getProps,
        setError,
        error,
        isEmpty,
        clearInput,
        clearError,
    };
}