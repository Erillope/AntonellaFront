import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthUserApi, User, UpdateUserProps } from "../api/user_api";
import { Controller, useForm } from 'react-hook-form';
import {
    TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, InputAdornment,
    Switch, FormControlLabel
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import "../styles/form.css";
import Swal from "sweetalert2";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import dayjs from "dayjs";

export const UserInfo = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [user, setUser] = useState<User>();
    const { userId } = useParams();
    const authApi = new AuthUserApi();
    const [active, setActive] = useState(true);

    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());

    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await authApi.getUser(userId ?? "");
            if (authApi.isError("USER_NOT_FOUND")) {
                navigate("/user/search/");
            }
            setUser(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            discartChanges();
        }
    }, [user]);

    const updateUser = async () => {
        const user = await authApi.updateUser(getUserData());
        if (verifyErrors(getValues('email'), getValues('phoneNumber'))) return;
        setUser(user);
        showSuccessMessage();
    }

    const verifyErrors = (email: string, phoneNumber: string): boolean => {
        clearErrors();
        if (alreadyExistsUser()) {
            showAlreadyExistsMessage(email, phoneNumber);
            return true;
        };
        if (authApi.isError('INVALID_PHONE_NUMBER')) {
            setPhoneNumberError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_EMAIL')) {
            setEmailError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_NAME')) {
            setNameError(authApi.getErrorMessage());
            return true;
        }
        if (authApi.isError('INVALID_BIRTHDATE')) {
            setBirthdateError(authApi.getErrorMessage());
            return true;
        }
        return false
    }

    const alreadyExistsUser = (): boolean => {
        return authApi.isError('PHONE_NUMBER_ALREADY_REGISTERED') || authApi.isError('EMAIL_ALREADY_REGISTERED')
    }

    const discartChanges = () => {
        setPhoneNumber(user?.phoneNumber ?? "");
        setEmail(user?.email ?? "");
        setName(user?.name ?? "");
        setValue('birthdate', dayjs(user?.birthdate));
        setValue('gender', user?.gender ?? "")
        setSelectedGender(user?.gender ?? "");
        setActive(user?.status === "ENABLE");
    }

    const getUserData = (): UpdateUserProps => {
        return {
            id: user?.id ?? "",
            phoneNumber: phoneNumber,
            email: email,
            name: name,
            gender: selectedGender,
            birthdate: birthdate,
            status: active ? "ENABLE" : "DISABLE"
        }
    }

    const showAlreadyExistsMessage = (email: string, phoneNumber: string) => {
        Swal.fire({
            title: "Usuario ya registrado",
            text: `El usuario con email ${email} o número de celular ${phoneNumber} ya se encuentra registrado en el sistema.`,
            icon: "error",
            confirmButtonText: "OK"
        })
    }

    const showSuccessMessage = () => {
        Swal.fire({
            title: "Usuario actualizado",
            text: "El usuario ha sido actualizado exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    }

    const clearErrors = () => {
        setPhoneNumberError('');
        setEmailError('');
        setNameError('');
        setBirthdateError('');
    }

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <p style={{fontWeight: "bold" }}>Aquí podrá visualizar o editar los datos del usuario {user?.name}. Recuerde que puede descartar los cambios en cualquier momento antes de presionar el boton "Guardar".</p>

            <form style={{ paddingTop: "20px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", rowGap: "20px" }}
                onSubmit={handleSubmit(updateUser)}>
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'flex-start', rowGap: "20px" }}>
                    <div style={{ flex: "1 0 50%" }}>
                        <TextField
                            label="Celular"
                            variant="outlined"
                            margin="normal"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            error={!!(phoneNumberError.length > 0) || phoneNumber.length == 0}
                            helperText={phoneNumber.length == 0 ?  "El celular es obligatorio": phoneNumberError}
                            inputMode="numeric"
                            style={{ width: "80%" }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <PhoneIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </div>

                    <div style={{ flex: "1 0 50%" }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!(emailError.length > 0) || email.length == 0}
                            helperText={email.length == 0 ? "El email es obligatorio": emailError}
                            style={{ width: "80%" }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </div>

                    <div style={{ flex: "1 0 50%" }}>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!(nameError.length > 0) || name.length == 0}
                            helperText={name.length == 0 ? "El nombre es obligatorio": nameError}
                            style={{ width: "80%" }}
                        />
                    </div>

                    <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex' }}>
                        <FormControl variant='outlined' style={{ width: "80%" }} error={!!errors.gender}>
                            <InputLabel>Género</InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: "Seleccione un género por favor" }}
                                render={({ field }) => (
                                    <Select {...field}
                                        value={selectedGender}
                                        onChange={(e) => { setSelectedGender(e.target.value); field.onChange(e.target.value) }}
                                        style={{ width: "100%" }}>
                                        <MenuItem value="MASCULINO">Masculino</MenuItem>
                                        <MenuItem value="FEMENINO">Femenino</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.gender && <FormHelperText>
                                {typeof errors.gender?.message === 'string' ? errors.gender.message : ""}
                            </FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div style={{ width: "50%", display: 'flex', flexDirection: 'column', rowGap: "10px", justifyContent: "center", alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <Controller
                            name="birthdate"
                            control={control}
                            rules={{ required: "La fecha de nacimiento es obligatoria" }}
                            render={({ field }) => (
                                <DatePicker sx={{ width: "80%" }}
                                    {...field}
                                    label="Fecha de nacimiento"
                                    onChange={(date) => { setBirthdate(date); field.onChange(date) }}
                                    slotProps={{
                                        textField: {
                                            error: !!errors.birthdate || !!(birthdateError.length > 0),
                                            helperText: typeof errors.birthdate?.message === 'string' ? errors.birthdate.message : birthdateError,
                                        },
                                    }} />
                            )}
                        />
                    </LocalizationProvider>

                    <div style={{ width: '80%', display: "flex", justifyContent: "flex-start" }}>
                        <FormControlLabel
                            control={<Switch checked={active} onChange={(e) => {
                                setActive(e.target.checked)
                            }} />}
                            label={active ? "Activo" : "Inactivo"}
                        />

                    </div>
                    <div style={{ width: '80%', display: "flex", justifyContent: "flex-start" }}>
                        <p>Fecha de creación: {user?.createdDate.toISOString().split('T')[0]}</p>
                    </div>
                    <div style={{ width: '80%', display: "flex", justifyContent: "flex-start", gap: "30px" }}>
                        <Button type="submit" className='submit-button'>Guardar Cambios</Button>
                        <Button className='submit-button2' onClick={discartChanges}>Descartar Cambios</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}