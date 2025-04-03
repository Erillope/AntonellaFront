import { Box, Button } from "@mui/material"
import React, { useState } from "react"
import { CheckboxInput } from "./inputField/CheckBoxInput"
import { ImageChoiceQuestion } from "./inputField/ImageChoiceQuestion"
import { TextChoiceQuestion } from "./inputField/TextChoiceQuestion"
import { TextInputField } from "./inputField/TextInputField"
import "../styles/form.css"
import { CreateQuestion as CreateQuestionData, Choice } from "../api/store_service_api"

interface CreateQuestionProps {
    onCreateQuestion?: (question: CreateQuestionData) => void;
}

export const CreateQuestion: React.FC<CreateQuestionProps> = ({ onCreateQuestion }) => {
    const [isImageChoice, setIsImageChoice] = useState(true)
    const [isTextChoice, setIsTextChoice] = useState(false)
    const [isOnlyText, setIsOnlyText] = useState(false)
    const [isOnlyImage, setIsOnlyImage] = useState(false)
    const [title, setTitle] = useState<string>("")
    const [choices, setChoices] = useState<Choice[]>([])
    const [disabled, setDisabled] = useState(true)

    const addQuestion = () => {
        const question: CreateQuestionData = {
            title: title.trim(),
            inputType: isOnlyText ? "TEXT" : isOnlyImage ? "IMAGE" : (isImageChoice || isTextChoice) ? "CHOICE" : "",
            choiceType: isImageChoice ? "IMAGE" : isTextChoice ? "TEXT" : undefined,
            choices: isImageChoice ? choices.filter(choice => choice.option !== "" && choice.image) :
                isTextChoice ? choices.filter(choice => choice.option !== "") : undefined,
        }
        onCreateQuestion?.(question)
        setTitle("")
        setChoices([])
    }

    const changeTittle = (value: string) => {
        validate(value, choices)
        setTitle(value)
    }

    const changeChoices = (choices: Choice[]) => {
        validate(title, choices)
        setChoices(choices)
    }

    const validate = (title: string, choices: Choice[]) => {
        const notHaveTittle = title.trim() === ""
        let notHaveImage = choices.length === 0 && (isImageChoice || isTextChoice)
        let notHaveChoice = choices.length === 0 && (isImageChoice || isTextChoice)
        choices.forEach((choice) => {
            if (choice.option?.trim() === "" && (isImageChoice || isTextChoice)) {
                notHaveChoice = true
            }
            if (!!!choice.image && isImageChoice) {
                notHaveImage = true
            }
        })
        setDisabled(notHaveTittle || notHaveImage || notHaveChoice)
    }

    const selectType = (type: number, value: boolean) => {
        clearSelected()
        if (!value) { return }
        if (type === 1) { setIsImageChoice(true) }
        if (type === 2) { setIsTextChoice(true) }
        if (type === 3) { setIsOnlyText(true) }
        if (type === 4) { setIsOnlyImage(true) }
        setTitle("")
        setDisabled(true)
    }

    const clearSelected = () => {
        setIsImageChoice(false)
        setIsTextChoice(false)
        setIsOnlyText(false)
        setIsOnlyImage(false)
    }

    return (
        <Box display={"flex"} flexDirection="column" gap={1} p={2}>
            <h2 style={{ fontSize: 20 }}>Tipo de pregunta</h2>
            <Box display="flex" flexDirection="row" gap={2}>
                <CheckboxInput label="Selección imagen" checked={isImageChoice}
                    onChecked={(value) => selectType(1, value)} />
                <CheckboxInput label="Selección texto" checked={isTextChoice}
                    onChecked={(value) => selectType(2, value)} />
                <CheckboxInput label="Campo de texto" checked={isOnlyText}
                    onChecked={(value) => selectType(3, value)} />
                <CheckboxInput label="Subir imágenes" checked={isOnlyImage}
                    onChecked={(value) => selectType(4, value)} />
            </Box>
            {isImageChoice && <ImageChoiceQuestion onChangeTitle={changeTittle}
            onChangeChoices={changeChoices} />}
            {isTextChoice && <TextChoiceQuestion onChangeTitle={changeTittle}
            onChangeChoices={changeChoices} />}
            {(isOnlyText || isOnlyImage) && (
                <Box display="flex" flexDirection="column" p={2}>
                    <TextInputField labelText="Pregunta" style={{ width: '50%' }}
                    onValueChange={changeTittle} value={title}/>
                </Box>
            )}
            <Button className={disabled? 'disabled-button': 'submit-button'}
            style={{ width: '10%', marginLeft: '20px' }}
            onClick={addQuestion} disabled={disabled}>Agregar</Button>
        </Box>
    )
}