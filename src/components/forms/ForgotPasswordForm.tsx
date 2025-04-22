import { Link } from "react-router-dom";
import { SubmitButton, FormBox, FormBoxProps } from "./FormBox";

interface ForgotPasswordFormProps extends FormBoxProps {
    buttonText?: string;
}

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
    const submitChildren = <SubmitButton className="login-button" text={props.buttonText} />;

    return (
        <FormBox {...props} width={props.width ?? '50%'} submitChildren={submitChildren}>
            <InstructionsMessage />
            {props.children}
            <HaveAccountLink />
        </FormBox>
    )
}


function InstructionsMessage() {
    return (
        <p className="instructions-message">
            Ingrese el correo electrónico asociado a su cuenta Antonella.
        </p>
    )
}


function HaveAccountLink() {
    return (
        <div>
            <Link to="/login/"
                className="link">¿Ya tienes una cuenta? Inicia sesión aquí</Link>
        </div>
    )
}