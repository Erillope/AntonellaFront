import { ProductInputs } from "../components/inputs/productInputs/ProductInputs"
import { useParams } from "react-router-dom"
import { ActionForm } from "../components/forms/ActionForm"
import { useProduct } from "../hooks/useProduct"
import { confirmDeleteProductMessage } from "../utils/alerts"

export const EditProduct = () => {
    const { id } = useParams()
    const { inputProps, updateProduct, mode, discartChanges, permissions, setMode, deleteProduct } = useProduct({ mode: 'read', productId: id }) 

    return (
        <ActionForm width="90%" handleSubmit={updateProduct} mode={mode} discartChanges={discartChanges}
            edit={() => setMode('update')} allowEdit={permissions?.edit} allowDelete={permissions?.delete}
            delete={() => confirmDeleteProductMessage(deleteProduct)}>
            <ProductInputs {...inputProps} disabled={mode === 'read'} showExtraInfo/>
        </ActionForm>
    )
}