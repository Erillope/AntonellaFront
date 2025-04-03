import { useForm } from "react-hook-form"
import { CreateProductForm } from "../components/CreateProductForm"
import { ProductInputs, useProductInputs } from "../components/inputField/ProductInputs"
import { ProductApi } from "../api/product_api"
import { successCreatedProductMessage } from "../utils/alerts"
import { useEffect } from "react"
import { PermissionVerifier } from "../api/verifyPermissions"
import { useNavigate } from "react-router-dom"

export const CreateProduct = () => {
    const navigate = useNavigate()
    const { register, control, formState: { errors }, handleSubmit } = useForm()
    const productApi = new ProductApi()
    const { getProductInputsProps, getData, clearInputs } = useProductInputs(register, control, errors)
    
    useEffect(() => {
        const init = async () => {
            const permissionsVerifier = new PermissionVerifier()
            const permissions = await permissionsVerifier.getProductAccessPermissions()
            if (!permissions.create){
                navigate('/')
                return
            }
        }
        init()
    }, [])

    const createProduct = async () => {
        const data = getData()
        const response = await productApi.create({
            type: data.type?? '',
            subType: data.subType?? '',
            name: data.name?? '',
            description: data.description?? '',
            productType: data.productType?? '',
            price: data.price?? 0,
            stock: data.stock?? 0,
            volume: data.volume?? 0,
            images: data.images?? []
        })
        if (response){
            clearInputs()
            successCreatedProductMessage()
        }
    }

    return (
        <CreateProductForm handleSubmit={() => handleSubmit(createProduct)}>
            <ProductInputs {...getProductInputsProps()} />
        </CreateProductForm>
    )
}