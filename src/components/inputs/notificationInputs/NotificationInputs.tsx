import { Box } from "@mui/material"
import { InputTextField2, InputTextFieldProps } from "../InputTextField"
import { SelectInput, SelectInputProps } from "../SelectInput"
import { NotificationDate, NotificationDateProps } from "./NotificationDate"

export interface NotificationInputsProps {
    titleProps?: InputTextFieldProps;
    typeProps?: SelectInputProps;
    bodyProps?: InputTextFieldProps;
    dateProps?: NotificationDateProps
}
export const NotificationInputs = (props: NotificationInputsProps) => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" gap={2}>
            <Box display="flex" flexDirection="row" alignItems="center" width="100%" gap={2}>
                <InputTextField2 labelText="Título" {...props.titleProps}/>
                <SelectInput labelText="Tipo" {...props.typeProps}/>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" width="100%" gap={2}>
                <InputTextField2 labelText="Cuerpo" rows={4} {...props.bodyProps}/>
                <NotificationDate {...props.dateProps}/>
            </Box>
        </Box>
    )
}