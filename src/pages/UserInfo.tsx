import { useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ActionForm } from "../components/forms/ActionForm";
import { UserInputs } from "../components/inputs/userInputs/UserInputs";

export const UserInfo = () => {
    const { userId } = useParams();
    const { userInputProps, user, updateUser, mode, discartChanges, setMode, permissions } = useUser({ mode: 'read', userId });

    return (
        <ActionForm width='90%' handleSubmit={updateUser} mode={mode} discartChanges={discartChanges}
            edit={() => setMode('update')} allowEdit={permissions?.edit}>
            <UserInputs {...userInputProps} userType={user?.dni? 'empleado' : 'cliente'}
                disabled={mode === 'read'} showExtraInfo={true}/>
        </ActionForm>
    )
}