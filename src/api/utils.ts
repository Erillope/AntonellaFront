import { BACK_URL } from "./config";

export const toDate = (date: string): Date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export const toDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const addDomainToUrl = (url: string): string => {
    return BACK_URL + url;
}

export const removeHeaderFromImage = (image: string): string => {
    if (image.startsWith("data:image/")) {
        return image.split(",")[1];
    }
    return image.replace(BACK_URL, "");
}