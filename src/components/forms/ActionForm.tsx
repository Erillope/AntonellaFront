import { Box, Button } from "@mui/material";
import { SubmitButton, FormBox, FormBoxProps } from "./FormBox";

export interface ActionFormProps extends FormBoxProps {
    mode?: "create" | "read" | "update";
    allowDelete?: boolean;
    allowEdit?: boolean;
    discartChanges?: () => void;
    delete?: () => void;
    edit?: () => void;
}

export function ActionForm(props: ActionFormProps) {
    return (
        <FormBox {...props} width={props.width ?? '50%'}
            submitChildren={<SubmitChildrens discartChanges={props.discartChanges}
                mode={props.mode ?? 'create'} allowDelete={props.allowDelete} delete={props.delete}
                edit={props.edit} allowEdit={props.allowEdit}/>
            }
            className="input-group">
            {props.children}
        </FormBox>
    )
}

export interface SubmitChildrensProps {
    mode: "create" | "read" | "update";
    allowDelete?: boolean;
    discartChanges?: () => void;
    delete?: () => void;
    edit?: () => void;
    allowEdit?: boolean;
}

function SubmitChildrens(props: SubmitChildrensProps) {
    return (
        <Box width='100%' display='flex' justifyContent='center' flexDirection='row'  gap={2}>
            {props.mode === 'create' &&
                <SubmitButton className="login-button" text="Guardar"
                    style={{ width: '15%' }} />
            }
            {props.mode === 'update' &&
                <>
                    <SubmitButton className="login-button" text="Guardar Cambios"
                        style={{width: '15%' }} />
                    <ActionButton text="Descartar cambios" onClick={props.discartChanges} />
                    {props.allowDelete && <ActionButton text="Eliminar" onClick={props.delete} />}
                </>


            }
            {props.mode === 'read' && props.allowEdit &&
                <ActionButton text="Editar" onClick={props.edit} />
            }
        </Box>
    )
}

export function ActionButton(props: { text: string; onClick?: () => void; }) {
    return (
        <Box width='15%'>
            <Button className={"login-button"} onClick={props.onClick} style={{ width: '100%' }}>
                {props.text}
            </Button>
        </Box>
    )
}