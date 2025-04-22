import { Box, FormHelperText, Typography } from "@mui/material";
import { InputTextFieldProps, NumberInputField, useInputTextField } from "./InputTextField";
import { useState } from "react";
import { Price } from "../../api/store_service_api";

export interface PriceRangeProps {
    disabled?: boolean;
    width?: string;
    type?: 'default' | 'long'
    basicProps?: PriceRangeProps;
    completeProps?: PriceRangeProps;
    shortProps?: PriceRangeProps;
    mediumProps?: PriceRangeProps;
    longProps?: PriceRangeProps;
    error?: string;
}

export const PriceRange = (props: PriceRangeProps) => {
    const defaultType = props.type ? props.type : 'default'

    return (
        <Box display='flex' flexDirection='column' gap={1} width={props.width ?? '100%'} >
            <PriceRangeHeader />
            {defaultType === 'default' &&
                <>
                    <PriceRangeInput labelText="$ Precio básico" {...props.basicProps} disabled={props.disabled} />
                    <PriceRangeInput labelText="$ Precio completo" {...props.completeProps} disabled={props.disabled} />
                </>
            }
            {defaultType === 'long' &&
                <>
                    <PriceRangeInput labelText="$ Precio cabello corto" {...props.shortProps} disabled={props.disabled} />
                    <PriceRangeInput labelText="$ Precio cabello medio" {...props.mediumProps} disabled={props.disabled} />
                    <PriceRangeInput labelText="$ Precio cabello largo" {...props.longProps} disabled={props.disabled} />
                </>
            }
            {!!props.error && props.error.length > 0 &&
                <FormHelperText className="helperText">{props.error}</FormHelperText>
            }
        </Box>
    )
}

interface PriceRangeInputProps {
    labelText?: string;
    disabled?: boolean;
    minPriceProps?: InputTextFieldProps;
    maxPriceProps?: InputTextFieldProps;
    error?: string;
}

const PriceRangeInput = (props: PriceRangeInputProps) => {
    return (
        <Box display='flex' flexDirection='row' gap={1}>
            <Box display='flex' flexDirection='row' gap={1} alignItems='center' justifyContent='flex-start' width='100%'>
                <Typography width="40%" color="black">{props.labelText}</Typography>
                <NumberInputField {...props.minPriceProps} disabled={props.disabled} width="15%" />
                <Typography color="black">-</Typography>
                <NumberInputField {...props.maxPriceProps} disabled={props.disabled} width="15%" />
            </Box>
        </Box>
    )
}

const PriceRangeHeader = () => {
    return (
        <Box display='flex' flexDirection='row' gap={1}>
            <Typography width="40%" color="black"></Typography>
            <Typography width="15%" color="black">Desde</Typography>
            <Typography width="15%" color="black">Hasta</Typography>
        </Box>
    )
}

const usePriceRangeInput = () => {
    const minControl = useInputTextField()
    const maxControl = useInputTextField()
    const [error, setError] = useState('')

    const getPriceRangeProps = (): PriceRangeInputProps => {
        return {
            minPriceProps: minControl.getProps(),
            maxPriceProps: maxControl.getProps(),
        }
    }

    const clearInput = () => { minControl.clearInput(); maxControl.clearInput() }
    const isEmpty = () => { return minControl.isEmpty() || maxControl.isEmpty() }
    const clearError = () => { setError('') }
    const validate = () => {
        clearError()
        if (isEmpty()) {
            return 'Los precios son requeridos'
        }
        if (Number(minControl.value) >= Number(maxControl.value)) {
            return 'El precio mínimo no puede ser mayor al máximo'
        }
        return ''
    }

    return {
        getPriceRangeProps,
        minControl,
        maxControl,
        clearInput,
        isEmpty,
        validate,
        clearError,
        error
    }
}


export const usePriceRange = () => {
    const basicControl = usePriceRangeInput()
    const completeControl = usePriceRangeInput()
    const shortControl = usePriceRangeInput()
    const mediumControl = usePriceRangeInput()
    const longControl = usePriceRangeInput()
    const [type, setType] = useState<'default' | 'long'>('default')
    const [error, setError] = useState<string>('')

    const getProps = (): PriceRangeProps => {
        return {
            basicProps: basicControl.getPriceRangeProps(),
            completeProps: completeControl.getPriceRangeProps(),
            shortProps: shortControl.getPriceRangeProps(),
            mediumProps: mediumControl.getPriceRangeProps(),
            longProps: longControl.getPriceRangeProps(),
            type: type,
            error: error,
        }
    }

    const clearInput = () => {
        basicControl.clearInput()
        completeControl.clearInput()
        shortControl.clearInput()
        mediumControl.clearInput()
        longControl.clearInput()
    }

    const clearErrors = () => {
        setError('')
    }

    const validate = () => {
        clearErrors()
        let _error = ''
        if (type === 'default') {
            _error = basicControl.validate()
            if (_error.length > 0) {setError(_error); return false}
            _error = completeControl.validate()
            if (_error.length > 0) {setError(_error); return false}
        }
        else {
            _error = shortControl.validate()
            if (_error.length > 0) {setError(_error); return false}
            _error = mediumControl.validate()
            if (_error.length > 0) {setError(_error); return false}
            _error = longControl.validate()
            if (_error.length > 0) {setError(_error); return false}
        }
        setError(_error)
        return _error.length == 0
    }

    const getData = (): Price[] => {
        if (type === 'default') {
            return [
                {
                    name: 'Precio básico',
                    minPrice: Number(basicControl.minControl.value),
                    maxPrice: Number(basicControl.maxControl.value)
                },
                {
                    name: 'Precio completo',
                    minPrice: Number(completeControl.minControl.value),
                    maxPrice: Number(completeControl.maxControl.value)
                },
            ]
        }
        return [
            {
                name: 'Precio corto',
                minPrice: Number(shortControl.minControl.value),
                maxPrice: Number(shortControl.maxControl.value)
            },
            {
                name: 'Precio medio',
                minPrice: Number(mediumControl.minControl.value),
                maxPrice: Number(mediumControl.maxControl.value)
            },
            {
                name: 'Precio largo',
                minPrice: Number(longControl.minControl.value),
                maxPrice: Number(longControl.maxControl.value)
            },
        ]
    }

    const setData = (data: Price[], type: 'default' | 'long') => {
        if (type === 'default') {
            basicControl.minControl.setValue(data[0].minPrice.toString())
            basicControl.maxControl.setValue(data[0].maxPrice.toString())
            completeControl.minControl.setValue(data[1].minPrice.toString())
            completeControl.maxControl.setValue(data[1].maxPrice.toString())
        }
        else {
            shortControl.minControl.setValue(data[0].minPrice.toString())
            shortControl.maxControl.setValue(data[0].maxPrice.toString())
            mediumControl.minControl.setValue(data[1].minPrice.toString())
            mediumControl.maxControl.setValue(data[1].maxPrice.toString())
            longControl.minControl.setValue(data[2].minPrice.toString())
            longControl.maxControl.setValue(data[2].maxPrice.toString())
        }
    }

    return {
        getProps,
        clearInput,
        clearErrors,
        validate,
        basicControl,
        completeControl,
        shortControl,
        mediumControl,
        longControl,
        setType,
        getData,
        setData
    }
}