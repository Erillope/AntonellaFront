import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { PhoneInputField } from '../components/inputField/PhoneInputField';
import { PasswordInputField } from "../components/inputField/PasswordInputField";
import { useLogin } from "../hooks/useLogin";
import { LoginForm } from "../components/LoginForm";


export const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, errors, phoneNumberError,
        passwordError, signIn } = useLogin(() => navigate('/'));

    return (
        <LoginForm handleSubmit={() => handleSubmit(signIn)}>
            <PhoneInputField register={register} errors={errors} phoneNumberError={phoneNumberError}
            iconStyle={{ color: "#AF234A" }}/>
            <PasswordInputField register={register} errors={errors} passwordError={passwordError}/>
        </LoginForm>
    );
};