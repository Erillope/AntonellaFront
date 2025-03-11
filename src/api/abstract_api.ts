import axios from "axios";

export abstract class AbsctractApi {
    protected errors: { [key: string]: string }= {};
    private responseError: string = '';
    private errorMessage: string = '';

    public isError(errorName: string): boolean {
        return this.errors[errorName] === this.responseError && this.responseError !== '';
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }

    protected catchError(error: any){
        if (axios.isAxiosError(error) && error.response){
            console.log(error.response.data);
            this.responseError = error.response.data.error;
            this.errorMessage = error.response.data.message;
        }
    }
    
    protected setErrorMessage(errorMessage: string){
        this.errorMessage = errorMessage;
    }

    protected setResponseError(responseError: string){
        this.responseError = responseError;
    }
}