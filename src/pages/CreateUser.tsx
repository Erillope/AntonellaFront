import { useUser } from '../hooks/useUser';
import { CreateUserHeader } from '../components/inputs/userInputs/CreateUserHeader';
import { ActionForm } from '../components/forms/ActionForm';
import { UserInputs } from '../components/inputs/userInputs/UserInputs';

export const CreateUser = () => {
    const {userInputProps, creationUserType, setCreationUserType, createUser} = useUser({ mode: 'create' });

    return (
        <ActionForm width='90%' handleSubmit={createUser}>
            <CreateUserHeader userType={creationUserType} onChangeUserType={setCreationUserType}/>
            <UserInputs {...userInputProps} userType={creationUserType}/>
        </ActionForm>
    )
}