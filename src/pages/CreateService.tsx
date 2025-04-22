import { ServiceInputs } from "../components/inputs/serviceInputs/ServiceInputs"
import { useService } from "../hooks/useService"
import { ServiceForm } from "../components/forms/ServiceForm"
import { useState } from "react"
import { ServiceQuestionForm } from "../components/inputs/questionInputs/ServiceQuestionForm"
import { ActionForm } from "../components/forms/ActionForm"
import { Box } from "@mui/material"

export const CreateService = () => {
    const { serviceInputProps, validate, getQuestionFormProps, createService } = useService()
    const [inForm, setInForm] = useState(false)

    return (
        <>
            {!inForm ?
                <ServiceForm width="90%" handleSubmit={() => setInForm(validate())}>
                    <ServiceInputs {...serviceInputProps} />
                </ServiceForm>
                :
                <ActionForm width="90%" handleSubmit={createService}>
                    <Box marginBottom={3}>
                        <ServiceQuestionForm {...getQuestionFormProps()} />
                    </Box>
                </ActionForm>
            }
        </>
    )
}