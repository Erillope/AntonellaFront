import { Box } from "@mui/material";
import { FormBox, SubmitButton } from "./formBox"
import { ActionButton, ActionFormProps, SubmitChildrensProps } from "./ActionForm";

interface ServiceFormProps extends ActionFormProps {
    toForm?: () => void;
}

export const ServiceForm = (props: ServiceFormProps) => {
    return (
        <FormBox {...props} width={props.width ?? '50%'}
            submitChildren={<ServiceFormSubmitChildrens discartChanges={props.discartChanges}
                mode={props.mode ?? 'create'} allowDelete={props.allowDelete} delete={props.delete}
                edit={props.edit} allowEdit={props.allowEdit} toForm={props.toForm}/>
            }
            className="input-group">
            {props.children}
        </FormBox>
    )
}

interface ServiceFormSubmitChildrensProps extends SubmitChildrensProps {
    toForm?: () => void;
}

export const ServiceFormSubmitChildrens = (props: ServiceFormSubmitChildrensProps) => {
    return (
        <Box width='100%' display='flex' justifyContent='center' flexDirection='row' gap={2}>
            {props.mode === 'create' &&
                <SubmitButton className="login-button" text="Formulario"
                    style={{ width: '15%' }} />
            }
            {props.mode === 'update' &&
                <>
                    <ActionButton text="Formulario" onClick={props.toForm} />
                    <SubmitButton text="Guardar cambios"
                        style={{ width: '15%' }} />
                    <ActionButton text="Descartar cambios" onClick={props.discartChanges} />
                    {props.allowDelete && <ActionButton text="Eliminar" onClick={props.delete} />}
                </>
            }
            {props.mode === 'read' && props.allowEdit &&
                <>
                    <ActionButton text="Formulario" onClick={props.toForm} />
                    <ActionButton text="Editar" onClick={props.edit} />
                </>
            }
        </Box>
    )
}