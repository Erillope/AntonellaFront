import { BACK_URL } from "./config";

export const toDate = (date: string): Date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export const fromTimeStamp = (timestamp: string): Date => {
    const cleanDateStr = timestamp.replace(/(\.\d{3})\d+/, '$1');
    return new Date(cleanDateStr);
}

export const toDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const toDateTimeString = (date: Date): string => {
    return date.toISOString().replace('T', ' ').split('.')[0];
}

export const toTimeString = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export const fromDayTimeString = (day: string, time: string): Date => {
    const [year, month, dayOfMonth] = day.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(year, month - 1, dayOfMonth, hours, minutes);
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