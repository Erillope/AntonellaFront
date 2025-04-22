import axios from "axios";
import { API_URL } from "./config";
import { AbsctractApi } from "./abstract_api";
import { toDate } from "./utils";
import { User } from "./user_api";

const roleApiUrl = API_URL + "role/";

export interface Role {
    id: string;
    name: string;
    accesses: AccessPermission[];
    createdDate: Date;
}

export interface CreateRole {
    name: string;
    accesses: AccessPermission[];
}

export interface UpdateRole {
    role: string;
    name?: string;
    accesses?: AccessPermission[];
}

export interface AccessPermission {
    access: string;
    permissions: string[];
}

export class RoleApi extends AbsctractApi {
    protected errors: { [key: string]: string } = {
        'INVALID_ROLE_NAME': 'InvalidRoleException',
        'ROLE_NOT_FOUND': 'ModelNotFoundException',
        'ROLE_ALREADY_EXISTS': 'RoleAlreadyExistsException',
    }

    async createRole(roleData: CreateRole): Promise<Role | undefined> {
        try {
            const response = await axios.post(roleApiUrl, roleData);
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async updateRole(roleData: UpdateRole): Promise<Role | undefined> {
        try {
            const response = await axios.put(roleApiUrl, roleData);
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async getRoles(): Promise<Role[]> {
        try {
            const response = await axios.get(roleApiUrl);
            return response.data.data.map((role: any) => this.map(role));
        }
        catch (error) {
            this.catchError(error);
            return []
        }
    }

    async getRole(role: string): Promise<Role | undefined> {
        try {
            const response = await axios.get(roleApiUrl, { params: { role } });
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async getUserPermissions(user: User, accessName: string): Promise<Set<string>> {
        const permissions = new Set<string>();
        for (const role of user.roles || []) {
            const rolePermissions = await this.getRolePermissions(role, accessName);
            rolePermissions.forEach((permission) => permissions.add(permission));
        }
        return permissions
    }

    async getRolePermissions(role: string, accessName: string): Promise<string[]> {
        const roleData = await this.getRole(role);
        if (roleData) {
            const accesss = roleData.accesses.find((access) => access.access === accessName);
            if (accesss) {
                return accesss.permissions;
            }
        }
        return [];
    }

    async deleteRole(role: string): Promise<boolean> {
        try {
            await axios.delete(roleApiUrl, { params: { role } });
            return true;
        }
        catch (error) {
            this.catchError(error);
            return false;
        }
    }

    map(data: any): Role {
        return {
            id: data.id,
            name: data.name,
            accesses: data.accesses,
            createdDate: toDate(data.created_date),
        }
    }
}