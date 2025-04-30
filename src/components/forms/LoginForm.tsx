import { Link } from "react-router-dom";
import { SubmitButton, FormBox, FormBoxProps } from "./FormBox";


export function LoginForm(props: FormBoxProps) {
    const submitChildren = props.submitChildren ?? <SubmitButton className="login-button" text="Ingresar" />;

    return (
        <FormBox {...props} width={props.width ?? '55%'} submitChildren={submitChildren}>
            {props.children}
            <ForgotPasswordLink />
        </FormBox>
    )
}


function ForgotPasswordLink() {
    return (
        <div style={{ width: '100%' }}>
            <Link to="/password/reset/" style={{ fontSize: '14px'}}
                className="link">¿Has olvidado tu contraseña?</Link>
        </div>
    )
}