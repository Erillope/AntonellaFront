import { Box } from "@mui/material"
import { SelectInput, SelectInputProps, useSelectInput } from "./SelectInput"
import { TextInputField, TextInputFieldProps, useTexInputFiled } from "./TextInputField"
import { TextAreaField } from "./TextAreaField"
import { NumberInputField, NumberInputFieldProps, useNumberInputField } from "./NumberInputField"
import { ImageListInput, ImageListInputProps, useImageListInput } from "./ImageListInput"
import { Control, FieldErrors, FieldValues, useForm, UseFormSetValue } from "react-hook-form"
import { useEffect, useState } from "react"
import { ConfigApi } from "../../api/config_api"

interface ProductInputsProps {
    getSelectCategoryProps?: () => SelectInputProps;
    getSelectSubCategoryProps?: () => SelectInputProps;
    getNameTextFieldProps?: () => TextInputFieldProps;
    getDescriptionTextFieldProps?: () => TextInputFieldProps;
    getProductTypeProps?: () => SelectInputProps;
    getImageListInputProps?: () => ImageListInputProps;
    getPriceProps?: () => NumberInputFieldProps;
    getStockFieldProps?: () => NumberInputFieldProps;
    getVolumeFieldProps?: () => NumberInputFieldProps;
    getAdditionalStockFieldProps?: () => NumberInputFieldProps;
    editMode?: boolean;
    disabled?: boolean;
}

export const ProductInputs: React.FC<ProductInputsProps> = ({ getSelectCategoryProps, 
    getSelectSubCategoryProps, getNameTextFieldProps, getDescriptionTextFieldProps, getImageListInputProps,
    getPriceProps, getStockFieldProps, getVolumeFieldProps, getProductTypeProps, editMode = false,
    getAdditionalStockFieldProps, disabled
}) => {
    return (
        <Box display="flex" flexDirection="column" alignItems={'center'} width='100%'>
            <Box display="flex" flexDirection="row" gap={5} width='100%'>
                <Box display="flex" flexDirection="column" flex={5}>
                    <Box display="flex" flexDirection="row" gap={5}>
                        <SelectInput {...getSelectCategoryProps?.()} disabled={disabled}/>
                        <SelectInput {...getSelectSubCategoryProps?.()} disabled={disabled}/>
                    </Box>
                    <TextInputField {...getNameTextFieldProps?.()} disabled={disabled}/>
                    <TextAreaField {...getDescriptionTextFieldProps?.()} disabled={disabled}/>
                </Box>
                <Box display="flex" flexDirection="column" gap={2} flex={5}>
                    <SelectInput {...getProductTypeProps?.()} disabled={disabled}/>
                    <Box display="flex" flexDirection="row" gap={5} justifyContent={'space-between'}>
                        <NumberInputField  style={{ width: '50%' }} {...getPriceProps?.()} disable={disabled}/>
                        <NumberInputField  style={{ width: '50%' }} {...getStockFieldProps?.()}
                        disable={editMode || disabled}/>
                    </Box>
                    <Box display="flex" flexDirection="row" gap={5} justifyContent={'space-between'}>
                        <NumberInputField style={{ width: '50%' }}{...getVolumeFieldProps?.()} disable={disabled}/>
                        {editMode &&<NumberInputField style={{ width: '50%' }} {...getAdditionalStockFieldProps?.()} disable={disabled}/>}
                    </Box>
                </Box>
            </Box>
            <ImageListInput {...getImageListInputProps?.()} disabled={disabled}/>
        </Box>
    )
}

interface ProductInputsProps {
    type?: string;
    subType?: string;
    name?: string;
    description?: string;
    productType?: string;
    price?: number;
    stock?: number;
    volume?: number;
    images?: string[];
    additionalStock?: number;
}

