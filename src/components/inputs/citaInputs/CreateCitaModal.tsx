import { Box } from "@mui/material"
import { ModalBox } from "../../ModalBox"
import { PlusButton } from "../../PlusButton"
import { CreateCitaForm, CreateCitaFormProps } from "./CreateCitaForm"

interface CreateCitaModalProps {
    init?: () => void;
    citaProps?: CreateCitaFormProps
    totalServicios?: number;
    open?: boolean;
    setOpen?: (open: boolean) => void;
}

export const CreateCitaModal = (props: CreateCitaModalProps) => {
    return (
        <Box height={'100%'}>
            <PlusButton label={`Servicios (${props.totalServicios??0})`} onClick={() => {props.setOpen?.(true);props.init?.()}}/>
            <ModalBox open={props.open} setOpen={props.setOpen}>
                <CreateCitaForm {...props.citaProps}/>
            </ModalBox>
        </Box>
    )
}