import { useNavigate } from "react-router-dom";
import { successRoleCreatedMessage, permissionsNotSelectedMessage, successRoleUpdatedMessage,
    confirmDeleteRoleMessage, roleDeletedMessage
 } from "../utils/alerts";
import { CreateRoleActions, UpdateRoleActions } from "./useRole";
import { Role } from "../api/role_api";

interface UseRoleFormProps {
    clearForm?: () => void,
    createRole?: (actions: CreateRoleActions) => void
    deleteRole?: (roleDeletedAction: (role: Role) => void) => void
    updateRole?: (actions: UpdateRoleActions) => void
}

export const useRoleFormActions = ({ clearForm, createRole, deleteRole, updateRole }: UseRoleFormProps) => {
    const navigate = useNavigate();
    
    const notHaveCreatePermissionAction = () => navigate('/')

    const notHaveReadpermissionAction = () => navigate('/')

    const notFoundRoleAction = () => navigate('/')

    const successRoleCreatedAction = () => clearForm && successRoleCreatedMessage(clearForm)

    const successRoleUpdatedAction = () => successRoleUpdatedMessage()

    const deleteRoleAction = () => deleteRole?.((role: Role) => {
        roleDeletedMessage(role.name)
        navigate('/role/search')
    })

    const permissionsNotSelectedAction = () => permissionsNotSelectedMessage()

    const handleCreateRole = () => createRole?.({ successRoleCreatedAction, permissionsNotSelectedAction })

    const handleUpdateRole = () => updateRole?.({successRoleUpdatedAction, permissionsNotSelectedAction})

    const handleDeleteRole = () => confirmDeleteRoleMessage(deleteRoleAction)

    return {
        notHaveCreatePermissionAction,
        handleCreateRole,
        notHaveReadpermissionAction,
        notFoundRoleAction,
        handleUpdateRole,
        handleDeleteRole
    }
}