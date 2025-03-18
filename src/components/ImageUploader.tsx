import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Avatar, Typography } from "@mui/material";

interface ImageUploaderProps {
    text?: string;
    image?: string;
    onImageChange?: (base64: string | null) => void;
    disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange, text, disabled=false}) => {

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const base64Data = result.split(",")[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
        });
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const base64 = await toBase64(file);
            if (onImageChange) onImageChange(`data:image/jpeg;base64,${base64}`);
        }
    }, [onImageChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                width: 150,
                height: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #aaa",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: disabled ? "" : "pointer",
                bgcolor: isDragActive ? "#f0f0f0" : "inherit",
            }}
        >
            <input {...getInputProps()} disabled={disabled}/>
            {image ? (
                <Avatar src={image} variant="square" sx={{ width: "100%", height: "100%", borderRadius: 0 }}/>
            ) : (
                <Typography variant="body2" align="center">
                    {isDragActive ? "Suelta la imagen aquí" : text??"Haz clic o arrastra una imagen"}
                </Typography>
            )}
        </Box>
    );
};

export default ImageUploader;
