import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

declare var PaymentGateway: any;

export const AddCard = () => {
    const { submitText, disabledSubmit, onSubmit } = useAddCardExample()

    return (
        <Box >
            <Box id='tokenize_example'></Box>
            <Button className='tok_btn' onClick={onSubmit} disabled={disabledSubmit}>{submitText}</Button>
        </Box>
    )
}

export const useAddCardExample = () => {
    const environment = "stg"
    const application_code = ""
    const application_key = ""
    const submitInitialText = 'Save Card'
    const [submitText, setSubmitText] = useState(submitInitialText)
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [pg_sdk, setPgSdk] = useState<typeof PaymentGateway>()
    const id = '2d4541cf8dff4c8e92db5c3487faaea4'
    const email = 'ericklorenzolopez1@gmail.com'

    const init = () => {
        const pg_sdk = new PaymentGateway(environment, application_code, application_key);
        const _responseCallBack = (response: any) => responseCallback(response, pg_sdk)
        pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', _responseCallBack, notCompletedFormCallback);
        setPgSdk(pg_sdk)
    }

    useEffect(init, [])

    const get_tokenize_data = () => {
        return {
            locale: 'en',
            user: {
                id: id,
                email: email,
            },
            configuration: {
                default_country: 'COL',
                icon_colour: '#2e5699',
            },
        }
    }

    const notCompletedFormCallback = (message: any) => {
        console.log(message)
        setSubmitText(submitInitialText)
        setDisabledSubmit(false);
    }

    const responseCallback = (response: any, pg_sdk: any) => {
        console.log(response)
        console.log(id, response.card.token)
        axios.post('http://127.0.0.1:8000/api/payment/debit/', {
            user_id: id,
            card_token: response.card.token,
        })
        setDisabledSubmit(false);
        setSubmitText(submitInitialText)
        pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
    }

    const onSubmit = () => {
        setSubmitText('Card Processing...');
        setDisabledSubmit(true);
        pg_sdk && pg_sdk.tokenize();
    }

    return {
        submitText,
        disabledSubmit,
        onSubmit
    }
}