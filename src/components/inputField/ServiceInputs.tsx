import { Box } from "@mui/material"
import { SelectInput, SelectInputProps } from "./SelectInput"
import { TextInputField, TextInputFieldProps } from "./TextInputField"
import { NumberInputField, NumberInputFieldProps } from "./NumberInputField"
import { ImageListInput, ImageListInputProps } from "./ImageListInput"
import { TextAreaField } from "./TextAreaField"
import { PriceRange, PriceRangeProps } from "./PriceRange"
import { EmployeeCard, EmployeeCardProps } from "../EmployeeCards"
import { AuthUserApi, User } from "../../api/user_api"
import React, { use, useEffect } from "react"

export interface ServiceInputsProps {
    getSelectCategoryProps?: () => SelectInputProps;
    getSelectSubCategoryProps?: () => SelectInputProps;
    getNameTextFieldProps?: () => TextInputFieldProps;
    getHourFieldProps?: () => NumberInputFieldProps;
    getMinuteFieldProps?: () => NumberInputFieldProps;
    getImageListInputProps?: () => ImageListInputProps;
    getTextAreaFieldProps?: () => TextInputFieldProps;
    getShortPriceRangeProps?: () => PriceRangeProps;
    getMediumPriceRangeProps?: () => PriceRangeProps;
    getLongPriceRangeProps?: () => PriceRangeProps;
    getBasicPriceRangeProps?: () => PriceRangeProps;
    getCompletePriceRangeProps?: () => PriceRangeProps;
    getEmployeeCardProps?: () => EmployeeCardProps[];
    showHeightPrice?: () => boolean;
    disabled?: boolean;
}

export const ServiceInputs: React.FC<ServiceInputsProps> = ({ 
    getSelectCategoryProps, getNameTextFieldProps, getImageListInputProps, getHourFieldProps,
    getMinuteFieldProps,
    getTextAreaFieldProps, getShortPriceRangeProps, getMediumPriceRangeProps, getLongPriceRangeProps,
    getBasicPriceRangeProps, getCompletePriceRangeProps, showHeightPrice, getSelectSubCategoryProps,
    disabled

 }) => {
    const [employees, setEmployees] = React.useState<User[]>([])
    const userApi = new AuthUserApi()
    useEffect(() => {
        const fetchEmployees = async () => {
            const allUsers = await userApi.filterUsers({ orderBy: "name", orderDirection: "ASC" });
            const employees = allUsers.filter((user) => user.categories?.includes(getSelectCategoryProps?.().value??''))
            if (employees) {
                setEmployees(employees)
            }
        }
        fetchEmployees()
    }, [getSelectCategoryProps])

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Box display="flex" flexDirection="row" gap={5} p={2}>
                <SelectInput label="Categoría" width="20%" {...getSelectCategoryProps?.()}
                requiredErrorText="Seleccione una categoría" name='category' disabled={disabled}/>
                <SelectInput label="SubCategoría" width="20%" {...getSelectSubCategoryProps?.()}
                requiredErrorText="Seleccione una subcategoría" name='subCategory'
                disabled={(!!!getSelectCategoryProps?.().value) || disabled}/>
                <TextInputField labelText="Nombre" requiredErrorText="El nombre es requerido" name="name"
                {...getNameTextFieldProps?.()} disabled={disabled}/>
                <NumberInputField labelText="Horas aproximada" name="hour" {...getHourFieldProps?.()}
                disable={disabled}/>
                <NumberInputField labelText="Minutos aproximada" name="minute" {...getMinuteFieldProps?.()}
                disable={disabled}/>

            </Box>
            <ImageListInput {...getImageListInputProps?.()} disabled={disabled}/>
            <Box display="flex" flexDirection="row" gap={5} p={2}>
                <Box display="flex" flexDirection="column" gap={1} flex={5}>
                    <TextAreaField labelText="Descripción" {...getTextAreaFieldProps?.()}
                    requiredErrorText="La descripción es requerida" name="description" disabled={disabled}/>
                    {showHeightPrice?.() ? (
                        <>
                            <PriceRange labelText="Precio corto" {...getShortPriceRangeProps?.()} 
                            name="shortPrice" disabled={disabled}/>
                            <PriceRange labelText="Precio medio" {...getMediumPriceRangeProps?.()}
                            name='mediumPrice' disabled={disabled}/>
                            <PriceRange labelText="Precio largo" {...getLongPriceRangeProps?.()}
                            name="longPrice" disabled={disabled}/>
                        </>
                    ) :
                        (
                            <>
                                <PriceRange labelText="Precio básico" {...getBasicPriceRangeProps?.()}
                                name="basicPrice" disabled={disabled}/>
                                <PriceRange labelText="Precio completo" {...getCompletePriceRangeProps?.()}
                                name="completePrice" disabled={disabled}/>
                            </>
                        )}
                </Box>
                <Box display="flex" flexDirection="column" gap={1} flex={5}>
                    <h2 style={{ fontSize: '16px' }}>Empleados Disponibles</h2>
                    {employees?.map((employee) => (
                        <EmployeeCard key={employee.id} user={employee} />
                    ))}
                </Box>
            </Box>
        </div>
    )
}