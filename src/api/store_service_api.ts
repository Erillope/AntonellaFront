import { Time } from "./types"
import { API_URL, BACK_URL } from "./config";
import { AbsctractApi } from "./abstract_api";
import axios from "axios";
import { toDate } from "./date";

const storeServiceApiUrl = API_URL + "store_service/";

export interface CreateStoreService {
    name: string;
    description: string;
    type: string;
    subType: string;
    prices: Price[];
    duration: Time;
    images: string[];
    questions?: Question[];
}

export interface UpdateStoreService {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    subType?: string;
    prices?: Price[];
    duration?: Time;
    images?: string[];
    status?: string;
}

export interface StoreService {
    id: string;
    name: string;
    description: string;
    type: string;
    subType: string;
    prices: Price[];
    duration: Time;
    images: string[];
    questions: Question[];
    createdDate: Date;
    status: string;
}

export interface Price {
    name: string;
    minPrice: number;
    maxPrice: number;
}

export interface Question {
    id: string;
    title: string;
    inputType: string;
    choiceType?: string;
    choices?: Choice[];
}

export interface UpdateQuestion {
    id: string;
    choiceType?: string;
    title?: string;
    choices?: Choice[];
}

export interface CreateQuestion {
    serviceId?: string;
    id?: string;
    title: string;
    inputType: string;
    choiceType?: string;
    choices?: Choice[];
}

export interface Choice {
    option: string;
    image?: string;
}

export class StoreServiceApi extends AbsctractApi {
    protected errors: { [key: string]: string } = {
        'INVALID_SERVICE_NAME': 'InvalidServiceNameException',
        'SERVICE_NOT_FOUND': 'ModelNotFoundException',
        'INVALID_PRICE_RANGE': 'InvalidPriceRangeException',
    }

    async createStoreService(storeServiceData: CreateStoreService): Promise<StoreService | undefined> {
        try {
            const requestData = this.mapCreateStoreService(storeServiceData);
            const response = await axios.post(storeServiceApiUrl, requestData);
            return this.map(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async deleteStoreService(id: string): Promise<void> {
        try {
            await axios.delete(storeServiceApiUrl, { params: { id } });
        } catch (error) {
            this.catchError(error);
        }
    }

    async get(id: string): Promise<StoreService | undefined> {
        try {
            const response = await axios.get(storeServiceApiUrl, { params: { id } });
            return this.map(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async getAll(): Promise<StoreService[] | undefined> {
        try {
            const response = await axios.get(storeServiceApiUrl);
            return response.data.data.map((data: any) => this.map(data));
        } catch (error) {
            this.catchError(error);
        }
    }

    async update(storeServiceData: UpdateStoreService): Promise<StoreService | undefined> {
        try {
            const requestData = this.mapUpdateStoreService(storeServiceData);
            const response = await axios.put(storeServiceApiUrl, requestData);
            return this.map(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async updateQuestion(questionData: UpdateQuestion): Promise<Question | undefined> {
        try {
            const requestData = this.mapUpdateQuestion(questionData);
            const response = await axios.put(storeServiceApiUrl + "question/", requestData);
            return this.mapQuestion(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async createQuestion(questionData: CreateQuestion): Promise<Question | undefined> {
        try {
            const requestData = this.mapCreateQuestion(questionData);
            const response = await axios.post(storeServiceApiUrl + "question/", requestData);
            return this.mapQuestion(response.data.data);
        } catch (error) {
            this.catchError(error);
        }
    }

    async deleteQuestion(id: string): Promise<void> {
        try {
            await axios.delete(storeServiceApiUrl+'question/', { params: { id } });
        } catch (error) {
            this.catchError(error);
        }
    }

    private map(data: any): StoreService {
        const durationInfo = data.duration.split(":")
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            type: data.type,
            subType: data.subtype,
            prices: data.prices.map((price: any) => {
                return {
                    name: price.name,
                    minPrice: price.min_price,
                    maxPrice: price.max_price
                }
            }),
            duration: {
                hours: parseInt(durationInfo[0]),
                minutes: parseInt(durationInfo[1])
            },
            images: data.images.map((image: string) => BACK_URL + image),
            questions: data.questions.map((questionData: any) => this.mapQuestion(questionData)),
            createdDate: toDate(data.created_date),
            status: data.status
        }
    }

    private mapQuestion(data: any): Question {
        return {
            id: data.id,
            title: data.title,
            inputType: data.input_type,
            choiceType: data.choice_type?? undefined,
            choices: data.choices ? data.choices.map((choice: any) => {
                if (typeof choice === 'string'){
                    return {
                        option: choice
                    }
                }
                else{
                    return {
                        option: choice.option,
                        image: BACK_URL + choice.image
                    }
                }
            }) : undefined
        }
    }

    private mapCreateStoreService(data: CreateStoreService): any {
        return {
            name: data.name,
            description: data.description,
            type: data.type,
            subtype: data.subType,
            prices: data.prices.map((price) => {
                return {
                    name: price.name,
                    min_price: price.minPrice,
                    max_price: price.maxPrice
                }
            }),
            duration: data.duration.hours.toString() + ":" + data.duration.minutes.toString(),
            images: data.images.map((image) => image.split(',')[1]),
            questions: data.questions ? data.questions.map((question) => this.mapCreateQuestion(question)) : undefined
        }
    }

    private mapUpdateStoreService(data: UpdateStoreService): any {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            type: data.type,
            subtype: data.subType,
            prices: data.prices ? data.prices.map((price) => {
                return {
                    name: price.name,
                    min_price: price.minPrice,
                    max_price: price.maxPrice
                }
            }) : undefined,
            duration: data.duration ? (data.duration.hours.toString() + ":" + data.duration.minutes.toString()) : undefined,
            images: data.images ? data.images.map((image) => {
                if (image.split(',')[1]){return image.split(',')[1]}
                else{return image.replace(BACK_URL, "")}
            }) : undefined,
            status: data.status
        }
    }

    private mapUpdateQuestion(data: UpdateQuestion): any {
        return {
            id: data.id,
            title: data.title,
            choices: data.choices ? this.mapChoice(data.choices, data.choiceType??'') : undefined
        }
    }

    private mapCreateQuestion(question: CreateQuestion): any {
        return {
            service_id: question.serviceId,
            id: question.id,
            title: question.title,
            input_type: question.inputType,
            choice_type: question.choiceType,
            choices: question.choices ? this.mapChoice(question.choices, question.choiceType??'') : undefined
        }
    }

    private mapChoice(choices: Choice[], type: string): any {
        if (type == 'TEXT'){
            return choices.map((choice) => choice.option)
        }
        if (type == 'IMAGE'){
            return choices.map((choice) => {
                let image = choice.image
                if (image){
                    if (image.split(',')[1]){image = image.split(',')[1]}
                    else{image = image.replace(BACK_URL, "")}
                }
                return {
                    option: choice.option,
                    image: image
                }
            })
        }
        return {}
    }
}