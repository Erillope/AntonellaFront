import { Controller, useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, InputAdornment } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AuthUserApi, CreateUserProps } from '../api/user_api';
import "../styles/form.css";
import Swal from "sweetalert2";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from '@mui/icons-material/Email';

export const CreateUser = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const { register, control, handleSubmit, formState: { errors }, getValues } = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const authApi = new AuthUserApi();

    const createUser = async () => {
        const userData = getUserData();
        await authApi.createUser(userData);
        if (verifyErrors(userData.email, userData.phoneNumber)) return;
        showSuccessMessage();
    }

    const getUserData = (): CreateUserProps => {
        return {
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate
        }
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
            title: "Usuario creado",
            text: `El usuario ha sido creado exitosamente.`,
            icon: "success",
            confirmButtonText: "OK"
        }).then(() => {
            clearForm();
        });
    }

    const clearErrors = () => {
        setPhoneNumberError('');
        setEmailError('');
        setNameError('');
        setBirthdateError('');
    }

    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <p style={{ fontWeight: "bold" }}>Por favor, complete los campos a continuación para registrar un nuevo usuario. Asegúrese de proporcionar información precisa para garantizar un proceso exitoso.</p>

            <form style={{ paddingTop: "20px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", rowGap: "30px" }} ref={formRef}
                onSubmit={handleSubmit(createUser)}>
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'flex-start', rowGap: "30px" }}>
                    <div style={{ flex: "1 0 50%" }}>
                        <TextField
                            label="Celular"
                            variant="outlined"
                            margin="normal"
                            {...register('phoneNumber', { required: 'El cecular es obligatorio' })}
                            error={!!errors.phoneNumber || !!(phoneNumberError.length > 0)}
                            helperText={typeof errors.phoneNumber?.message === 'string' ? errors.phoneNumber.message : phoneNumberError}
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
                            {...register('email', { required: 'El email es obligatorio' })}
                            error={!!errors.email || !!(emailError.length > 0)}
                            helperText={typeof errors.email?.message === 'string' ? errors.email.message : emailError}
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
                            {...register('name', { required: 'El nombre es obligatorio' })}
                            error={!!errors.name || !!(nameError.length > 0)}
                            helperText={typeof errors.name?.message === 'string' ? errors.name.message : nameError}
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
                <div style={{ width: "50%", display: 'flex', flexDirection: 'column', rowGap: "30px", justifyContent: "center", alignItems: 'center' }}>
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
                        <Button type="submit" className='submit-button'>Guardar Usuario</Button>
                    </div>
                </div>
            </form>
        </div>

    )
}