const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
const phoneNumberRegex = /^(0)?9\d{8}$/
const userNameRegex = /^(?=.{4,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
const dniRegex = /^\d{10}$/
const roleNameRegex = /^[a-zA-Z0-9_]{3,20}$/
const productNameReges = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÜüÑñ' &-]{3,50}$/
const maxAge = 100
const minAge = 3

export const validatePassword = (password: string): boolean => {
    return passwordRegex.test(password);
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
    return phoneNumberRegex.test(phoneNumber);
}

export const validateUserName = (userName: string): boolean => {
    return userNameRegex.test(userName);
}

export const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
}

export const validateDni = (dni: string): boolean => {
    return dniRegex.test(dni);
}

export const validateBirthDate = (birthDate: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= minAge && age <= maxAge;
}

export const validateRoleName = (roleName: string): boolean => {
    return roleNameRegex.test(roleName);
}

export const validateProductName = (productName: string): boolean => {
    return productNameReges.test(productName);
}