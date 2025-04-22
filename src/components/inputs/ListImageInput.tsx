import { Avatar, Badge, Box, FormHelperText, IconButton } from "@mui/material";
import { InputBox } from "./InputBox"
import { toBase64 } from "../../utils/toBase64";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DropImageBox } from "./ImageInput";
import React from "react";
import { Delete } from "@mui/icons-material";

export interface ListImageInputProps {
    labelText?: string;
    disabled?: boolean;
    width?: string;
    images?: string[];
    onChange?: (value: string[]) => void;
    error?: string;
}

export const ListImageInput = (props: ListImageInputProps) => {


    return (
        <InputBox labelText={props.labelText} disabled={props.disabled} width={props.width ?? "100%"}>
            <Box className="listimageInputBox" sx={{ width: '100%' }}>
                {props.disabled ? null : <DropZoneBox {...props} />}
                {props.images && props.images.map((image, index) => (
                    <Badge
                        overlap="circular"
                        key={index}
                        sx={{ width: '20%' }}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        badgeContent={
                            <IconButton className="delete-image-button"
                                onClick={() => props.onChange?.(props.images?.filter((_, i) => i !== index) ?? [])}
                                disabled={props.disabled}>
                                {props.disabled ? null : <Delete fontSize="small" />}
                            </IconButton>
                        }
                    >
                        <Avatar key={index} src={image} variant="square" sx={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                    </Badge>
                ))}
            </Box>
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </InputBox>
    )
}


const DropZoneBox = (props: ListImageInputProps) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const base64 = await toBase64(file);
            if (props.onChange) props.onChange([...props.images ?? [], `data:image/jpeg;base64,${base64}`]);
        }
    }, [props.images]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });
    return (
        <Box
            {...getRootProps()}
            sx={{ cursor: props.disabled ? "" : "pointer", minWidth: '20%', height: '100%' }}>
            <input {...getInputProps()} disabled={props.disabled} />
            <DropImageBox color="#DFDFDF" height="80%" />
        </Box>
    )
}


export const useListImageInput = () => {
    const [images, setImages] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>("");

    const getProps = (): ListImageInputProps => {
        return {
            images,
            onChange: setImages,
            error,
        }
    }

    const clearInput = () => setImages([]);
    const clearError = () => setError("");
    const isEmpty = (): boolean => images.length === 0;

    return {
        images,
        setImages,
        getProps,
        clearInput,
        clearError,
        isEmpty,
        setError
    };
}