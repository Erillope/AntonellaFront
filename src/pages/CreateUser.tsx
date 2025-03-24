import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { CreateUserHeader } from '../components/CreateUserHeader';
import { CreateUserInputs } from '../components/inputField/CreateUserInputs';
import { CreateUserForm } from '../components/CreateUserForm';
import { useUserFormActions } from '../hooks/useUserFormActions';

export const CreateUser = () => {
    const { register, control, handleSubmit, errors, phoneNumberError, emailError, nameError, dniError,
        birthdateError, selectedGender, setSelectedGender, birthdate, setBirthdate, selectedRoles,
        setSelectedRoles, photo, setPhoto, createUser, creationUserType, changeCreationUserType, 
        formRef, roles, initCreate, selectedCategories, setSelectedCategories, isCategoriesOpen, clearForm
    } = useUser();

    const { userTypeClass, userTypeIcon, changeUserType, handleCreateUser, failureCreateAction
    } = useUserFormActions({changeCreationUserType, createUser, clearForm});

    useEffect(() => initCreate(failureCreateAction), []);

    return (
        <div style={{ paddingLeft: "100px", paddingRight: "100px" }}>
            <CreateUserHeader userType={creationUserType}
            buttonClass={userTypeClass} buttonIcon={userTypeIcon} changeUserType={changeUserType} />
            <CreateUserForm formRef={formRef} handleSubmit={() => handleSubmit(handleCreateUser)}>
                <CreateUserInputs register={register} control={control} errors={errors}
                    phoneNumberError={phoneNumberError} emailError={emailError} nameError={nameError}
                    birthdateError={birthdateError} dniError={dniError} roles={roles} birthdate={birthdate}  
                    selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}
                    userType={creationUserType} selectedGender={selectedGender} photo={photo}
                    setSelectedGender={setSelectedGender} setPhoto={setPhoto} setBirthdate={setBirthdate}  
                    selectedCategories={selectedCategories} onSelectedCategories={setSelectedCategories}
                    isCategoriesOpen={isCategoriesOpen}/>
            </CreateUserForm>
        </div>
    )
}