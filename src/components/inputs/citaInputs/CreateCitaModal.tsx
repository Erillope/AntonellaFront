import { Box } from "@mui/material"
import { ModalBox } from "../../ModalBox"
import { PlusButton } from "../../PlusButton"
import { CitaForm, CitaFormInputsProps } from "./CitaForm";
import { AnswerFormProps } from "./AnswerForm";

interface CreateCitaModalProps {
    init?: () => void;
    citaProps?: CitaFormInputsProps
    answerFormProps?: AnswerFormProps
    totalServicios?: number;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    onCreateSubmit?: () => void;
    mode?: 'create' | 'edit';
    onDiscard?: () => void;
    onEditSubmit?: () => void;
    onDelete?: () => void;
}

export const CreateCitaModal = (props: CreateCitaModalProps) => {

    return (
        <Box height={'100%'}>
            <PlusButton label={`Servicios (${props.totalServicios??0})`} onClick={() => {props.setOpen?.(true);props.init?.()}}/>
            <ModalBox open={props.open} setOpen={props.setOpen} width="80%" height="100%">
                <CitaForm citaInputsProps={props.citaProps}
                mode={props.mode ?? 'create'}
                answerFormProps={props.answerFormProps}
                onCreateSubmit={props.onCreateSubmit}
                onDiscard={props.onDiscard}
                onEditSubmit={props.onEditSubmit}
                onDelete={props.onDelete}
                />
                
            </ModalBox>
        </Box>
    )
}