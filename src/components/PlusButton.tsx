import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"

export interface PlusButtonProps {
    label?: string;
    onClick?: () => void;
}

export const PlusButton = (props: PlusButtonProps) => {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <h3>{props.label}</h3>
                <IconButton size="small" style={{ backgroundColor: '#F44565', color: 'white' }}
                    onClick={props.onClick}>
                    <AddIcon />
                </IconButton>
        </Box>
    )
}