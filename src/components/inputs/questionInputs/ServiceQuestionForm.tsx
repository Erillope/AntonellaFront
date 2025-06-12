import { useState } from "react"
import { AddQuestionInput } from "./AddQuestionInput"
import { QuestionTable } from "../../tables/QuestionTable"
import { ModalBox } from "../../ModalBox"
import { Question as QuestionInfo } from "../../../api/store_service_api"
import { Question, QuestionProps } from "./ChoiceQuestions"
import { Box, Button } from "@mui/material"
import { confirmDeleteQuestionMessage } from "../../../utils/alerts"

export interface ServiceQuestionForm {
    setQuestionType?: (type: 'choiceImage' | 'choiceText' | 'text' | 'image') => void
    newQuestionProps?: QuestionProps
    addQuestion?: () => boolean
    questions?: QuestionInfo[]
    selectQuestion?: (id: string) => void
    selectedQuestionProps?: QuestionProps
    initNewQuestion?: () => void
    updateQuestion?: (id: string) => boolean
    deleteQuestion?: (id: string) => void
    disabled?: boolean
}

export const ServiceQuestionForm = (props: ServiceQuestionForm) => {
    const [open, setOpen] = useState(false)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>()

    const onSelectQuestion = (id: string) => {
        props.selectQuestion?.(id)
        setSelectedQuestionId(id)
        setOpen(true)
    }

    const onUpdateQuestion = () => {
        if (!props.updateQuestion?.(selectedQuestionId ?? '')) return
        setOpen(false)
    }

    const onDeleteQuestion = () => {
        confirmDeleteQuestionMessage(() => props.deleteQuestion?.(selectedQuestionId ?? ''))
        setOpen(false)
    }
    return (
        <Box>
            <AddQuestionInput setType={props.setQuestionType} newQuestionProps={props.newQuestionProps}
                onAddQuestion={props.addQuestion} onOpenQuestion={props.initNewQuestion} questionsLength={props.questions?.length} disabled={props.disabled} />
            <QuestionTable questions={props.questions} onSelectQuestion={onSelectQuestion} />
            <ModalBox open={open} setOpen={setOpen}>
                <Box display={"flex"} flexDirection="column" gap={1} p={2} width={"90%"} height={'100%'}>
                    <Question {...props.selectedQuestionProps ?? {} as any} disabled={props.disabled} />
                    {!props.disabled &&
                        <Box display={"flex"} flexDirection="row" gap={2} width='100%' justifyContent="center" alignItems="center">
                            <Button className={'login-button'} onClick={onUpdateQuestion}
                                style={{ width: '20%', marginLeft: '20px' }}
                            >Guardar Cambios</Button>
                            <Button className={'login-button'} onClick={onDeleteQuestion}
                                style={{ width: '20%', marginLeft: '20px' }}
                            >Eliminar</Button>
                        </Box>
                    }
                </Box>
            </ModalBox>
        </Box>
    )
}