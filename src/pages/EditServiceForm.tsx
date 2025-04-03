import { useEffect, useState } from "react"
import { useService } from "../hooks/useService"
import { useParams } from "react-router-dom"
import { QuestionsInfo } from "../components/QuestionsInfo"
import { CreateQuestion, Question } from "../api/store_service_api"
import { Button } from "@mui/material"
import { v4 as uuidv4 } from "uuid"
import { successFormUpdatedMessage } from "../utils/alerts"

export const EditServiceForm = () => {
    const { id } = useParams()
    const { initEdit, editService, storeServiceApi, editable} = useService({})
    const [deleteQuestions, setDeleteQuestions] = useState<string[]>([])
    
    useEffect(() => initEdit(id ?? ''), [])
    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {setQuestions(editService.questions)}, [editService])

    const editServiceForm = async() => {
        questions.forEach((question) => {
            if (editService.questions.find((q) => q.id === question.id)){
                storeServiceApi.updateQuestion({...question})
            }
            else{
                storeServiceApi.createQuestion({...question, serviceId: editService.id})
            }
        })
        deleteQuestions.forEach((questionId) => {
            storeServiceApi.deleteQuestion(questionId)
        })
        successFormUpdatedMessage()
    }

    const createQuestion = (question: CreateQuestion) => {
        const questionData: Question = {...question, id: uuidv4()}
        setQuestions((prev) => [...prev, questionData])
    }

    const deleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter((question) => question.id !== questionId)
        setQuestions(updatedQuestions)
        const question = editService.questions.find((q) => q.id === questionId)
        if (question) {
            setDeleteQuestions((prev) => [...prev, questionId])
        }
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 100,
            width: '100%'
        }}>
            <QuestionsInfo questions={questions} onCreateQuestion={createQuestion} editable={editable}
                onChangeQuestions={setQuestions} onDeleteQuestion={deleteQuestion}/>
            <Button className="submit-button" style={{ width: '10%' }} onClick={editServiceForm}>
                Guardar</Button>
        </div>
    )
}