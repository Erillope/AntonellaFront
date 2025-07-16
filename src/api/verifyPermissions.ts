import { AuthUserApi, User } from "./user_api";
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

    async getUserPermissions(user: User, access: string): Promise<Permissions> {
        const permissions = await this.roleApi.getUserPermissions(user, access);
        return {
            empty: permissions.size === 0,
            read: permissions.has("READ"),
            create: permissions.has("CREATE"),
            edit: permissions.has("EDIT"),
            delete: permissions.has("DELETE"),
        }
    }

    async getLoggedUserPermissions(access: string): Promise<Permissions> {
        if (this.loggedUser) {
            return await this.getUserPermissions(this.loggedUser, access);
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

    async getProductAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("PRODUCTOS");
    }

    async getCitasAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("CITAS");
    }

    async hasNotAdminPermissions(user: User): Promise<boolean> {
        return (await this.getUserPermissions(user, "USUARIOS")).empty &&
            (await this.getUserPermissions(user, "ROLES")).empty &&
            (await this.getUserPermissions(user, "SERVICIOS")).empty &&
            (await this.getUserPermissions(user, "PRODUCTOS")).empty &&
            (await this.getUserPermissions(user, "CITAS")).empty;
    }

    async getChatAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("CHATS");
    }

    async getNotificationAccessPermissions(): Promise<Permissions> {
        return await this.getLoggedUserPermissions("NOTIFICACIONES");
    }
}