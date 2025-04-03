import { ProductInputs, useProductInputs } from "../components/inputField/ProductInputs"
import { CreateProductForm } from "../components/CreateProductForm"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ProductApi, Product } from "../api/product_api"
import { successProductUpdatedMessage } from "../utils/alerts"
import { PermissionVerifier } from "../api/verifyPermissions"

export const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const productApi = new ProductApi()
    const permissionsVerifier = new PermissionVerifier()
    const [product, setProduct] = useState<Product>({} as Product)
    const { register, control, formState: { errors }, handleSubmit, setValue } = useForm()
    const { getData, getProductInputsProps, setData } = useProductInputs(register, control, errors, setValue)
    const [ editable, setEditable ] = useState(false)

    useEffect(() => {
        const getProduct = async() => {
            const product = await productApi.get(id?? '')
            const permissions = await permissionsVerifier.getProductAccessPermissions()
            if (!permissions.create){navigate('/'); return}
            setEditable(!permissions.edit)
            if (product) {
                setProduct(product)
                setData({...product})
            }
        }
        getProduct()
    }, [])

    const updateProduct = async () => {
        const p = await productApi.update({...getData(), id: product.id})
        if (p) {
            setProduct(p)
            setData(p)
            successProductUpdatedMessage()
        }
    }
    
    return (
        <CreateProductForm handleSubmit={() => handleSubmit(updateProduct)}>
            <ProductInputs {...getProductInputsProps()} editMode={true} disabled={editable}/>
        </CreateProductForm>
    )
}