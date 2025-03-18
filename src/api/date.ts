export const toDate = (date: string): Date => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export const toDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
}