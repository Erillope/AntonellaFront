import { useTexInputFiled } from "../components/inputField/TextInputField"
import { useForm } from "react-hook-form"
import { useNumberInputField } from "../components/inputField/NumberInputField"
import { usePriceRange } from "../components/inputField/PriceRange"
import { SelectInputProps, useSelectInput } from "../components/inputField/SelectInput"
import { useImageListInput } from "../components/inputField/ImageListInput"
import { ServiceInputsProps } from "../components/inputField/ServiceInputs"
import { CreateStoreService, Price, StoreService, UpdateStoreService } from "../api/store_service_api"
import { PermissionVerifier } from "../api/verifyPermissions"
import { useEffect, useState } from "react"
import { ConfigApi } from "../api/config_api"

export const useServiceForm = () => {
    const configApi = new ConfigApi()
    const categories = ["CABELLO", "UÑAS", "SPA", "MAQUILLAJE"]
    const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({})
    const permissionVerifier = new PermissionVerifier()
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm()
    const nameControl = useTexInputFiled(register, errors)
    const imageListControl = useImageListInput()
    const hourControl = useNumberInputField(register, errors)
    const minuteControl = useNumberInputField(register, errors)
    const categoryControl = useSelectInput(categories, control, errors)
    const subCategoryControl = useSelectInput([], control, errors)
    const textAreaControl = useTexInputFiled(register, errors)
    const shortPriceControl = usePriceRange(register, errors)
    const mediumPriceControl = usePriceRange(register, errors)
    const longPriceControl = usePriceRange(register, errors)
    const basicPriceControl = usePriceRange(register, errors)
    const completePriceControl = usePriceRange(register, errors)

    const verifyErrors = (): boolean => {
        if (nameControl.value.length <= 3) {
            nameControl.setInputError('El nombre debe tener al menos 3 caracteres')
            return true
        }
        nameControl.setInputError('')
        if (categoryControl.selectedValue === 'CABELLO' || 'UÑAS') {
            if ((shortPriceControl.minPrice ?? 0) >= (shortPriceControl.maxPrice ?? 0)) {
                shortPriceControl.setMinError('El precio mínimo debe ser menor al máximo')
                return true
            }
            shortPriceControl.setMinError('')
            if ((mediumPriceControl.minPrice ?? 0) >= (mediumPriceControl.maxPrice ?? 0)) {
                mediumPriceControl.setMinError('El precio mínimo debe ser menor al máximo')
                return true
            }
            mediumPriceControl.setMinError('')
            if ((longPriceControl.minPrice ?? 0) >= (longPriceControl.maxPrice ?? 0)) {
                longPriceControl.setMinError('El precio mínimo debe ser menor al máximo')
                return true
            }
            longPriceControl.setMinError('')
        }

        else {
            if ((basicPriceControl.minPrice ?? 0) >= (basicPriceControl.maxPrice ?? 0)) {
                basicPriceControl.setMinError('El precio mínimo debe ser menor al máximo')
                return true
            }
            basicPriceControl.setMinError('')
            if ((completePriceControl.minPrice ?? 0) >= (completePriceControl.maxPrice ?? 0)) {
                completePriceControl.setMinError('El precio mínimo debe ser menor al máximo')
                return true
            }
            completePriceControl.setMinError('')
        }


        return false
    }
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await configApi.getCategoriesConfig()
            setSubCategories(categories)
            subCategoryControl.setValuesList(categories[categoryControl.selectedValue ?? ''])
        }
        fetchCategories()
    }, [categoryControl.selectedValue])

    const getServiceInputsProps = (): ServiceInputsProps => {
        const categoryProps = (): SelectInputProps => {
            const props = categoryControl.getSelectInputProps()
            props.onSelect = (value: string) => {
                categoryControl.setSelectedValue(value)
                subCategoryControl.setValuesList(subCategories[value])
                subCategoryControl.setSelectedValue('')
            }
            return props
        }
        return {
            getHourFieldProps: hourControl.getNumberInputFieldProps,
            getMinuteFieldProps: minuteControl.getNumberInputFieldProps,
            getSelectCategoryProps: categoryProps,
            getSelectSubCategoryProps: subCategoryControl.getSelectInputProps,
            getNameTextFieldProps: nameControl.getTextInputFieldProps,
            getBasicPriceRangeProps: basicPriceControl.getPriceRangeProps,
            getCompletePriceRangeProps: completePriceControl.getPriceRangeProps,
            getImageListInputProps: imageListControl.getImageListInputProps,
            getTextAreaFieldProps: textAreaControl.getTextInputFieldProps,
            getShortPriceRangeProps: shortPriceControl.getPriceRangeProps,
            getMediumPriceRangeProps: mediumPriceControl.getPriceRangeProps,
            getLongPriceRangeProps: longPriceControl.getPriceRangeProps,
            showHeightPrice,
        }
    }

    const getCreateData = (): CreateStoreService => {
        return {
            name: nameControl.value,
            description: textAreaControl.value,
            type: categoryControl.selectedValue ?? '',
            subType: subCategoryControl.selectedValue ?? '',
            prices: getPricesData(),
            duration: {
                hours: hourControl.value ?? 0,
                minutes: minuteControl.value ?? 0,
            },
            images: imageListControl.imageList,
        }
    }

    const getUpdateData = (id: string): UpdateStoreService => {
        return {
            id: id,
            name: nameControl.value,
            description: textAreaControl.value,
            type: categoryControl.selectedValue,
            subType: subCategoryControl.selectedValue,
            prices: getPricesData(),
            duration: {
                hours: hourControl.value ?? 0,
                minutes: minuteControl.value ?? 0,
            },
            images: imageListControl.imageList,
        }
    }

    const getPricesData = (): Price[] => {
        return showHeightPrice() ? [
            {
                name: 'SHORT',
                minPrice: shortPriceControl.minPrice ?? 0,
                maxPrice: shortPriceControl.maxPrice ?? 0,
            },
            {
                name: 'MEDIUM',
                minPrice: mediumPriceControl.minPrice ?? 0,
                maxPrice: mediumPriceControl.maxPrice ?? 0,
            },
            {
                name: 'LONG',
                minPrice: longPriceControl.minPrice ?? 0,
                maxPrice: longPriceControl.maxPrice ?? 0,
            }
        ]
            : [
                {
                    name: 'BASIC',
                    minPrice: basicPriceControl.minPrice ?? 0,
                    maxPrice: basicPriceControl.maxPrice ?? 0,
                },
                {
                    name: 'COMPLETE',
                    minPrice: completePriceControl.minPrice ?? 0,
                    maxPrice: completePriceControl.maxPrice ?? 0,
                }
            ]
    }

    const showHeightPrice = (): boolean => {
        const selectedCategory = categoryControl.selectedValue
        return selectedCategory === 'CABELLO' || selectedCategory == 'UÑAS'
    }

    const clearForm = () => {
        nameControl.clearInput()
        imageListControl.clearInput()
        hourControl.clearInput()
        minuteControl.clearInput()
        categoryControl.clearInput()
        textAreaControl.clearInput()
        shortPriceControl.clearInput()
        mediumPriceControl.clearInput()
        longPriceControl.clearInput()
        basicPriceControl.clearInput()
        completePriceControl.clearInput()
        subCategoryControl.clearInput()
    }

    const clearErrors = () => {
        nameControl.clearError()
        imageListControl.clearInput()
        hourControl.clearError()
        minuteControl.clearError()
        categoryControl.clearError()
        textAreaControl.clearError()
        shortPriceControl.clearError()
        mediumPriceControl.clearError()
        longPriceControl.clearError()
        basicPriceControl.clearError()
        completePriceControl.clearError()
        subCategoryControl.clearError()
    }

    const verifyCreatePermissions = async (action: () => void) => {
        const permissions = await permissionVerifier.getUserAccessPermissions();
        if (!permissions.create) {
            action();
        }
    }

    const initCreate = (notHaveCreatePermissions: () => void) => {
        const fetch = async () => {
            await verifyCreatePermissions(notHaveCreatePermissions ?? (() => { }))
            initCreateServiceData()
        }
        fetch()
    }

    const initCreateServiceData = () => {
        const createServiceData: CreateStoreService = JSON.parse(localStorage.getItem('createServiceData') ?? '{}')
        initBasicData(createServiceData.name, createServiceData.description,
            createServiceData.duration.hours, createServiceData.duration.minutes,
            createServiceData.type, createServiceData.subType)
        initImageList(createServiceData.images)
        initPrices(createServiceData.prices)
    }

    const initEditData = (service: StoreService) => {
        initBasicData(service.name, service.description,
            service.duration.hours, service.duration.minutes,
            service.type, service.subType)
        initImageList(service.images.map((image) => image))
        initPrices(service.prices)
    }

    const initBasicData = (name: string, description: string, hour: number, minute: number, category: string, subCategory: string) => {
        setValue('name', name)
        setValue('description', description)
        setValue('hour', hour)
        setValue('minute', minute)
        setValue('category', category)
        setValue('subCategory', subCategory)
        nameControl.setValue(name)
        textAreaControl.setValue(description)
        hourControl.setValue(hour)
        minuteControl.setValue(minute)
        categoryControl.setSelectedValue(category)
        subCategoryControl.setValuesList(subCategories[category])
        subCategoryControl.setSelectedValue(subCategory)
    }

    const initImageList = (images: string[]) => {
        setValue('images', images)
        imageListControl.setImageList(images)
    }

    const initPrices = (prices: Price[]) => {
        prices.forEach((price) => {
            if (price.name === 'SHORT') {
                setValue('shortPriceMin', price.minPrice)
                setValue('shortPriceMax', price.maxPrice)
                shortPriceControl.setMinPrice(price.minPrice)
                shortPriceControl.setMaxPrice(price.maxPrice)
            }
            if (price.name === 'MEDIUM') {
                setValue('mediumPriceMin', price.minPrice)
                setValue('mediumPriceMax', price.maxPrice)
                mediumPriceControl.setMinPrice(price.minPrice)
                mediumPriceControl.setMaxPrice(price.maxPrice)
            }
            if (price.name === 'LONG') {
                setValue('longPriceMin', price.minPrice)
                setValue('longPriceMax', price.maxPrice)
                longPriceControl.setMinPrice(price.minPrice)
                longPriceControl.setMaxPrice(price.maxPrice)
            }
            if (price.name === 'BASIC') {
                setValue('basicPriceMin', price.minPrice)
                setValue('basicPriceMax', price.maxPrice)
                basicPriceControl.setMinPrice(price.minPrice)
                basicPriceControl.setMaxPrice(price.maxPrice)
            }
            if (price.name === 'COMPLETE') {
                setValue('completePriceMin', price.minPrice)
                setValue('completePriceMax', price.maxPrice)
                completePriceControl.setMinPrice(price.minPrice)
                completePriceControl.setMaxPrice(price.maxPrice)
            }
        })
    }


    return {
        getServiceInputsProps,
        handleSubmit,
        getCreateData,
        clearForm,
        verifySelectedImageError: imageListControl.verifySelectedImageError,
        verifyCreatePermissions,
        initCreate,
        subCategories,
        categories,
        configApi,
        initEditData,
        getUpdateData,
        verifyErrors
    }
}