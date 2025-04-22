import { Box, IconButton, Modal } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface ModalBoxProps {
    children?: React.ReactNode
    open?: boolean
    setOpen?: (open: boolean) => void
}

export const ModalBox = (props: ModalBoxProps) => {

    return (
        <Modal open={props.open??false}>
            <Box bgcolor='white' width='70%' maxHeight='100%' position='absolute' top='50%' left='50%'
                sx={{ transform: 'translate(-50%, -50%)' }} borderRadius={2} boxShadow={24}
                display={"flex"} flexDirection="column" alignItems="center" overflow={"auto"}>
                <IconButton onClick={() => props.setOpen?.(false)}
                    sx={{
                        position: "absolute", top: 8, right: 8, color: "white", backgroundColor: "#F44565", "&:hover": { backgroundColor: "#AF234A" },
                    }}>
                    <CloseIcon />
                </IconButton>
                {props.children}
            </Box>
        </Modal>
    )
}