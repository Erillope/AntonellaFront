import axios from "axios";
import { API_URL } from "./config";
import { AbsctractApi } from "./abstract_api";

const tokenApiUrl = API_URL + "token/";

interface Token {
    id: string
    userId: string
    createdAt: Date
    expiredAt: Date
}

export class TokenApi extends AbsctractApi {
    protected errors: { [key: string]: string }= {
        'INVALID_TOKEN': 'InvalidTokenException'
    }
    private tokenResponse: Token = null as any;

    async getToken(tokenId: string){
        try{
            const response = await axios.get(tokenApiUrl, {params: {token_id: tokenId}});
            this.tokenResponse = this.map(response.data.data);
        }
        catch (error) {
            this.catchError(error);
        }
    }

    getTokenResponse(): Token {
        return this.tokenResponse;
    }

    private map(data: any): Token {
        return {
            id: data.id,
            userId: data.user_id,
            createdAt: new Date(data.created_at),
            expiredAt: new Date(data.expired_at)
        }
    }
}