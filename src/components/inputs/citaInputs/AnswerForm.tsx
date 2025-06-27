import { Avatar, Box, Button, FormHelperText, Typography } from "@mui/material"
import { InputTextField2 } from "../InputTextField"
import { ListImageInput } from "../ListImageInput";
import { InputBox } from "../InputBox";

export interface AnswerProps {
    type: 'choiceImage' | 'choiceText' | 'text' | 'image';
    textAnswer?: TextAnswerProps;
    imageAnswer?: ImageAnswerProps;
    textChoiceAnswer?: TextChoiceAnswerProps;
    imageChoiceAnswer?: ImageChoiceAnswerProps;
}

export interface TextAnswerProps {
    question: string;
    questionId?: string;
    answer?: string;
    setAnswer?: (answer: string) => void;
    disabled?: boolean;
}

export interface ImageAnswerProps {
    question: string;
    questionId?: string;
    images?: string[];
    setImages?: (images: string[]) => void;
    disabled?: boolean;
}

export interface TextChoiceAnswerProps {
    question: string;
    questionId?: string;
    selected?: string;
    options: string[];
    setSelected?: (selected: string) => void;
    disabled?: boolean;
}

export interface ImageChoiceAnswerProps {
    question: string;
    questionId?: string;
    selected?: string;
    options: {
        image: string;
        value: string;
    }[];
    setSelected?: (selected: string) => void;
    disabled?: boolean;
}

export interface AnswerFormProps {
    questions: AnswerProps[];
    width?: string;
    error?: string;
    disabled?: boolean;
}

export const AnswerForm = (props: AnswerFormProps) => {
    const generateTextAnswer = (_props: TextAnswerProps, key: number) => {
        return (
            <InputTextField2
                key={key}
                rows={4}
                labelText={_props.question}
                value={_props.answer}
                onValueChange={_props.setAnswer}
                disabled={props.disabled}
            />
        );
    }

    const generateImageAnswer = (_props: ImageAnswerProps, key: number) => {
        return (
            <ListImageInput
                width="100%"
                key={key}
                labelText={_props.question}
                images={_props.images}
                onChange={_props.setImages}
                disabled={props.disabled}
            />
        );
    }

    const generateTextChoiceAnswer = (_props: TextChoiceAnswerProps, key: number) => {
        return (
            <ChoiceTextAnswer
                key={key}
                {..._props}
                disabled={props.disabled}
            />
        )
    }

    const generateImageChoiceAnswer = (_props: ImageChoiceAnswerProps, key: number) => {
        return (
            <ChoiceImageAnswer
                key={key}
                {..._props}
                disabled={props.disabled}
            />
        )
    }

    const generateAnswer = (props: AnswerProps, key: number) => {
        switch (props.type) {
            case 'text':
                return generateTextAnswer(props.textAnswer!, key);
            case 'image':
                return generateImageAnswer(props.imageAnswer!, key);
            case 'choiceText':
                return generateTextChoiceAnswer(props.textChoiceAnswer!, key);
            case 'choiceImage':
                return generateImageChoiceAnswer(props.imageChoiceAnswer!, key);
            default:
                return null;
        }
    }

    return <Box width={props.width}>
        <Box display={'flex'} flexDirection='column' gap={2} bgcolor={'#DFDFDF'} width={'100%'} padding={3} borderRadius={5} height={'100vh'} sx={{ overflowY: 'auto' }} alignItems={'center'}>
            {props.questions && props.questions.length > 0 ? props.questions.map(generateAnswer) :
                <Typography variant="body2" >Ningún servicio seleccionado</Typography>}
        </Box>
        {!!props.error && props.error.length > 0 &&
            <FormHelperText className="helperText">{props.error}</FormHelperText>
        }
    </Box>
}


const ChoiceTextAnswer = (props: TextChoiceAnswerProps) => {

    const selectedClass = (option: string) => {
        return props.selected && props.selected.toLowerCase() === option.toLowerCase() ? 'choice-selected-answer' : 'choice-answer';
    }

    return <InputBox labelText={props.question}>
        <Box display='flex' flexDirection='row' gap={5}>
            {props.options.map((option, index) =>
                <Box borderRadius={3} key={index}>
                    <Button className={selectedClass(option)}
                        onClick={() => props.setSelected?.(option)} disabled={props.disabled}>{option}</Button>
                </Box>
            )}
        </Box>
    </InputBox>
}

const ChoiceImageAnswer = (props: ImageChoiceAnswerProps) => {
    const selectedClass = (option: string) => {
        return props.selected && props.selected.toLowerCase() === option.toLowerCase() ? 'choice-selected-answer' : 'choice-answer';
    }

    return <InputBox labelText={props.question}>
        <Box display='flex' flexDirection='row' gap={5}>
            {props.options.map((option, index) =>
                <Box borderRadius={3} key={index}>
                    <Button className={selectedClass(option.value)} onClick={() => props.setSelected?.(option.value)} disabled={props.disabled}>
                        <Avatar src={option.image} alt={option.value} style={{ width: '100px', height: '100px' }} variant="square" />
                        <Typography variant="body2">{option.value}</Typography>
                    </Button>
                </Box>
            )}
        </Box>
    </InputBox>
}