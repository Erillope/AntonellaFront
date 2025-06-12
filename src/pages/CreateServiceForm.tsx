import { Box } from "@mui/material"
import { ActionForm } from "../components/forms/ActionForm"
import { ServiceQuestionForm } from "../components/inputs/questionInputs/ServiceQuestionForm"
import { useQuestionForm } from "../hooks/useQuestionForm"
import { useService } from "../hooks/useService"


export const CreateServiceForm = () => {
    const { getProps, getQuestions } = useQuestionForm()
    const { createService } = useService()
    
    return (
        <ActionForm width="90%" handleSubmit={() => createService(getQuestions())}>
            <Box marginBottom={3}>
                <ServiceQuestionForm {...getProps()}/>
            </Box>
        </ActionForm>
    )
}