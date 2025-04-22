import { useState } from "react"
import { useService } from "../hooks/useService"
import { ServiceForm } from "../components/forms/ServiceForm"
import { ServiceInputs } from "../components/inputs/serviceInputs/ServiceInputs"
import { useParams } from "react-router-dom"
import { ActionForm } from "../components/forms/ActionForm"
import { ServiceQuestionForm } from "../components/inputs/questionInputs/ServiceQuestionForm"
import { confirmDeleteServiceMessage } from "../utils/alerts"
import { Box } from "@mui/material"

export const ServiceInfo = () => {
    const { id } = useParams()
    const { serviceInputProps, mode, getQuestionFormProps, permissions, setMode, discartChanges,
        updateService, deleteService, saveQuestions
    } = useService({ mode: 'read', serviceId: id })
    const [inForm, setInForm] = useState(false)

    return (
        <>
            {!inForm ?
                <ServiceForm width="90%" mode={mode} allowEdit={permissions?.edit} edit={() => setMode('update')} discartChanges={discartChanges} handleSubmit={updateService} allowDelete={permissions?.delete} delete={() => confirmDeleteServiceMessage(deleteService)}
                    toForm={() => setInForm(true)}>
                    <ServiceInputs {...serviceInputProps} disabled={mode === 'read'} />
                </ServiceForm>
                :
                <ActionForm width="90%" allowEdit={permissions?.edit} edit={() => setMode('update')} discartChanges={discartChanges} mode={mode} handleSubmit={saveQuestions}>
                    <Box marginBottom={3}>
                        <ServiceQuestionForm {...getQuestionFormProps()} disabled={mode === 'read'} />
                    </Box>
                </ActionForm>
            }
        </>

    )
}