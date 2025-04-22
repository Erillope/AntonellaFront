import { Box, Typography } from "@mui/material";

interface InputBoxProps {
    disabled?: boolean;
    labelText?: string;
    children?: React.ReactNode;
    width?: string;
    centerLabel?: boolean;
}

export function InputBox(props: InputBoxProps) {
    return (
        <Box sx={{
            width: props.width ? props.width : '100%',
            alignItems: props.centerLabel ? 'center' : '',
        }} className="inputBox">
            <Typography variant="subtitle2" className="inputTextLabel" >
                {props.labelText}
            </Typography>
            <Box display='flex' alignItems='center' flexDirection='column' width='100%'>
                {props.children}
            </Box>
        </Box>
    )
}