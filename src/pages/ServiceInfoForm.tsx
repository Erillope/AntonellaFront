import { Box } from "@mui/material"
import { useParams } from "react-router-dom"
import { ActionForm } from "../components/forms/ActionForm"
import { ServiceQuestionForm } from "../components/inputs/questionInputs/ServiceQuestionForm"
import { useService } from "../hooks/useService"

export const ServiceInfoForm = () => {
    const { id } = useParams()
    const { mode, getQuestionFormProps, permissions, setMode, discartChanges, saveQuestions
    } = useService({ mode: 'read', serviceId: id })

    return (
        <ActionForm width="90%" allowEdit={permissions?.edit} edit={() => setMode('update')} discartChanges={discartChanges} mode={mode} handleSubmit={saveQuestions}>
            <Box marginBottom={3}>
                <ServiceQuestionForm {...getQuestionFormProps()} disabled={mode === 'read'} />
            </Box>
        </ActionForm>
    )
}