export const useProductInputs = (register: ReturnType<typeof useForm>['register'], control: Control<FieldValues>, errors: FieldErrors, setValue: UseFormSetValue<FieldValues> = { } as any
) => {
    const configApi = new ConfigApi()
    const categories = ["CABELLO", "UÑAS", "MAQUILLAJE", "SPA"]
    const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({})
    const categoriesControl = useSelectInput(categories, control, errors)
    const subCategoriesControl = useSelectInput([], control, errors)
    const nameControl = useTexInputFiled(register, errors)
    const descriptionControl = useTexInputFiled(register, errors)
    const productTypeControl = useSelectInput([], control, errors)
    const priceControl = useNumberInputField(register, errors)
    const stockControl = useNumberInputField(register, errors)
    const volumeControl = useNumberInputField(register, errors)
    const imageListControl = useImageListInput()
    const additionalStockControl = useNumberInputField()

    useEffect(() => {
            const fetchCategories = async () => {
                const categories = await configApi.getCategoriesConfig()
                const productTypes = await configApi.getProductTypesConfig()
                productTypeControl.setValuesList(productTypes)
                setSubCategories(categories)
                subCategoriesControl.setValuesList(categories[categoriesControl.selectedValue??''])
            }
            fetchCategories()
            additionalStockControl.setValue(0)
        }, [categoriesControl.selectedValue])
        
    const getProductInputsProps = (): ProductInputsProps => {
        return {
            getDescriptionTextFieldProps: () => {
                return {
                    ...descriptionControl.getTextInputFieldProps(),
                    labelText: "Descripción",
                    name: "description",
                    requiredErrorText: "La descripción es requerida",
                }
            },
            getSelectCategoryProps: () => {
                const props = categoriesControl.getSelectInputProps()
                props.onSelect = (value: string) => {
                    categoriesControl.setSelectedValue(value)
                    subCategoriesControl.setValuesList(subCategories[value])
                    subCategoriesControl.setSelectedValue('')
                }
                return {
                    ...props,
                    label: "Categoría",
                    name: "category",
                    requiredErrorText: "Seleccione una categoría",
                }
            },
            getSelectSubCategoryProps: () => {
                return {
                    ...subCategoriesControl.getSelectInputProps(),
                    label: "SubCategoría",
                    name: "subCategory",
                    requiredErrorText: "Seleccione una subcategoría",
                    disabled: !!!categoriesControl.selectedValue
                }
            },
            getNameTextFieldProps: () => {
                return {
                    ...nameControl.getTextInputFieldProps(),
                    labelText: "Nombre",
                    name: "name",
                    requiredErrorText: "El nombre es requerido",
                }
            },
            getImageListInputProps: imageListControl.getImageListInputProps,
            getPriceProps: () => {
                return {
                    ...priceControl.getNumberInputFieldProps(),
                    labelText: "Precio",
                    name: "price",
                    requiredErrorText: "El precio es requerido",
                }
            },
            getStockFieldProps: () => {
                return {
                    ...stockControl.getNumberInputFieldProps(),
                    labelText: "Stock",
                    name: "stock",
                    requiredErrorText: "El stock es requerido",
                }
            },
            getVolumeFieldProps: () => {
                return {
                    ...volumeControl.getNumberInputFieldProps(),
                    labelText: "Volumen",
                    name: "volume",
                    requiredErrorText: "El volumen es requerido",
                }
            },
            getProductTypeProps: () => {
                return {
                    ...productTypeControl.getSelectInputProps(),
                    label: "Tipo de producto",
                    name: "productType",
                    requiredErrorText: "Seleccione un tipo de producto",
                }
            },
            getAdditionalStockFieldProps: () => {
                return {
                    ...additionalStockControl.getNumberInputFieldProps(),
                    labelText: "Stock adicional",
                }
            }
        }
    }

    const getData = (): ProductInputsProps => {
        additionalStockControl.setValue(0)
        if (nameControl.value.length < 3){
            nameControl.setInputError('El nombre debe tener al menos 3 caracteres')
        }
        else{
            nameControl.clearError()
        }
        return {
            type: categoriesControl.selectedValue,
            subType: subCategoriesControl.selectedValue,
            name: nameControl.value,
            description: descriptionControl.value,
            productType: productTypeControl.selectedValue,
            price: priceControl.value,
            stock: stockControl.value,
            volume: volumeControl.value,
            images: imageListControl.imageList,
            additionalStock: additionalStockControl.value
        }
    }

    const setData = (data: ProductInputsProps) => {
        setValue('category', data.type?? '')
        setValue('subCategory', data.subType?? '')
        setValue('name', data.name?? '')
        setValue('description', data.description?? '')
        setValue('productType', data.productType?? '')
        setValue('price', data.price?? 0)
        setValue('stock', data.stock?? 0)
        setValue('volume', data.volume?? 0)
        categoriesControl.setSelectedValue(data.type?? '')
        subCategoriesControl.setSelectedValue(data.subType?? '')
        nameControl.setValue(data.name?? '')
        descriptionControl.setValue(data.description?? '')
        productTypeControl.setSelectedValue(data.productType?? '')
        priceControl.setValue(data.price?? 0)
        stockControl.setValue(data.stock?? 0)
        volumeControl.setValue(data.volume?? 0)
        imageListControl.setImageList(data.images?? [])
    }

    const clearInputs = () => {
        categoriesControl.clearInput()
        subCategoriesControl.clearInput()
        nameControl.clearInput()
        descriptionControl.clearInput()
        productTypeControl.clearInput()
        priceControl.clearInput()
        stockControl.clearInput()
        volumeControl.clearInput()
        imageListControl.clearInput()
    }

    return {
        getProductInputsProps,
        getData,
        setData,
        clearInputs
    }
    
}