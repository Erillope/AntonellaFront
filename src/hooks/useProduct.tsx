import { useEffect, useState } from "react"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useListImageInput } from "../components/inputs/ListImageInput"
import { ProductInputsProps } from "../components/inputs/productInputs/ProductInputs"
import { useSelectInput } from "../components/inputs/SelectInput"
import { movilCategories } from "../api/config"
import { Permissions, PermissionVerifier } from "../api/verifyPermissions"
import { useNavigate } from "react-router-dom"
import { ConfigApi } from "../api/config_api"
import { capitalizeFirstLetter } from "../api/utils"
import { CreateProduct, Product, ProductApi, UpdateProduct } from "../api/product_api"
import { validateProductName } from "../utils/validators"
import { successCreatedProductMessage, loadingMessage, successProductUpdatedMessage,
    productDeletedMessage
 } from "../utils/alerts"
import { useSwitchInput } from "../components/inputs/SwitchInput"
import { toDateString } from "../api/utils"

interface UseProductProps {
    mode: 'create' | 'read' | 'update'
    productId?: string
}

export const useProduct = (props?: UseProductProps) => {
    const navigate = useNavigate()
    const categoryController = useSelectInput()
    const subCategoryController = useSelectInput()
    const nameController = useInputTextField()
    const descriptionController = useInputTextField()
    const productTypeController = useSelectInput()
    const priceController = useInputTextField()
    const stockController = useInputTextField()
    const volumeController = useInputTextField()
    const stockAdditionalController = useInputTextField()
    const imageListController = useListImageInput()
    const statusController = useSwitchInput()

    const permissionsVerifier = new PermissionVerifier()
    const configApi = new ConfigApi()
    const productApi = new ProductApi()

    const [permissions, setPermissions] = useState<Permissions>()
    const [product, setProduct] = useState<Product>()
    const [mode, setMode] = useState<'create' | 'read' | 'update'>(props?.mode ?? 'create')
    const [subCategories, setSubCategories] = useState<{[key: string]: string[]}>({})

    useEffect(() => {
        const init = async () => {
            stockAdditionalController.setValue('0')
            categoryController.setValues(movilCategories)
            const permissions = await permissionsVerifier.getProductAccessPermissions()
            const subCategories = await configApi.getCategoriesConfig()
            const productTypes = await configApi.getProductTypesConfig()
            productTypeController.setValues(productTypes.map(t => capitalizeFirstLetter(t)))
            setPermissions(permissions)
            setSubCategories(subCategories)
            if (!permissions.create && mode === 'create'){navigate('/')}
            if (!permissions.read && mode === 'read'){navigate('/')}
            if (permissions.read && mode === 'read'){await initProduct()}
        }
        init()
    },[])

    useEffect(() => {
        const options = subCategories[categoryController.value.toUpperCase()]
        if (!options) return
        subCategoryController.setValues(options.map(o => capitalizeFirstLetter(o)))
        subCategoryController.clearInput()
    }, [categoryController.value])

    const createProduct = async () => {
        const data = getCreateProductData()
        if (!validate()) return
        loadingMessage('Creando producto...')
        const product = await productApi.create(data)
        if (!product) return
        successCreatedProductMessage(clearInputs)
    }

    const updateProduct = async () => {
        const data = getUpdateProductData()
        if (!validate()) return
        loadingMessage('Actualizando producto...')
        const updatedProduct = await productApi.update(data)
        setProduct(updatedProduct)
        if (!updatedProduct) return
        initData(updatedProduct)
        successProductUpdatedMessage()
    }

    const deleteProduct = async () => {
        await productApi.delete(product?.id ?? '')
        navigate('/product/search/')
        productDeletedMessage(product?.name ?? '')
    }

    const initProduct = async () => {
        const product = await productApi.get(props?.productId ?? '')
        setProduct(product)
        if (!product) return
        initData(product)
    }

    const initData = (product: Product) => {
        categoryController.setValue(product.type)
        subCategoryController.setValue(product.subType)
        nameController.setValue(product.name)
        descriptionController.setValue(product.description)
        productTypeController.setValue(product.productType)
        priceController.setValue(product.price.toString())
        stockController.setValue(product.stock.toString())
        volumeController.setValue(product.volume.toString())
        imageListController.setImages(product.images)
        statusController.setActive(product.status === 'ENABLE')
        stockAdditionalController.setValue('0')
    }

    const getCreateProductData = (): CreateProduct => {
        return {
            type: categoryController.value,
            subType: subCategoryController.value,
            name: nameController.value,
            description: descriptionController.value,
            productType: productTypeController.value,
            price: priceController.value ? parseFloat(priceController.value) : 0,
            stock: stockController.value ? parseInt(stockController.value) : 0,
            volume: volumeController.value ? parseFloat(volumeController.value) : 0,
            images: imageListController.images ?? [],
        }
    }

    const getUpdateProductData = (): UpdateProduct => {
        return {
            id: product?.id ?? '',
            type: categoryController.value,
            subType: subCategoryController.value,
            name: nameController.value,
            description: descriptionController.value,
            productType: productTypeController.value,
            price: priceController.value ? parseFloat(priceController.value) : 0,
            additionalStock: stockAdditionalController.value ? parseInt(stockAdditionalController.value) : 0,
            volume: volumeController.value ? parseFloat(volumeController.value) : 0,
            images: imageListController.images ?? [],
            status: statusController.active ? 'ENABLE' : 'DISABLE',
        }
    }

    const validate = () => {
        clearErrors()
        let isValid = true
        if (categoryController.isEmpty()) {
            categoryController.setError('Seleccione una categoría')
            isValid = false
        }
        if (subCategoryController.isEmpty()) {
            subCategoryController.setError('Seleccione una subcategoría')
            isValid = false
        }
        if (nameController.isEmpty()) {
            nameController.setError('El nombre es requerido')
            isValid = false
        }
        if (descriptionController.isEmpty()) {
            descriptionController.setError('La descripción es requerida')
            isValid = false
        }
        if (productTypeController.isEmpty()) {
            productTypeController.setError('Seleccione un tipo de producto')
            isValid = false
        }
        if (priceController.isEmpty()) {
            priceController.setError('El precio es requerido')
            isValid = false
        }
        if (stockController.isEmpty()) {
            stockController.setError('El stock es requerido')
            isValid = false
        }
        if (volumeController.isEmpty()) {
            volumeController.setError('El volumen es requerido')
            isValid = false
        }
        if (imageListController.isEmpty()) {
            imageListController.setError('Seleccione al menos una imagen')
            isValid = false
        }
        if (!validateProductName(nameController.value)) {
            nameController.setError('El nombre no es válido')
            isValid = false
        }
        return isValid
    }

    const getInputProps = (): ProductInputsProps => {
        return {
            categoryProps: categoryController.getProps(),
            subCategoryProps: subCategoryController.getProps(),
            nameProps: nameController.getProps(),
            descriptionProps: descriptionController.getProps(),
            productTypeProps: productTypeController.getProps(),
            priceProps: priceController.getProps(),
            stockProps: stockController.getProps(),
            volumeProps: volumeController.getProps(),
            stockAdditionalProps: stockAdditionalController.getProps(),
            imageListProps: imageListController.getProps(),
            statusProps: statusController.getProps(),
            creationDate: product?.createdDate && toDateString(product.createdDate),
            stockModifiedDate: product?.stockModifiedDate && toDateString(product.stockModifiedDate),
        }
    }

    const clearInputs = () => {
        categoryController.clearInput()
        subCategoryController.clearInput()
        nameController.clearInput()
        descriptionController.clearInput()
        productTypeController.clearInput()
        priceController.clearInput()
        stockController.clearInput()
        volumeController.clearInput()
        stockAdditionalController.clearInput()
        imageListController.clearInput()
    }

    const clearErrors = () => {
        categoryController.clearError()
        subCategoryController.clearError()
        nameController.clearError()
        descriptionController.clearError()
        productTypeController.clearError()
        priceController.clearError()
        stockController.clearError()
        volumeController.clearError()
        stockAdditionalController.clearError()
        imageListController.clearError()
    }

    return {
        inputProps: getInputProps(),
        createProduct,
        permissions,
        setMode,
        mode,
        discartChanges: () => initData(product ?? {} as Product),
        updateProduct,
        deleteProduct
    }
}