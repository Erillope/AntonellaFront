import axios from "axios";
import { API_URL } from "./config";
import { AbsctractApi } from "./abstract_api";
import Cookies from "js-cookie";
import { addDomainToUrl, capitalizeFirstLetter, toDate, toDateString, removeHeaderFromImage } from "./utils";
import { v4 as uuidv4 } from "uuid";

const userApiUrl = API_URL + "user/";

export interface User {
    id: string;
    dni?: string | null;
    address?: string | null;
    photo?: string | null;
    phoneNumber: string;
    email: string;
    name: string;
    status: string;
    gender: string;
    birthdate: Date;
    createdDate: Date;
    roles?: string[];
    categories?: string[];
}

export interface CreateUserProps {
    phoneNumber: string;
    email: string;
    name: string;
    gender: string;
    birthdate: Date;
    employeeData?: {
        dni: string;
        address: string;
        photo: string;
        roles: string[];
        categories: string[];
    }
}

export interface FilterUserProps {
    fields?: { [key: string]: string };
    orderBy: string;
    offset?: number;
    limit?: number;
    orderDirection: "ASC" | "DESC";
}

export interface UpdateUserProps {
    id: string;
    phoneNumber?: string;
    email?: string;
    name?: string;
    gender?: string;
    birthdate?: Date;
    status?: string;
    dni?: string;
    address?: string;
    photo?: string;
    roles?: string[];
    categories?: string[];
}

export class AuthUserApi extends AbsctractApi {
    getPermissionVerifier() {
        throw new Error("Method not implemented.");
    }
    protected errors: { [key: string]: string }= {
        'PHONE_NUMBER_NOT_REGISTERED': 'ModelNotFoundException',
        'ICORRECT_PASSWORD': 'IncorrectPasswordException',
        'INVALID_PASSWORD': 'InvalidUserPasswordException',
        'EMAIL_NOT_REGISTERED': 'ModelNotFoundException',
        'PHONE_NUMBER_ALREADY_REGISTERED': 'UserAlreadyExistsException',
        'INVALID_PHONE_NUMBER': 'InvalidPhoneNumberException',
        'EMAIL_ALREADY_REGISTERED': 'UserAlreadyExistsException',
        'INVALID_EMAIL': 'InvalidUserEmailException',
        'INVALID_NAME': 'InvalidUserNameException',
        'INVALID_BIRTHDATE': 'InvalidUserBirthdateException',
        'USER_NOT_FOUND': 'ModelNotFoundException',
        'DNI_ALREADY_REGISTERED': 'UserAlreadyExistsException',
        'INVALID_DNI': 'InvalidDniException',
    };

    async signIn(phoneNumber: string, password: string): Promise<User | undefined> {
        const request = {
            'phone_number': phoneNumber,
            'password': password
        }
        try{
            const response = await axios.post(userApiUrl+"auth/", request);
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async createUser(userData: CreateUserProps): Promise<User | undefined> {
        const request = this.userDataMap(userData);
        const password = uuidv4()+'A123';
        request['password'] = password;
        console.log(request)
        try{
            const response = await axios.post(userApiUrl, request);
            return this.map(response.data.data);

        }
        catch (error) {
            this.catchError(error);
        }
    }

    async forgotPassword(email: string){
        const request = {
            'email': email
        }
        try{
            await axios.post(userApiUrl+"password/token/", null, {params: request});
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async resetPassword(tokenId: string, password: string): Promise<User | undefined> {
        const request = {
            'password': password,
            'token_id': tokenId
        }
        try{
            const response = await axios.post(userApiUrl+"password/reset/", request);
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async getUser(userId: string): Promise<User | undefined> {
        try {
            const response = await axios.get(userApiUrl, {params: {'user_id': userId}});
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }
    
    getLoggedUser(): User | undefined {
        const userData = JSON.parse(Cookies.get("user") ?? "");
        if (userData === null) return undefined;
        if (userData.id === undefined) return undefined;
        return userData;
    }

    isLoggedUserAdmin(): boolean {
        const user = this.getLoggedUser();
        if (user) {
            return user.roles?.includes("ADMIN") ?? false;
        }
        return false;
    }

    async isValidUserCookie(): Promise<boolean> {
        if (Cookies.get("user") === undefined) return false;
        const userData = JSON.parse(Cookies.get("user") ?? "");
        if (userData === null) return false;
        if (userData.id === undefined) return false;
        const user = await this.getUser(userData.id);
        return !!user;
    }

    async filterUsers(filterData: FilterUserProps): Promise<User[]> {
        const request = this.mapFilterRequest(filterData);
        try {
            const response = await axios.get(userApiUrl+"filter/", {params: request});
            return response.data.data.map((user: any) => this.map(user));
        }
        catch (error) {
            this.catchError(error);
            return [];
        }
    }

    async updateUser(userData: UpdateUserProps): Promise<User | undefined> {
        const request = this.mapUpdateUserRequest(userData);
        try {
            const response = await axios.put(userApiUrl, request);
            return this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async getUsersByRole(role: string): Promise<User[]> {
        try {
            const response = await axios.get(userApiUrl+"role/", {params: {'role': role}});
            return response.data.data.map((user: any) => this.map(user));
        }
        catch (error) {
            this.catchError(error);
            return [];
        }
    }

    private map(data: any): User {
        return {
            id: data.id,
            dni: data.dni,
            address: data.address,
            photo: addDomainToUrl(data.photo),
            phoneNumber: data.phone_number,
            email: data.email,
            name: data.name,
            status: data.status,
            gender: capitalizeFirstLetter(data.gender),
            birthdate: toDate(data.birthdate),
            createdDate: toDate(data.created_date),
            roles: data.roles,
            categories: data.categories && data.categories.map((category: string) => capitalizeFirstLetter(category)),
        }
    }

    private userDataMap(data: CreateUserProps): any {
        return {
            'phone_number': data.phoneNumber,
            'email': data.email,
            'name': data.name,
            'birthdate': toDateString(data.birthdate),
            'gender': data.gender.toUpperCase(),
            "employee_data": data.employeeData?{
                'dni': data.employeeData.dni,
                'address': data.employeeData.address,
                'photo': data.employeeData.photo.split(',')[1],
                'roles': data.employeeData.roles,
                'categories': data.employeeData.categories.map((category: string) => category.toUpperCase())
            } : undefined
        }
    }

    private mapFilterRequest(data: FilterUserProps): any {
        return {
            'fields': data.fields,
            'order_by': data.orderBy,
            'offset': data.offset,
            'limit': data.limit,
            'order_direction': data.orderDirection
        }
    }

    private mapUpdateUserRequest(data: UpdateUserProps): any {
        return {
            'id': data.id,
            'phone_number': data.phoneNumber,
            'email': data.email,
            'name': data.name,
            'gender': data.gender?.toUpperCase(),
            'birthdate': data.birthdate? toDateString(data.birthdate): undefined,
            'status': data.status,
            'dni': data.dni,
            'address': data.address,
            'photo': removeHeaderFromImage(data.photo ?? ''),
            'roles': data.roles,
            'categories': data.categories?.map((category: string) => category.toUpperCase())
        }
    }
}