import { Box, Button, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import { CheckInput } from "../CheckInput"
import { Question, QuestionProps } from "./ChoiceQuestions"
import { ModalBox } from "../../ModalBox"

export interface AddQuestionInputProps {
    questionsLength?: number
    disabled?: boolean
    setType?: (type: 'choiceImage' | 'choiceText' | 'text' | 'image') => void
    newQuestionProps?: QuestionProps
    onAddQuestion?: () => boolean
    onOpenQuestion?: () => void
}

export const AddQuestionInput = (props: AddQuestionInputProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Box display="flex" flexDirection="column" gap={1} p={2} width="100%">
            <Box display="flex" alignItems="center" gap={1}>
                <h3>Preguntas({props.questionsLength ?? 0})</h3>
                {props.disabled === true ? null : (
                    <IconButton size="small" style={{ backgroundColor: '#F44565', color: 'white' }}
                        onClick={() => {setOpen(true); props.onOpenQuestion?.()}}>
                        <AddIcon />
                    </IconButton>
                )}
            </Box>
            <ModalBox open={open} setOpen={setOpen}>
                <CreateQuestion setType={props.setType} newQuestionProps={props.newQuestionProps}
                    onAddQuestion={() => { if (props.onAddQuestion?.()) setOpen(false) }} />
            </ModalBox>
        </Box>
    )
}


interface CreateQuestionProps {
    setType?: (type: 'choiceImage' | 'choiceText' | 'text' | 'image') => void
    newQuestionProps?: QuestionProps
    onAddQuestion?: () => void
}

const CreateQuestion = (props: CreateQuestionProps) => {
    const [isImageChoice, setIsImageChoice] = useState(true)
    const [isTextChoice, setIsTextChoice] = useState(false)
    const [isOnlyText, setIsOnlyText] = useState(false)
    const [isOnlyImage, setIsOnlyImage] = useState(false)

    const selectType = (type: number, value: boolean) => {
        clearSelected()
        if (!value) { return }
        if (type === 1) { setIsImageChoice(true); props.setType?.("choiceImage") }
        if (type === 2) { setIsTextChoice(true); props.setType?.("choiceText") }
        if (type === 3) { setIsOnlyText(true); props.setType?.("text") }
        if (type === 4) { setIsOnlyImage(true); props.setType?.("image") }
    }

    const clearSelected = () => {
        setIsImageChoice(false)
        setIsTextChoice(false)
        setIsOnlyText(false)
        setIsOnlyImage(false)
    }

    return (
        <Box display={"flex"} flexDirection="column" gap={2} p={2} width={"90%"} height={'100%'}>
            <h2 style={{ fontSize: 20 }}>Tipo de pregunta</h2>
            <Box display="flex" flexDirection="row" gap={2}>
                <CheckInput labelText="Selección imagen" checked={isImageChoice}
                    onChecked={(value) => selectType(1, value)} />
                <CheckInput labelText="Selección texto" checked={isTextChoice}
                    onChecked={(value) => selectType(2, value)} />
                <CheckInput labelText="Campo de texto" checked={isOnlyText}
                    onChecked={(value) => selectType(3, value)} />
                <CheckInput labelText="Subir imágenes" checked={isOnlyImage}
                    onChecked={(value) => selectType(4, value)} />
            </Box>
            <Question {...props.newQuestionProps ?? {} as any}/>
            <Box display={"flex"} flexDirection="row" gap={2} width='100%' justifyContent="center" alignItems="center">
                <Button className={'login-button'} onClick={props.onAddQuestion}
                    style={{ width: '20%', marginLeft: '20px' }}
                >Agregar</Button>
            </Box>
        </Box>
    )
}