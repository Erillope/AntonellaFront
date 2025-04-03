
export type voidFunction = () => void;

export type Time = { hours: number; minutes: number};

export interface ServiceTypeInfo {
    type: string;
    num: number;
    employees: number;
    subTypes: string[];
}