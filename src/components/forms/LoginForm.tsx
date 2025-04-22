import { Link } from "react-router-dom";
import { SubmitButton, FormBox, FormBoxProps } from "./formBox";


export function LoginForm(props: FormBoxProps) {
    const submitChildren = props.submitChildren ?? <SubmitButton className="login-button" text="Ingresar" />;

    return (
        <FormBox {...props} width={props.width ?? '50%'} submitChildren={submitChildren}>
            {props.children}
            <ForgotPasswordLink />
        </FormBox>
    )
}


function ForgotPasswordLink() {
    return (
        <div style={{ width: '60%' }}>
            <Link to="/password/reset/"
                className="link">¿Has olvidado tu contraseña?</Link>
        </div>
    )
}