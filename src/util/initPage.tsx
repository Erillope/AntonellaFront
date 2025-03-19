import { TokenApi } from '../api/token_api';
import { RoleApi } from '../api/role_api';
import { AuthUserApi, User } from '../api/user_api';
import { PermissionVerifier } from '../api/verifyPermissions';
import { invalidTokenMessage } from './alerts';

export const initResetPasswordPage = (tokenId: string, action: () => void) => {
    const tokenApi = new TokenApi();
    const fetchToken = async () => {
        await tokenApi.getToken(tokenId);
        if (tokenApi.isError('INVALID_TOKEN')) {
            invalidTokenMessage(action);
        }
    }
    fetchToken();
}

export const initCreateUserPage = (successAction: (roles: string[]) => void, failureAction: () => void) => {
    const roleApi = new RoleApi();
    const fetchRoles = async () => {
        await verifyCreateUserPermissions(failureAction);
        let roles = await roleApi.getRoles();
        roles = roles.filter((role) => role.name !== 'super_admin');
        successAction(roles.map((role) => role.name));
    }
    fetchRoles();
}

const verifyCreateUserPermissions = async (action: () => void) => {
    const permissionVerifier = new PermissionVerifier();
    const permissions = await permissionVerifier.getUserAccessPermissions();
    if (!permissions.create) {
        action();
    }
}

export const initUserInfoPage = (userId: string, notHaveReadPermissionCase: () => void,
    haveReadPermissionCase: (editPermission: boolean) => void,
    initRoles: (roles: string[]) => void, initUser: (user: User) => void,
    initData: (user: User) => void, notFoundUser: () => void) => {

    const authApi = new AuthUserApi();
    const roleApi = new RoleApi();
    const fetchRoles = async () => {
        const user = await authApi.getUser(userId ?? "");
        await verifyReadAndEditUserPermissions(user?.roles ?? [],
            notHaveReadPermissionCase, haveReadPermissionCase);
        let roles = await roleApi.getRoles();
        roles = roles.filter((role) => role.name !== 'super_admin');
        initRoles(roles.map((role) => role.name));
        if (user) {
            initUser(user);
            initData(user);
        }
        else {
            notFoundUser();return
        }
    }
    fetchRoles();
}

const verifyReadAndEditUserPermissions = async (selectedUserRoles: string[],
    notHaveReadPermissionCase: () => void, haveReadPermissionCase: (editPermission: boolean) => void) => {

    const permissionVerifier = new PermissionVerifier();
    const authApi = new AuthUserApi();
    const permissions = await permissionVerifier.getUserAccessPermissions()
    if (!permissions.read) {
        notHaveReadPermissionCase();return
    }
    const loggedUser = authApi.getLoggedUser();
    if (selectedUserRoles.includes('super_admin')) {
        haveReadPermissionCase(!!loggedUser?.roles?.includes('super_admin'));
    }
    else { haveReadPermissionCase(permissions.edit) }
}