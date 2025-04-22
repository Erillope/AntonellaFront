import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/forms/LoginForm";
import { IconInputField, PasswordInputField } from "../components/inputs/InputTextField";
import { Phone } from "@mui/icons-material";

export const Login = () => {
    const navigate = useNavigate();
    const { signIn, phoneNumberProps, passwordProps } = useLogin({afterLogin: () => navigate("/")});

    return (
        <LoginForm handleSubmit={signIn}>
            <IconInputField labelText="Celular" icon={<Phone/>} {...phoneNumberProps}/>
            <PasswordInputField labelText="Contraseña" {...passwordProps}/>
        </LoginForm>
    );
};