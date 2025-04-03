import { AbsctractApi } from "./abstract_api";
import axios from "axios";
import { API_URL } from "./config";

const configApiUrl = `${API_URL}config/`

export class ConfigApi extends AbsctractApi {

    async getCategoriesConfig(): Promise<{[key: string]: string[]}> {
        const response = await axios.get(`${configApiUrl}categories`)
        return response.data.data
    }

    async getProductTypesConfig(): Promise<string[]> {
        const response = await axios.get(`${configApiUrl}product_types`)
        return response.data.data
    }
}