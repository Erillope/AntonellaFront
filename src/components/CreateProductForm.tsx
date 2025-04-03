import { Button } from "@mui/material";

interface CreateProductFormProps {
    formRef?: React.Ref<HTMLFormElement>;
    handleSubmit?: () => () => void;
    children: React.ReactNode;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ formRef, handleSubmit, children }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: '100%',
            overflowY: 'auto'}}>
            <form ref={formRef} onSubmit={handleSubmit?.()} style={{width: '100%'}}>
                <div style={{ width: "100%"}}>
                    {children}
                </div>
                <SubmitButton />
            </form>
        </div>
    )
}

const SubmitButton = () => {
    return (
        <div style={{ width: '90%', display: "flex", justifyContent: "flex-start" }}>
            <Button type='submit' className="submit-button">Guardar</Button>
        </div>
    )
}