import { Box, Button } from "@mui/material";
import { Choice, Question } from "../api/store_service_api"
import React from "react";
import { ImageChoiceQuestion } from "./inputField/ImageChoiceQuestion";
import { TextChoiceQuestion } from "./inputField/TextChoiceQuestion";
import { TextInputField } from "./inputField/TextInputField";

interface QuestionInfoProps {
    question?: Question;
    onChangeQuestion?: (question: Question) => void;
    onDeleteQuestion?: (questionId: string) => void;
    disabled?: boolean;
}

export const QuestionInfo: React.FC<QuestionInfoProps> = ({ question, onChangeQuestion, onDeleteQuestion, disabled: disable }) => {
    const [disabled, setDisabled] = React.useState(false)
    const [questionData, setQuestionData] = React.useState<Question | undefined>(question)
    const [title, setTitle] = React.useState<string>(question?.title ?? '')

    const isImageChoice = (): boolean => {
        return !!questionData && questionData.inputType === "CHOICE" && questionData.choiceType === "IMAGE"
    }

    const isTextChoice = (): boolean => {
        return !!questionData && questionData.inputType === "CHOICE" && questionData.choiceType === "TEXT"
    }

    const isOnlyText = (): boolean => {
        return !!questionData && questionData.inputType === "TEXT"
    }

    const isOnlyImage = (): boolean => {
        return !!questionData && questionData.inputType === "IMAGE"
    }

    const changeTittle = (value: string) => {
        if (!questionData) return
        validate(value, questionData.choices ?? [])
        const questionData_ = { ...questionData }
        questionData_.title = value
        setTitle(value)
        setQuestionData(questionData_)
    }

    const changeChoices = (choices: Choice[]) => {
        if (!questionData) return
        validate(questionData?.title ?? '', choices)
        const questionData_ = { ...questionData }
        questionData_.choices = choices
        setQuestionData(questionData_)
    }

    const validate = (title: string, choices: Choice[]) => {
        const notHaveTittle = title.trim() === ""
        let notHaveImage = choices.length == 0 && (isImageChoice() || isTextChoice())
        let notHaveChoice = choices.length == 0 && (isImageChoice() || isTextChoice());
        choices.forEach((choice) => {
            if (choice.option?.trim() === "" && (isImageChoice() || isTextChoice())) {
                notHaveChoice = true
            }
            if (!!!choice.image && isImageChoice()) {
                notHaveImage = true
            }
        })
        setDisabled(notHaveTittle || notHaveImage || notHaveChoice)
    }

    return (
        <Box display={"flex"} flexDirection="column" gap={1} p={2}>
            {isImageChoice() && (
                <ImageChoiceQuestion imageChoiceQuestion={questionData} onChangeTitle={changeTittle}
                    onChangeChoices={changeChoices} disabled={disable} />
            )}
            {isTextChoice() && (
                <TextChoiceQuestion textChoiceQuestion={questionData} onChangeTitle={changeTittle}
                    onChangeChoices={changeChoices} disabled={disable}/>
            )}
            {(isOnlyText() || isOnlyImage()) && (
                <TextInputField labelText="Pregunta" style={{ width: '50%' }}
                    onValueChange={changeTittle} value={title} disabled={disable}/>
            )}
            {!disable && (
                <Box display={"flex"} flexDirection="row" gap={1} p={2}>
                    <Button className={disabled ? 'disabled-button' : 'submit-button'}
                        style={{ width: '15%', marginLeft: '20px' }}
                        onClick={() => questionData && onChangeQuestion?.(questionData)}
                        disabled={disabled}>Guardar Cambios</Button>
                    <Button className='delete' style={{ width: '15%', marginLeft: '20px' }}
                        onClick={() => { onDeleteQuestion?.(question?.id ?? '') }}>Eliminar</Button>
                </Box>
            )}


        </Box>
    )
}