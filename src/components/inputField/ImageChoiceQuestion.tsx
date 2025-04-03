import { TextInputField } from "./TextInputField"
import { Box, IconButton } from "@mui/material"
import { Question, Choice } from "../../api/store_service_api"
import AddIcon from "@mui/icons-material/Add"
import { ImageUploader } from "./ImageUploader"
import { v4 as uuidv4 } from 'uuid'
import { useState } from "react"
import { Delete } from "@mui/icons-material"

interface ImageChoiceQuestionProps {
    imageChoiceQuestion?: Question;
    onChangeTitle?: (title: string) => void;
    onChangeChoices?: (choices: Choice[]) => void;
    disabled?: boolean;
}

interface ChoiceInput {
    id?: string
    option?: string;
    image?: string;
}

export const ImageChoiceQuestion: React.FC<ImageChoiceQuestionProps> = ({ imageChoiceQuestion, onChangeTitle, onChangeChoices, disabled}) => {
    
    const [extraChoices, setExtraChoices] = useState<ChoiceInput[]>(imageChoiceQuestion?.choices?.map((choice) => ({
        id: uuidv4(),
        option: choice.option,
        image: choice.image
    })) ?? [])
    
    const changeChoice = (index: number, choice: ChoiceInput) => {
        let choices = [...extraChoices]
        choices[index] = choice
        setExtraChoices(choices);
        onChangeChoices?.(choices.map((choice) => ({
            option: choice.option?.trim() ?? "",
            image: choice.image
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
            image: choice.image
        })));
    }

    return (
        <Box display="flex" flexDirection="column" p={2}>
            <TextInputField labelText="Pregunta" style={{ width: '50%' }} value={imageChoiceQuestion?.title}
            onValueChange={onChangeTitle} disabled={disabled}/>
            <Box display="flex" alignItems="center" gap={1}>
                <h3>Opciones</h3>
                <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                    onClick={() => {setExtraChoices(prev => [...prev, {id: uuidv4()}])}}
                    disabled={disabled}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Box display='flex' flexDirection='row' gap={2}>
                {extraChoices.map((choice, index) => (
                    <ImageChoiceQuestionOption key={choice.id}
                    choice={choice} onChangeChoice={(choice) => changeChoice(index, choice)}
                    onDeleteChoice={deleteChoice} disabled={disabled}/>
                ))}
            </Box>
        </Box>
    )
}

interface ImageChoiceQuestionOptionProps {
    choice: ChoiceInput;
    onChangeChoice?: (choice: ChoiceInput) => void;
    onDeleteChoice?: (choice: ChoiceInput) => void;
    disabled?: boolean;
}

const ImageChoiceQuestionOption: React.FC<ImageChoiceQuestionOptionProps> = ({ choice, onChangeChoice, 
    onDeleteChoice, disabled
 }) => {
    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                <TextInputField labelText="Opción" style={{ width: '50%' }} value={choice && choice.option}
                onValueChange={(value) => {onChangeChoice?.({id: choice?.id, option: value, image: choice?.image})}} disabled={disabled}/>
                <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                onClick={() => {onDeleteChoice?.(choice)}} disabled={disabled}>
                    <Delete/>
                </IconButton>
            </Box>
            <ImageUploader image={choice && choice.image} onImageChange={(image) => {
                onChangeChoice?.({id: choice?.id, option: choice?.option, image: image??""})
            }} disabled={disabled}/>
        </Box>
    )
}