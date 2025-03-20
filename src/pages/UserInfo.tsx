import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toDateString } from "../api/date";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { UpdateUserInputs } from "../components/inputField/UpdateUserInputs";
import { UpdateUserForm } from "../components/UpdateUserForm";

export const UserInfo = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { register, control, handleSubmit, errors, phoneNumberError, emailError, nameError, dniError,
        birthdateError, selectedGender, setSelectedGender, birthdate, setBirthdate, photo, setPhoto,
        active, setActive, phoneNumber, setPhoneNumber, email, setEmail, name, setName, dni, setDni, address,
        setAddress, updateUser, user, selectedRoles, setSelectedRoles, discartChanges, formRef,
        isEmployee, roles, editable, init} = useUpdateUser();

    const notHaveReadPermissionCase = () => navigate('/');
    const notFoundUser = () => navigate('/user/search/');

    useEffect(() => init(userId??'', notHaveReadPermissionCase, notFoundUser), [])

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <UpdateUserForm formRef={formRef} handleSubmit={() => handleSubmit(updateUser)}
                editable={editable} discartChanges={() => user && discartChanges(user)}>
                <UpdateUserInputs register={register} control={control} errors={errors}
                    phoneNumberError={phoneNumberError} emailError={emailError} nameError={nameError}
                    birthdateError={birthdateError} dniError={dniError} roles={roles}
                    selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}
                    selectedGender={selectedGender} setSelectedGender={setSelectedGender}
                    birthdate={birthdate} setBirthdate={setBirthdate} photo={photo} setPhoto={setPhoto}
                    phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} email={email}
                    setEmail={setEmail} name={name} setName={setName} dni={dni} setDni={setDni}
                    address={address} setAddress={setAddress} active={active} setActive={setActive}
                    editable={editable} isEmployee={isEmployee()} 
                    isSuperAdmin={!!user?.roles?.includes('super_admin')} 
                    createdDate={user? toDateString(user.createdDate): ""} />
            </UpdateUserForm>
        </div>
    )
}