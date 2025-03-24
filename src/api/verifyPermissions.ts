import { AuthUserApi } from "./user_api";
import { RoleApi } from "./role_api";

export interface Permissions {
    empty: boolean;
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export class PermissionVerifier {
    private userApi = new AuthUserApi();
    private roleApi = new RoleApi();
    private loggedUser = this.userApi.getLoggedUser();

    async getLoggedUserPermissions(access: string): Promise<Permissions> {
        if (this.loggedUser) {
            const permissions = await this.roleApi.getUserPermissions(this.loggedUser, access);
            return {
                empty: permissions.size === 0,
                read: permissions.has("READ"),
                create: permissions.has("CREATE"),
                edit: permissions.has("EDIT"),
                delete: permissions.has("DELETE"),
            }
        }
        return {} as Permissions;
    }

    async getUserAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("USUARIOS");
    }

    async getRoleAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("ROLES");
    }

    async getServiceAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("SERVICIOS");
    }

    async getMovilAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("MOVIL");
    }
}