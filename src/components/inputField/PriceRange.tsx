import React from "react";
import { NumberInputField, useNumberInputField } from "./NumberInputField";
import { FieldErrors, useForm } from "react-hook-form";
import { Box } from "@mui/material";

export interface PriceRangeProps {
    name?: string;
    register?: ReturnType<typeof useForm>["register"];
    errors?: FieldErrors;
    labelText?: string;
    minPrice?: number;
    maxPrice?: number;
    onMinPriceChange?: (value: number) => void;
    onMaxPriceChange?: (value: number) => void;
    minError?: string;
    maxError?: string;
    disabled?: boolean;
}

export const PriceRange: React.FC<PriceRangeProps> = ({ labelText, minPrice, maxPrice, onMinPriceChange,
    onMaxPriceChange, minError, maxError, errors, register, name, disabled
}) => {
    return (
        <Box display='flex' flexDirection='row' gap={1} alignItems='center' width='100%'>
            <Box flex={3}>
                <h3>{labelText}</h3>
            </Box>
            <Box display={'flex'} flexDirection='row' gap={1} flex={7}>
                <NumberInputField
                    disable={disabled}
                    name={name+'Min'}
                    register={register}
                    errors={errors}
                    labelText="Mínimo"
                    value={minPrice}
                    onValueChange={onMinPriceChange}
                    inputError={minError}
                    requiredErrorText="El precio mínimo es requerido"
                />
                <NumberInputField
                    disable={disabled}
                    name={name+'Max'}
                    register={register}
                    errors={errors}
                    labelText="Máximo"
                    value={maxPrice}
                    onValueChange={onMaxPriceChange}
                    inputError={maxError}
                    requiredErrorText="El precio máximo es requerido"
                />
            </Box>
        </Box>
    )
}

export const usePriceRange = (register: ReturnType<typeof useForm>["register"], errors: FieldErrors) => {
    const minControl = useNumberInputField(register, errors)
    const maxControl = useNumberInputField(register, errors)
    const getPriceRangeProps = (): PriceRangeProps => {
        return {
            register: register,
            errors: errors,
            minPrice: minControl.value,
            maxPrice: maxControl.value,
            onMinPriceChange: minControl.getNumberInputFieldProps().onValueChange,
            onMaxPriceChange: maxControl.getNumberInputFieldProps().onValueChange,
            minError: minControl.getNumberInputFieldProps().inputError,
            maxError: minControl.getNumberInputFieldProps().inputError,
        }
    }

    const clearInput = () => {minControl.clearInput(); maxControl.clearInput()}
    const clearError = () => {minControl.clearError(); maxControl.clearError()}

    return {
        getPriceRangeProps,
        clearInput,
        clearError,
        minPrice: minControl.value,
        maxPrice: maxControl.value,
        setMinPrice: minControl.setValue,
        setMaxPrice: maxControl.setValue,
        setMinError: minControl.setError,
    }
}