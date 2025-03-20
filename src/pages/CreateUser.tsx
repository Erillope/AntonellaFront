import { useNavigate } from 'react-router-dom';
import { useState, JSX, useEffect } from 'react';
import { Person } from '@mui/icons-material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useCreateUser } from '../hooks/useCreateUser';
import { CreateUserHeader } from '../components/CreateUserHeader';
import { CreateUserInputs } from '../components/inputField/CreateUserInputs';
import { CreateUserForm } from '../components/CreateUserForm';

export const CreateUser = () => {
    const navigate = useNavigate();
    const [userTypeClass, setUserTypeClass] = useState<string>("submit-button2");
    const [userTypeIcon, setUserTypeIcon] = useState<JSX.Element>(<EngineeringIcon />);

    const toClient = () => { setUserTypeClass("submit-button2"); setUserTypeIcon(<EngineeringIcon />) }
    const toEmployee = () => { setUserTypeClass("submit-button"); setUserTypeIcon(<Person />) }

    const { register, control, handleSubmit, errors, phoneNumberError, emailError, nameError, dniError,
        birthdateError, selectedGender, setSelectedGender, birthdate, setBirthdate, selectedRoles,
        setSelectedRoles, photo, setPhoto, createUser, userType, changeUserType, formRef, roles, init
    } = useCreateUser('cliente', toClient, toEmployee);

    useEffect(() => init(() => navigate('/')), []);

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <CreateUserHeader userType={userType} buttonClass={userTypeClass} buttonIcon={userTypeIcon}
                changeUserType={changeUserType} />
            <CreateUserForm formRef={formRef} handleSubmit={() => handleSubmit(createUser)}>
                <CreateUserInputs register={register} control={control} errors={errors}
                    phoneNumberError={phoneNumberError} emailError={emailError} nameError={nameError}
                    birthdateError={birthdateError} dniError={dniError} roles={roles}
                    selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}
                    userType={userType} selectedGender={selectedGender} setSelectedGender={setSelectedGender}
                    birthdate={birthdate} setBirthdate={setBirthdate} photo={photo} setPhoto={setPhoto} />
            </CreateUserForm>
        </div>

    )
}