import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../api/user_api";
import "../styles/form.css";
import { toDateString } from "../api/date";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { initUserInfoPage } from "../util/initPage";
import { UpdateUserInputs } from "../components/inputField/UpdateUserInputs";
import { UpdateUserForm } from "../components/UpdateUserForm";

export const UserInfo = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<string[]>([]);
    const [editable, setEditable] = useState(false);
    const { userId } = useParams();
    const { register, control, handleSubmit, errors, phoneNumberError, emailError, nameError, dniError,
        birthdateError, selectedGender, setSelectedGender, birthdate, setBirthdate, photo, setPhoto,
        active, setActive, phoneNumber, setPhoneNumber, email, setEmail, name, setName, dni, setDni, address,
        setAddress, updateUser, user, setUser, selectedRoles, setSelectedRoles, discartChanges, formRef,
        isEmployee } = useUpdateUser();

    const notHaveReadPermissionCase = () => navigate('/');
    const haveReadPermissionCase = (editPermission: boolean) => setEditable(editPermission);
    const notFoundUser = () => navigate('/user/search/');
    const initRoles = (roles: string[]) => setRoles(roles);
    const initUser = (user: User) => setUser(user);
    const initData = (user: User) => discartChanges(user);

    useEffect(() => initUserInfoPage(userId ?? '', notHaveReadPermissionCase, haveReadPermissionCase,
        initRoles, initUser, initData, notFoundUser
    ), [])

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