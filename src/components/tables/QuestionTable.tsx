import { Box } from "@mui/material";
import { Question } from "../../api/store_service_api";
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"

const headers: HeaderInfo[] = [
    { label: 'Pregunta', width: '20%'},
    { label: 'Tipo', width: '60%'},
    { label: 'Gestionar', width: '20%'}
]

const getTypeLabel = (questionType: 'TEXT' | 'IMAGE' | 'CHOICE', choiceType: 'TEXT' | 'IMAGE'|'') => {
    if (questionType === 'TEXT') {
        return 'Selección texto'
    }
    if (questionType === 'IMAGE') {
        return 'Selección imagen'
    }
    if (questionType === 'CHOICE') {
        return choiceType === 'TEXT' ? 'Campo de texto' : 'Subir imágenes'
    }
}


const typelabelColor = (questionType: 'TEXT' | 'IMAGE' | 'CHOICE', choiceType: 'TEXT' | 'IMAGE'|'') => {
    if (questionType === 'TEXT') {
        return '#29AAE1'
    }
    if (questionType === 'IMAGE') {
        return '#39B44A'
    }
    if (questionType === 'CHOICE') {
        return choiceType === 'TEXT' ? '#FBB03B' : '#E596A9'
    }
}

interface QuestionTableProps {
    questions?: Question[];
    onSelectQuestion?: (questionId: string) => void;
}

export const QuestionTable = (props: QuestionTableProps) => {
    const buildRows = (question: Question): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='flex-start' width='100%'>{question.title}</Box>,
                <Box display='flex' alignItems='center' justifyContent='center' width='30%'
                bgcolor={typelabelColor(question.inputType, question.choiceType??'')} 
                color='white' height='30px' borderRadius={2}>{
                    getTypeLabel(question.inputType, question.choiceType??'')}
                </Box>,
                <ManageActionCell color="black" viewAction={() => props.onSelectQuestion?.(question.id)}/>
            ]
        }
    }



    return (
        <TableView headers={headers} rows={props.questions?.map(buildRows)}/>
    )
}