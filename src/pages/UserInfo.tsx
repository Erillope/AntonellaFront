import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
import { RoleApi } from "../api/role_api";
import ImageUploader from '../components/ImageUploader';
import { Fingerprint } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { SelectRoles } from '../components/SelectRoles';
import { BACK_URL } from "../api/config";
import { PermissionVerifier } from "../api/verifyPermissions";
import { toDateString } from "../api/date";


export const UserInfo = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const { register, control, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [dniError, setDniError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [birthdate, setBirthdate] = useState<Date | undefined>();
    const authApi = new AuthUserApi()
    const roleApi = new RoleApi();
    const permissionVerifier = new PermissionVerifier();
    const [roles, setRoles] = useState<string[]>([]);
    const [editable, setEditable] = useState(false);
    const { userId } = useParams();
    const [user, setUser] = useState<User>();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [photo, setPhoto] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [dni, setDni] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [active, setActive] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            const user = await authApi.getUser(userId ?? "");
            await verifyUserPermissions(user);
            let roles = await roleApi.getRoles();
            roles = roles.filter((role) => role.name !== 'super_admin');
            setRoles(roles.map((role) => role.name));
            setUser(user);
            if (user) {
                discartChanges(user);
            }
            else {
                navigate('/user/search/');
            }
        }
        fetchRoles();
    }, []);

    const verifyUserPermissions = async (selectedUser: User | undefined) => {
        const permissions = await permissionVerifier.getUserAccessPermissions()
        if (!permissions.read) {
            navigate('/');
        }
        const loggedUser = authApi.getLoggedUser();
        if (!!selectedUser?.roles?.includes('super_admin')) {
            setEditable(!!loggedUser?.roles?.includes('super_admin'));
        }
        else { setEditable(permissions.edit) }
    }

    const updateUser = async () => {
        const userData = getUserData();
        if (verifyRoles() || verifyPhoto()) return;
        const updatedUser = await authApi.updateUser(userData);
        if (verifyErrors(userData.email ?? "", userData.phoneNumber ?? "", userData.dni ?? "")) return;
        showSuccessMessage();
        setUser(updatedUser);
    }

    const getUserData = (): UpdateUserProps => {
        return {
            id: user?.id ?? '',
            phoneNumber: getValues('phoneNumber'),
            email: getValues('email'),
            name: getValues('name'),
            gender: selectedGender,
            birthdate: birthdate ?? new Date(),
            dni: getValues('dni'),
            address: getValues('address'),
            photo: photo.split(',')[1],
            roles: selectedRoles,
            status: active? 'ENABLE' : 'DISABLE'
        }
    }

    const isEmployee = (): boolean => {
        return !!user?.dni;
    }

    const verifyRoles = (): boolean => {
        if (!!!user?.dni){return false}
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
        if (!!!user?.dni){return false}
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
            title: "Usuario actualizado",
            text: `El usuario ha sido actualizado exitosamente.`,
            icon: "success",
            confirmButtonText: "OK"
        });
    }

    const clearErrors = () => {
        setPhoneNumberError('');
        setEmailError('');
        setNameError('');
        setBirthdateError('');
        setDniError('');
    }

    const discartChanges = (user: User) => {
        setPhoneNumber(user.phoneNumber);
        setValue('phoneNumber', user.phoneNumber);
        setEmail(user.email);
        setValue('email', user.email);
        setName(user.name);
        setValue('name', user.name);
        setSelectedGender(user.gender);
        setValue('gender', user.gender)
        setBirthdate(user.birthdate);
        setValue('birthdate', user.birthdate);
        setDni(user.dni ?? '');
        setValue('dni', user.dni);
        setPhoto(BACK_URL + user.photo);
        setAddress(user.address ?? '');
        setValue('address', user.address);
        setSelectedRoles(user.roles ?? []);
        setActive(user.status === 'ENABLE')
    }

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <form style={{ paddingTop: "20px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", rowGap: "30px" }} ref={formRef}
                onSubmit={handleSubmit(updateUser)}>
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'flex-start', rowGap: "30px" }}>
                    <div style={{ flex: "1 0 50%" }}>
                        <TextField
                            label="Celular"
                            variant="outlined"
                            margin="normal"
                            disabled={!editable}
                            value={phoneNumber}
                            {...register('phoneNumber', { required: 'El cecular es obligatorio' })}
                            error={!!errors.phoneNumber || !!(phoneNumberError.length > 0)}
                            helperText={typeof errors.phoneNumber?.message === 'string' ? errors.phoneNumber.message : phoneNumberError}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                            disabled={!editable}
                            value={email}
                            {...register('email', { required: 'El email es obligatorio' })}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={name}
                            disabled={!editable}
                            {...register('name', { required: 'El nombre es obligatorio' })}
                            onChange={(e) => setName(e.target.value)}
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
                                        disabled={!editable}
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
                                disabled={!editable}
                                render={({ field }) => (
                                    <DatePicker sx={{ width: "80%" }}
                                        {...field}
                                        label="Fecha de nacimiento"
                                        value={birthdate ? dayjs(birthdate) : null}
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
                        {isEmployee() &&
                            <TextField
                                label="Cedula"
                                variant="outlined"
                                margin="normal"
                                value={dni}
                                disabled={!editable}
                                {...register('dni', { required: 'La cedula es obligatoria' })}
                                onChange={(e) => setDni(e.target.value)}
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
                    {isEmployee() ?
                        <div style={{ flex: "1 0 50%", alignItems: 'center', display: "flex", flexDirection: 'column' }}>
                            <ImageUploader image={photo} text='Haz click o arrastra una foto de perfil'
                                onImageChange={(photo) => setPhoto(photo ?? '')}
                                disabled={!editable} />
                        </div>
                        : <div style={{ flex: "1 0 50%" }}></div>
                    }

                    {isEmployee() &&
                        <div style={{ flex: "1 0 50%" }}>
                            <TextField
                                label="Dirección"
                                variant="outlined"
                                margin="normal"
                                value={address}
                                disabled={!editable}
                                {...register('address', { required: 'El dirección es obligatoria' })}
                                onChange={(e) => setAddress(e.target.value)}
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
                    {isEmployee() &&
                        <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex', maxWidth: "50%" }}>
                            <SelectRoles roles={roles}
                                selectedRoles={selectedRoles}
                                disabled={!!user?.roles?.includes('super_admin') ? true : !editable}
                                onAddRole={(role) => setSelectedRoles([...selectedRoles, role])}
                                onRemoveRole={(role) => setSelectedRoles(selectedRoles.filter(r => r !== role))} />
                        </div>
                    }
                    <div style={{ width: '50%', display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "80%" }}>
                            <FormControlLabel
                                control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)
                                } disabled={!!user?.roles?.includes('super_admin') ? true : !editable} />}
                                label={active ? "Activo" : "Inactivo"}
                            />
                            <p>Fecha de creación: {user ? toDateString(user.createdDate) : ''}</p>
                        </div>
                        {editable &&
                            <div style={{ width: "80%", justifyContent: "flex-start", display: "flex", gap: "30px" }}>
                                <Button type="submit" className='submit-button'>Guardar Cambios</Button>
                                <Button className='submit-button2' onClick={() => user && discartChanges(user)}>Descartar Cambios</Button>
                            </div>
                        }

                    </div>
                </div>

            </form>
        </div>

    )
}