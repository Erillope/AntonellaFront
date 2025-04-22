import { CreateQuestion, CreateStoreService, Question, StoreService, UpdateQuestion, UpdateStoreService } from "../api/store_service_api";
import { StoreServiceApi } from "../api/store_service_api";
import { useEffect, useState } from "react";
import { loadingMessage, successServiceCreatedMessage, successServiceUpdatedMessage, successFormUpdatedMessage, questionsNotCreatedMessage } from "../utils/alerts";
import { useNavigate } from "react-router-dom";
import { Permissions, PermissionVerifier } from "../api/verifyPermissions";
import { useSelectInput } from "../components/inputs/SelectInput";
import { useInputTextField } from "../components/inputs/InputTextField";
import { useDurationInput } from "../components/inputs/DurationInput";
import { usePriceRange } from "../components/inputs/PriceRange";
import { movilCategories } from "../api/config";
import { ConfigApi } from "../api/config_api";
import { capitalizeFirstLetter } from "../api/utils";
import { ServiceInputsProps } from "../components/inputs/serviceInputs/ServiceInputs";
import { AuthUserApi, User } from "../api/user_api";
import { useListImageInput } from "../components/inputs/ListImageInput";
import { useQuestionForm } from "./useQuestionForm";

interface UseServiceProps {
    mode?: 'create' | 'update' | 'read'
    serviceId?: string
}

