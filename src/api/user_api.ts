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
    paymentType?: "porcentaje" | "salario" | "mixto";
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
    dni: string;
    photo?: string;
    employeeData?: {
        address: string;
        roles: string[];
        categories: string[];
        paymentType: string;
    }
}

export interface FilterUserProps {
    serviceCategory?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    dni?: string;
    exactName?: string;
    onlyClients?: boolean;
    onlyCount?: boolean;
    role?: string;
    offset?: number;
    limit?: number;
}

export interface UserFilterResponse {
    total: number;
    filteredCount: number;
    users: User[];
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
    paymentType?: string;
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
        try{
            const response = await axios.post(userApiUrl, request);
            await this.forgotPassword(userData.email);
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
        const userData = JSON.parse(Cookies.get("user") ?? "{}");
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
        if (!user) return false;
        return true;
    }

    async filterUsers(filterData: FilterUserProps): Promise<UserFilterResponse | undefined> {
        const request = this.mapFilterRequest(filterData);
        try {
            const response = await axios.post(userApiUrl+"filter/", request);
            const data = response.data.data;
            return {
                total: data.total,
                filteredCount: data.filtered_count,
                users: data.users.map((user: any) => this.map(user))
            };
        }
        catch (error) {
            this.catchError(error);
            return undefined;
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
            paymentType: data.payment_type? this.paymentTypeClientMap(data.payment_type): undefined
        }
    }

    private paymentTypeServerMap(paymentType: string): string {
        switch (paymentType.toLowerCase()) {
            case 'porcentaje':
                return 'PERCENT';
            case 'salario':
                return 'SALARY';
            case 'mixto':
                return 'MIXED';
            default:
                return 'NONE';
        }
    }

    private paymentTypeClientMap(paymentType: string): "porcentaje" | "salario" | "mixto" {
        switch (paymentType.toUpperCase()) {
            case 'PERCENT':
                return 'porcentaje';
            case 'SALARY':
                return 'salario';
            case 'MIXED':
                return 'mixto';
            default:
                return "porcentaje";
        }
    }

    private userDataMap(data: CreateUserProps): any {
        return {
            'phone_number': data.phoneNumber,
            'email': data.email,
            'name': data.name,
            'birthdate': toDateString(data.birthdate),
            'gender': data.gender.toUpperCase(),
            'dni': data.dni,
            'photo': data.photo ? data.photo.split(',')[1] : undefined,
            "employee_data": data.employeeData?{
                'address': data.employeeData.address,
                'roles': data.employeeData.roles,
                'categories': data.employeeData.categories.map((category: string) => category.toUpperCase()),
                'payment_type': this.paymentTypeServerMap(data.employeeData.paymentType)
            } : undefined
        }
    }

    private mapFilterRequest(data: FilterUserProps): any {
        return {
            'service_category': data.serviceCategory?.toUpperCase(),
            'name': data.name?.toUpperCase(),
            'role': data.role,
            'exact_name': data.exactName,
            'only_clients': data.onlyClients ?? false,
            'only_count': data.onlyCount ?? false,
            'offset': data.offset,
            'limit': data.limit,
            'email': data.email,
            'phone_number': data.phoneNumber,
            'dni': data.dni,
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
            'dni': data.dni === "" ? undefined : data.dni,
            'address': data.address === "" ? undefined : data.address,
            'photo': data.photo? removeHeaderFromImage(data.photo): undefined,
            'roles': data.roles ? data.roles.map((role: string) => role.toUpperCase()): undefined,
            'categories': data.categories? data.categories.map((category: string) => category.toUpperCase()): undefined,
            'payment_type': data.paymentType? this.paymentTypeServerMap(data.paymentType): undefined
        }
    }
}