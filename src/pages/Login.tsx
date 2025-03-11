import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthUserApi, User } from '../api/user_api'
import "../styles/login.css";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneIcon from "@mui/icons-material/Phone";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const authApi = new AuthUserApi();

  const signIn = async () => {
    const phoneNumber = getValues('phoneNumber');
    const password = getValues('password');
    const user = await authApi.signIn(phoneNumber, password);
    if (verifyErrors()) return;
    if (!user) return;
    setCookie(user);
    navigate('/');
  }

  const verifyErrors = (): boolean => {
    clearErrors();
    if (authApi.isError('PHONE_NUMBER_NOT_REGISTERED')) {
      setPhoneNumberError(authApi.getErrorMessage());
      return true;
    }
    if (authApi.isError('ICORRECT_PASSWORD')) {
      setPasswordError(authApi.getErrorMessage());
      return true;
    }
    return false;
  }

  const clearErrors = () => {
    setPhoneNumberError('');
    setPasswordError('');
  }

  const setCookie = (user: User) => {
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
  }

  return (
    <form onSubmit={handleSubmit(signIn)} className="column" style={{ width: '100%' }}>
      <div style={{ paddingBottom: '20px', display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <TextField
          label="Celular"
          variant="outlined"
          margin="normal"
          className="input"
          {...register('phoneNumber', { required: 'El cecular es obligatorio' })}
          error={!!errors.phoneNumber || !!(phoneNumberError.length > 0)}
          helperText={typeof errors.phoneNumber?.message === 'string' ? errors.phoneNumber.message : phoneNumberError}
          inputMode="numeric"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <PhoneIcon style={{color: "#AF234A"}}/>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          className="input"
          {...register('password', { required: 'La contraseña es obligatoria' })}
          error={!!errors.password || !!(passwordError.length > 0)}
          helperText={typeof errors.password?.message === 'string' ? errors.password.message : passwordError}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} style={{color: "#AF234A"}}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <div style={{ width: '60%', position: 'relative' }}>
          <Link to="/password/reset/" style={{ position: 'absolute', right: 0, fontSize: '13px' }}
            className="link">¿Has olvidado tu contraseña?</Link>;
        </div>
      </div>

      <Button type="submit" className="login-button">Ingresar</Button>
    </form>
  );
};

export default Login;