export const useService = (props?: UseServiceProps) => {
    const navigate = useNavigate()
    const permissionsVerifier = new PermissionVerifier()
    const storeServiceApi = new StoreServiceApi()
    const configApi = new ConfigApi()
    const apiUser = new AuthUserApi()
    const { getProps, getQuestions, initQuestions } = useQuestionForm()

    const [users, setUsers] = useState<User[]>([])
    const [service, setService] = useState<StoreService>()

    const categoryController = useSelectInput()
    const subCategoryController = useSelectInput()
    const nameController = useInputTextField()
    const durationController = useDurationInput()
    const descriptionController = useInputTextField()
    const priceRangeController = usePriceRange()
    const listImageController = useListImageInput()

    const [permissions, setPermissions] = useState<Permissions>()
    const [mode, setMode] = useState<'create' | 'update' | 'read'>(props?.mode ?? 'create')
    const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({})

    useEffect(() => {
        const init = async () => {
            const permissions = await permissionsVerifier.getServiceAccessPermissions()
            const subCategories = await configApi.getCategoriesConfig()
            categoryController.setValues(movilCategories)
            setPermissions(permissions)
            setSubCategories(subCategories)
            if (!permissions.create && mode === 'create') { navigate('/') }
            if (!permissions.read && mode === 'read') { navigate('/') }
            if (permissions.read && mode === 'read') { await initService() }
        }
        init()
    }, [])

    useEffect(() => {
        const options = subCategories[categoryController.value.toUpperCase()]
        if (!options) return
        subCategoryController.setValues(options.map(o => capitalizeFirstLetter(o)))
        subCategoryController.clearInput()
        const initUsers = async () => {
            const users = await apiUser.filterUsers({ orderBy: "name", orderDirection: "ASC" })
            const userCategories = users.filter(user => user.categories?.includes(categoryController.value))
            setUsers(userCategories)
        }
        initUsers()
        if (categoryController.value === 'Uñas' || categoryController.value === 'Cabello') {
            priceRangeController.setType('long')
        }
        else { priceRangeController.setType('default') }
    }, [categoryController.value])

    const createService = async () => {
        const data = getCreateServiceData()
        if (data.questions.length === 0) {questionsNotCreatedMessage(); return}
        loadingMessage('Creando servicio...')
        const service = await storeServiceApi.createStoreService(data)
        if (service) {
            successServiceCreatedMessage()
            setService(service)
            navigate(`/service/search/`)
        }
    }

    const updateService = async () => {
        const data = getUpdateServiceData()
        if (!validate()) return
        loadingMessage('Actualizando servicio...')
        const service = await storeServiceApi.update(data)
        if (service) {
            setService(service)
            successServiceUpdatedMessage()
        }
    }

    const deleteService = async () => {
        loadingMessage('Eliminando servicio...')
        await storeServiceApi.deleteStoreService(props?.serviceId ?? '')
        successServiceUpdatedMessage()
        navigate(`/service/search/`)
    }

    const saveQuestions = async () => {
        const questions = getQuestions()
        const updateQuestions: Question[] = []
        if (questions.length === 0) {questionsNotCreatedMessage(); return}
        loadingMessage('Guardando preguntas...')
        for (const question of questions) {
            if (service?.questions.find(q => q.id === question.id)) {
                const updateQuestionData = getUpdateQuestionData(question)
                const q = await storeServiceApi.updateQuestion(updateQuestionData)
                if (q) {
                    updateQuestions.push(q)
                }
            }
            else {
                const createQuestionData = getCreateQuestionData(question)
                const q = await storeServiceApi.createQuestion(createQuestionData)
                if (q) {
                    updateQuestions.push(q)
                }
            }
        }
        for (const question of service?.questions ?? []) {
            if (!updateQuestions.find(q => q.id === question.id)) {
                await storeServiceApi.deleteQuestion(question.id)
            }
        }
        successFormUpdatedMessage()
        setService((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                questions: updateQuestions,
            }
        }
        )
    }

    const getUpdateQuestionData = (question: Question): UpdateQuestion => {
        return {
            id: question.id,
            title: question.title,
            choiceType: question.choiceType,
            choices: question.choices,
        }
    }

    const getCreateQuestionData = (question: Question): CreateQuestion => {
        return {
            serviceId: service?.id ?? '',
            inputType: question.inputType,
            title: question.title,
            choiceType: question.choiceType,
            choices: question.choices,
        }
    }

    const getServiceInputProps = (): ServiceInputsProps => {
        return {
            categoryProps: categoryController.getProps(),
            subCategoryProps: subCategoryController.getProps(),
            nameProps: nameController.getProps(),
            durationProps: durationController.getDurationInputProps(),
            descriptionProps: descriptionController.getProps(),
            priceRangeProps: priceRangeController.getProps(),
            imageProps: listImageController.getProps(),
            users: users,
        }
    }

    const getCreateServiceData = (): CreateStoreService => {
        return {
            name: nameController.value,
            description: descriptionController.value,
            type: categoryController.value,
            subType: subCategoryController.value,
            prices: priceRangeController.getData(),
            duration: durationController.getData(),
            images: listImageController.images,
            questions: getQuestions(),
        }
    }

    const getUpdateServiceData = (): UpdateStoreService => {
        return {
            id: service?.id ?? '',
            name: nameController.value,
            description: descriptionController.value,
            type: categoryController.value,
            subType: subCategoryController.value,
            prices: priceRangeController.getData(),
            duration: durationController.getData(),
            images: listImageController.images,
        }
    }

    const validate = () => {
        clearErrors()
        let isValid = true
        if (categoryController.isEmpty()) {
            categoryController.setError('La categoría es requerida')
            isValid = false
        }
        if (subCategoryController.isEmpty()) {
            subCategoryController.setError('La subcategoría es requerida')
            isValid = false
        }
        if (nameController.isEmpty()) {
            nameController.setError('El nombre es requerido')
            isValid = false
        }
        isValid = durationController.validate()
        if (descriptionController.isEmpty()) {
            descriptionController.setError('La descripción es requerida')
            isValid = false
        }
        isValid = priceRangeController.validate()
        if (listImageController.isEmpty()) {
            listImageController.setError('Las imágenes son requeridas')
            isValid = false
        }
        return isValid
    }

    const clearErrors = () => {
        categoryController.clearError()
        subCategoryController.clearError()
        nameController.clearError()
        durationController.clearError()
        descriptionController.clearError()
        priceRangeController.clearErrors()
        listImageController.clearError()
    }

    const initService = async () => {
        const service = await storeServiceApi.get(props?.serviceId ?? '')
        if (!service) return
        setService(service)
        initData(service)
    }

    const initData = (service: StoreService) => {
        categoryController.setValue(service?.type ?? '')
        subCategoryController.setValue(service?.subType ?? '')
        nameController.setValue(service?.name ?? '')
        durationController.setData(service?.duration ?? { hours: 0, minutes: 0 })
        descriptionController.setValue(service?.description ?? '')
        const servicePriceType = service?.type === 'Uñas' || service?.type === 'Cabello' ? 'long' : 'default'
        priceRangeController.setType(servicePriceType)
        priceRangeController.setData(service?.prices ?? [], servicePriceType)
        listImageController.setImages(service?.images ?? [])
        initQuestions(service?.questions ?? [])
    }

    useEffect(() => {
        const subCategory = subCategories[categoryController.value.toUpperCase()]
        if (subCategory && subCategory.includes(service?.subType?.toUpperCase() ?? '')) {
            subCategoryController.setValue(service?.subType ?? '')
        }
    }, [initData])

    return {
        createService,
        storeServiceApi,
        serviceInputProps: getServiceInputProps(),
        validate,
        setMode,
        permissions,
        getQuestionFormProps: getProps,
        service,
        mode,
        discartChanges: () => initData(service as StoreService),
        updateService,
        deleteService,
        saveQuestions
    }
}