import { Badge, Box, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { InputTextField2, InputTextFieldProps } from "../InputTextField";
import { Delete } from "@mui/icons-material"
import { ImageInput, ImageInputProps } from "../ImageInput";

export interface QuestionProps {
    type: 'choiceImage' | 'choiceText' | 'text' | 'image';
    titleProps?: InputTextFieldProps;
    choicesProps?: ChoiceQuestionProps[];
    onAddChoice?: () => void;
    disabled?: boolean;
}

export const Question = (props: QuestionProps) => {
    return (
        <Box display="flex" flexDirection="column" p={2} gap={2} width='100%'
            height={props.type === 'choiceImage' ? '80%' : '50%'}>
            <InputTextField2 labelText="Pregunta" width="50%" {...props.titleProps} disabled={props.disabled} />
            {(props.type === 'choiceImage' || props.type === 'choiceText') &&
                <>
                    <Box display="flex" alignItems="center" gap={1}>
                        <h3>Opciones</h3>
                        {props.disabled === true ? null :
                            <IconButton size="small" style={{ backgroundColor: '#F44565', color: 'white' }}
                                onClick={props.onAddChoice} disabled={props.disabled}>
                                <AddIcon />
                            </IconButton>
                        }
                    </Box>
                    <Box display='flex' flexDirection='row' width='100%' sx={{ overflowX: 'auto', paddingTop: 1, paddingBottom: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                        {props.choicesProps?.map((choiceProps, index) => (
                            <ChoiceQuestionOption key={index} {...choiceProps} hideDelete={props.choicesProps?.length != 1} disabled={props.disabled} />
                        ))}
                    </Box>
                </>
            }
        </Box>
    )
}

export interface ChoiceQuestionProps {
    type: 'image' | 'text';
    optionProps?: InputTextFieldProps;
    imageProps?: ImageInputProps;
    onDeleteChoice?: () => void;
    disabled?: boolean;
    hideDelete?: boolean;
}

const ChoiceQuestionOption = (props: ChoiceQuestionProps) => {
    const deleteButton = () => {
        if (props.hideDelete === true) {
            return (
                <IconButton className="delete-image-button2"
                    onClick={props.onDeleteChoice}
                    disabled={props.disabled}>
                    {props.disabled ? null : <Delete fontSize="small" />}
                </IconButton>
            )
        }
    }

    return (
        <Box display="flex" flexDirection="column" gap={1} alignItems="center" width='20%' flexShrink={0}>
            <Badge
                overlap="circular"
                sx={{ width: '70%' }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                badgeContent={deleteButton()}
            >
                <InputTextField2 labelText="Opción" {...props.optionProps} disabled={props.disabled} />
            </Badge>
            {props.type === 'image' &&
                <ImageInput {...props.imageProps} disabled={props.disabled} height="150px" width="150px" />
            }
        </Box>
    )
}
