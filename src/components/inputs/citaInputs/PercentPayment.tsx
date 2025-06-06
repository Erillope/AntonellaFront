import { Box } from "@mui/material"
import { PercentageInputField, InputTextFieldProps, useInputTextField, DecimalInputField } from "../InputTextField"
import { useEffect, useState } from "react";

export interface PercentPaymentProps {
    percentageProps?: InputTextFieldProps;
    valueProps?: InputTextFieldProps;
}

export const PercentPayment = (props: PercentPaymentProps) => {
    return (
        <Box display='flex' flexDirection='row' gap={2} width={'100%'}>
            <PercentageInputField labelText="Porcentaje a pagar" {...props.percentageProps} />
            <DecimalInputField labelText="Valor a pagar" {...props.valueProps} disabled/>
        </Box>
    )
}

export const usePercentPayment = () => {
    const percentContoller = useInputTextField();
    const [price, setPrice] = useState<number>(0);
    const [value, setValue] = useState<number>(0);

    const updatedPrice = () => {
        const newValue = percentContoller.value ? (parseFloat(percentContoller.value) / 100) * price : 0;
        setValue(newValue);
    }

    useEffect(updatedPrice, [percentContoller.value, price]);

    const getProps = (): PercentPaymentProps => {
        return {
            percentageProps: percentContoller.getProps(),
            valueProps: {
                value: value.toFixed(2),
            },
        };
    }

    const clearInput = () => {
        percentContoller.clearInput();
        setValue(0);
        setPrice(0);
    }

    return {
        percentContoller,
        price,
        setPrice,
        getProps,
        value,
        clearInput,
        updatedPrice,
        setValue
    }
}