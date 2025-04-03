import { v4 as uuidv4 } from "uuid";
import { Avatar, Badge, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useState } from "react";
import { toBase64 } from "../../utils/toBase64";
import { useDropzone } from "react-dropzone";
import { Delete } from "@mui/icons-material";

export interface ImageListInputProps {
    images?: string[];
    onImagesChange?: (images: string[]) => void;
    disabled?: boolean;
}
export const ImageListInput: React.FC<ImageListInputProps> = ({ images = [], onImagesChange, disabled }) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const base64 = await toBase64(file);
            onImagesChange && onImagesChange([...images, `data:image/jpeg;base64,${base64}`]);
        }
    }, [images]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: 'flex-start', width: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} {...getRootProps()}>
                <input {...getInputProps()} disabled={disabled}/>
                <h3>Imágenes</h3>
                <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                disabled={disabled}>
                    <AddIcon />
                </IconButton>
            </Box>
            <div style={{ display: 'flex', overflowX: 'auto', width: '100%', gap: 1, backgroundColor: '#E0E0E0' }}>
                {images.map((image, index) => (
                    <div key={uuidv4()} style={{ flexShrink: 0 }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            badgeContent={
                                <IconButton sx={{ bgcolor: "#AF234A", width: 24, height: 24, color:'white'}}
                                onClick={() => onImagesChange?.(images.filter((_, i) => i !== index))}
                                disabled={disabled}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            }
                        >
                            <Avatar src={image} variant="square" sx={{ width: 150, height: 150 }} />
                        </Badge>
                    </div>
                ))}
                {images.length === 0 && (
                    <canvas style={{backgroundColor: ''}}></canvas>
                )}
            </div>
        </div>
    )
}


export const useImageListInput = () => {
    const [imageList, setImageList] = useState<string[]>([]);

    const getImageListInputProps = (): ImageListInputProps => {
        return {
            images: imageList,
            onImagesChange: setImageList,
        }
    }

    const verifySelectedImageError = (notSelectedImageAction: () => void): boolean => {
        if (imageList.length === 0){
            notSelectedImageAction()
            return true;
        }
        return false;
    }

    const clearInput = () => setImageList([])

    return {
        getImageListInputProps,
        verifySelectedImageError,
        clearInput,
        setImageList,
        imageList,
    }
}