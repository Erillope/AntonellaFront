import { QuestionsInfo } from "../components/QuestionsInfo"
import { CreateQuestion } from "../api/store_service_api"
import { useEffect, useState } from "react"
import { Question } from "../api/store_service_api"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@mui/material"
import { CreateStoreService } from "../api/store_service_api"
import { useService } from "../hooks/useService"
import { useNavigate } from "react-router-dom"

export const ServiceForm = () => {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<Question[]>([])
    const [serviceData, setServiceData] = useState<CreateStoreService>({} as CreateStoreService)
    const { createService } = useService({})

    useEffect(() => {
        const serviceData: CreateStoreService = JSON.parse(localStorage.getItem('createServiceData') || '{}')
        if (Object.keys(serviceData).length === 0){
            navigate('/')
            return
        }
        setServiceData(serviceData)
    }, [])

    const handleCreateService = async () => {
        serviceData.questions = questions
        await createService(serviceData)
    }

    const createQuestion = (question: CreateQuestion) => {
        const questionData: Question = {...question, id: uuidv4()}
        setQuestions((prev) => [...prev, questionData])
    }

    const deleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter((question) => question.id !== questionId)
        setQuestions(updatedQuestions)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 100,
            width: '100%'
        }}>
            <QuestionsInfo onCreateQuestion={createQuestion} questions={questions}
            onChangeQuestions={setQuestions} onDeleteQuestion={deleteQuestion}/>
            <Button className="submit-button" style={{width: '10%'}}
            onClick={handleCreateService}>Guardar</Button>
        </div>
    )
}