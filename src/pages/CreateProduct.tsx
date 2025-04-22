import { ProductInputs } from "../components/inputs/productInputs/ProductInputs"
import { ActionForm } from "../components/forms/ActionForm"
import { useProduct } from "../hooks/useProduct"

export const CreateProduct = () => {
    const { inputProps, createProduct } = useProduct()
   
    return (
        <ActionForm width="90%" handleSubmit={createProduct}>
            <ProductInputs {...inputProps}/>
        </ActionForm>
    )
}