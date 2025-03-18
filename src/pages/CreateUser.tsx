import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, JSX, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, InputAdornment } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AuthUserApi, CreateUserProps } from '../api/user_api';
import "../styles/form.css";
import Swal from "sweetalert2";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from '@mui/icons-material/Email';
import ImageUploader from '../components/ImageUploader';
import { Fingerprint, Person } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { SelectRoles } from '../components/SelectRoles';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { RoleApi } from '../api/role_api';
import dayjs from 'dayjs';
import { PermissionVerifier } from '../api/verifyPermissions';

export const CreateUser = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const { register, control, handleSubmit, formState: { errors }, getValues, setValue} = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [dniError, setDniError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState<Date|undefined>();
    const authApi = new AuthUserApi()
    const roleApi = new RoleApi();
    const permissionVerifier = new PermissionVerifier();

    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [photo, setPhoto] = useState<string>('');

    const [userType, setUserType] = useState<string>("Empleado");
    const [userTypeClass, setUserTypeClass] = useState<string>("submit-button2");
    const [userTypeIcon, setUserTypeIcon] = useState<JSX.Element>(<EngineeringIcon />);

    useEffect(() => {
        const fetchRoles = async () => {
            await verifyUserPermissions();
            let roles = await roleApi.getRoles();
            roles = roles.filter((role) => role.name !== 'super_admin');
            setRoles(roles.map((role) => role.name));
        }
        fetchRoles();
    }, []);

    const createUser = async () => {
        const userData = getUserData();
        if (verifyRoles() || verifyPhoto()) return;
        const user = await authApi.createUser(userData);
        if (verifyErrors(userData.email, userData.phoneNumber, userData.employeeData?.dni)) return;
        showSuccessMessage();
        console.log(user);
    }

    const getUserData = (): CreateUserProps => {
        return {
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate??new Date(),
            employeeData: {
                dni: getValues('dni'),
                address: getValues('address'),
                photo: photo.split(',')[1],
                roles: selectedRoles
            }
        }
    }

    const verifyUserPermissions = async() => {
        const permissions = await permissionVerifier.getUserAccessPermissions();
        if (!permissions.create){
            navigate('/')
        }
    }

    const verifyRoles = (): boolean => {
        if (selectedRoles.length === 0) {
            Swal.fire({
                title: "Roles no seleccionados",
                text: `Por favor seleccione al menos un rol para el usuario.`,
                icon: "error",
                confirmButtonText: "OK"
            })
            return true;
        }
        return false
    }

    const verifyPhoto = (): boolean => {
        if (photo === '') {
            Swal.fire({
                title: "Foto no seleccionada",
                text: `Por favor seleccione una foto de perfil para el usuario.`,
                icon: "error",
                confirmButtonText: "OK"
            })
            return true;
        }
        return false
    }

    const verifyErrors = (email: string, phoneNumber: string, dni: string | undefined): boolean => {
        clearErrors();
        if (alreadyExistsUser()) {
            showAlreadyExistsMessage(email, phoneNumber, dni);
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
        if (authApi.isError('INVALID_DNI')) {
            setDniError(authApi.getErrorMessage());
            return true;
        }
        return false
    }

    const alreadyExistsUser = (): boolean => {
        return authApi.isError('PHONE_NUMBER_ALREADY_REGISTERED') || authApi.isError('EMAIL_ALREADY_REGISTERED')
    }

    const showAlreadyExistsMessage = (email: string, phoneNumber: string, dni: string | undefined) => {
        let message = `El usuario con email ${email} o número de celular ${phoneNumber} ya se encuentra registrado en el sistema.`;
        if (dni) {
            message = `El usuario con email ${email}, número de celular ${phoneNumber} o cedula ${dni} ya se encuentra registrado en el sistema.`;
        }
        Swal.fire({
            title: "Usuario ya registrado",
            text: message,
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
        setDniError('');
    }

    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        setPhoto('')
        setSelectedGender('');
        setValue('gender', null);
        setSelectedRoles([]);
        setBirthdate(undefined)
        setValue('birthdate', null);
    };

    const changeUserType = () => {
        if (userType === "Empleado") {
            setUserType("Cliente");
            setUserTypeClass("submit-button");
            setUserTypeIcon(<Person />);
        } else {
            setUserType("Empleado");
            setUserTypeClass("submit-button2");
            setUserTypeIcon(<EngineeringIcon />);
        }
    }

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: "70%", flex: "1 0 70%" }}><p style={{ fontWeight: "bold" }}>Por favor, complete los campos a continuación para registrar un nuevo usuario. Asegúrese de proporcionar información precisa para garantizar un proceso exitoso.</p></div>
                <div style={{ flex: "1 0 30%", display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button className={userTypeClass} endIcon={userTypeIcon} onClick={changeUserType}>
                        Crear {userType}
                    </Button>
                </div>
            </div>

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
                    <div style={{ flex: "1 0 50%", display: 'flex', flexDirection: 'column', rowGap: "30px", justifyContent: "center", alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <Controller
                                name="birthdate"
                                control={control}
                                rules={{ required: "La fecha de nacimiento es obligatoria" }}
                                render={({ field }) => (
                                    <DatePicker sx={{ width: "80%" }}
                                        {...field}
                                        label="Fecha de nacimiento"
                                        value={birthdate? dayjs(birthdate): null}
                                        onChange={(date) => { setBirthdate(date?.toDate()); field.onChange(date) }}
                                        slotProps={{
                                            textField: {
                                                error: !!errors.birthdate || !!(birthdateError.length > 0),
                                                helperText: typeof errors.birthdate?.message === 'string' ? errors.birthdate.message : birthdateError,
                                            },
                                        }} />
                                )}
                            />
                        </LocalizationProvider>
                        {userType === "Cliente" &&
                            <TextField
                                label="Cedula"
                                variant="outlined"
                                margin="normal"
                                {...register('dni', { required: 'La cedula es obligatoria' })}
                                error={!!errors.dni || !!(dniError.length > 0)}
                                helperText={typeof errors.dni?.message === 'string' ? errors.dni.message : dniError}
                                inputMode="numeric"
                                style={{ width: "80%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Fingerprint />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        }
                    </div>
                    {userType === "Cliente" ?
                        <div style={{ flex: "1 0 50%", alignItems: 'center', display: "flex", flexDirection: 'column' }}>
                            <ImageUploader image={photo} text='Haz click o arrastra una foto de perfil'
                            onImageChange={(photo) => setPhoto(photo??'')}/>
                        </div>
                        : <div style={{ flex: "1 0 50%" }}></div>
                    }

                    {userType === "Cliente" &&
                        <div style={{ flex: "1 0 50%"}}>
                            <TextField
                                label="Dirección"
                                variant="outlined"
                                margin="normal"
                                {...register('address', { required: 'El dirección es obligatoria' })}
                                error={!!errors.address}
                                helperText={typeof errors.address?.message === 'string' ? errors.address.message : ""}
                                style={{ width: "80%" }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <HomeIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </div>
                    }
                    {userType === "Cliente" &&
                        <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex', maxWidth: "50%"}}>
                            <SelectRoles roles={roles}
                            selectedRoles={selectedRoles}
                            onAddRole={(role) => setSelectedRoles([...selectedRoles, role])}
                            onRemoveRole={(role) => setSelectedRoles(selectedRoles.filter(r => r !== role))}/>
                        </div>
                    }
                    <div style={{ width: '50%', display: "flex", justifyContent: "center"}}>
                        <div style={{width: "80%", justifyContent: "flex-start", display: "flex"}}>
                            <Button type="submit" className='submit-button'>Guardar Usuario</Button>
                        </div>
                    </div>
                </div>

            </form>
        </div>

    )
}