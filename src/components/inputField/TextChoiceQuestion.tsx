import { Box, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { TextInputField } from "./TextInputField"
import { v4 as uuidv4 } from 'uuid'
import React, { useState } from "react"
import { Choice, Question } from "../../api/store_service_api"
import { Delete } from "@mui/icons-material"

interface TextChoiceQuestionProps {
    textChoiceQuestion?: Question;
    onChangeTitle?: (title: string) => void;
    onChangeChoices?: (choices: Choice[]) => void;  
    disabled?: boolean;
}

interface ChoiceInput {
    id?: string
    option?: string;
}

export const TextChoiceQuestion: React.FC<TextChoiceQuestionProps> = ({textChoiceQuestion, onChangeChoices, onChangeTitle, disabled}) => {
    const [extraChoices, setExtraChoices] = useState<ChoiceInput[]>(textChoiceQuestion?.choices?.map((choice) => ({
        id: uuidv4(),
        option: choice.option
    })) ?? [])
    
    const changeChoice = (index: number, choice: ChoiceInput) => {
        const choices = [...extraChoices]
        choices[index] = choice
        setExtraChoices(choices);
        onChangeChoices?.(choices.map((choice) => ({
            option: choice.option?.trim() ?? ""
        })));
    }

    const deleteChoice = (choice: ChoiceInput) => {
        let choices = [...extraChoices]
        if (!!choice.id){
            choices = choices.filter((prevChoice) => prevChoice.id !== choice.id)
            setExtraChoices(choices);
        }
        onChangeChoices?.(choices.map((choice) => ({
            option: choice.option?.trim() ?? "",
        })));
    }

    return (
        <Box display="flex" flexDirection="column" p={2}>
            <TextInputField labelText="Pregunta" style={{ width: '50%' }} onValueChange={onChangeTitle}
            value={textChoiceQuestion?.title} disabled={disabled}/>
            <Box display="flex" alignItems="center" gap={1}>
                <h3>Opciones</h3>
                <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                    onClick={() => setExtraChoices(prev => [...prev, {id: uuidv4()}])}
                    disabled={disabled}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Box display='flex' flexDirection='row' gap={2}>
                {extraChoices.map((choice, index) => (
                    <TextChoiceQuestionOption key={choice.id}
                        choice={choice} onChangeChoice={(choice) => changeChoice(index, choice)}
                        onDeleteChoice={deleteChoice} />
                ))}
            </Box>
        </Box>
    )
}

interface TextChoiceQuestionOptionProps {
    choice?: ChoiceInput;
    onChangeChoice?: (choice: ChoiceInput) => void;
    onDeleteChoice?: (choice: ChoiceInput) => void;
    disabled?: boolean;
}

const TextChoiceQuestionOption: React.FC<TextChoiceQuestionOptionProps> = ({choice, onChangeChoice, onDeleteChoice, disabled}) => {
    return (
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <TextInputField labelText="Opción" style={{ width: '50%' }} value={choice?.option}
             onValueChange={(value) => {onChangeChoice?.({id: choice?.id, option: value})}}
             disabled={disabled}/>
            <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                onClick={() => {onDeleteChoice?.(choice??{})}} disabled={disabled}>
                <Delete />
            </IconButton>
        </Box>
    )
}