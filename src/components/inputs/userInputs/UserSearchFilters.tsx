import { Box } from "@mui/material";
import { InputTextField2, InputTextFieldProps } from "../InputTextField";
import { SelectInput, SelectInputProps } from "../SelectInput";

export interface UserSearchFiltersProps {
    nameProps?: InputTextFieldProps;
    emailProps?: InputTextFieldProps;
    phoneProps?: InputTextFieldProps;
    dniProps?: InputTextFieldProps;
    rolesProps?: SelectInputProps;
}

export function UserSearchFilters(props: UserSearchFiltersProps) {
    return (
        <Box display='flex' flexDirection='row' gap={5} width='100%'>
            <Box display='flex' flexDirection='column' gap={2} width='100%'>
                <Box display='flex' flexDirection='row' gap={5} width='100%'>
                    <InputTextField2 labelText="Nombre" {...props.nameProps}/>
                    <InputTextField2 labelText="Email" {...props.emailProps}/>
                </Box>
                <Box display='flex' flexDirection='row' gap={5} width='100%'>
                    <InputTextField2 labelText="Celular" {...props.phoneProps}/>
                    <InputTextField2 labelText="Cedula" {...props.dniProps}/>
                </Box>
            </Box>
            <Box display='flex' flexDirection='column' gap={2} width='50%'>
                <SelectInput labelText="Filtrar por roles" {...props.rolesProps}/>
            </Box>
        </Box>
    )
}