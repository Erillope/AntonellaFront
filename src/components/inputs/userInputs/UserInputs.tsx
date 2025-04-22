import { Box, Typography } from "@mui/material";
import { InputTextField2, InputTextFieldProps } from "../InputTextField";
import { SelectInput, SelectInputProps } from "../SelectInput";
import { DateInput, DateInputProps } from "../DateInput";
import { DynamicMultipleSelect, DynamicMultipleSelectProps } from "../DynamicMultipleSelect";
import { ImageInput, ImageInputProps } from "../ImageInput";
import { MultipleSelect, MultipleSelectProps } from "../MultipleSelect";
import { SwitchInput, SwitchInputProps } from "../SwitchInput";

export interface UserInputsProps {
    phoneProps?: InputTextFieldProps;
    emailProps?: InputTextFieldProps;
    nameProps?: InputTextFieldProps;
    genderProps?: SelectInputProps;
    birthdateProps?: DateInputProps;
    addressProps?: InputTextFieldProps;
    dniProps?: InputTextFieldProps;
    rolesProps?: DynamicMultipleSelectProps;
    movilProps?: MultipleSelectProps;
    photoProps?: ImageInputProps;
    statusProps?: SwitchInputProps;
    creationDate?: string;
    userType?: 'cliente' | 'empleado'
    disabled?: boolean;
    showExtraInfo?: boolean;
    showCategories?: boolean;
    isSuperAdmin?: boolean;
}

export function UserInputs(props: UserInputsProps) {
    return (
        <Box display="flex" flexDirection="column" gap={3} width="100%">
            <Box display="flex" flexDirection="row" gap={10} width="100%">
                <InputTextField2 labelText="Celular" {...props.phoneProps} disabled={props.disabled} />
                <InputTextField2 labelText="Email" {...props.emailProps} disabled={props.disabled} />
            </Box>
            <Box display="flex" flexDirection="row" gap={10} width="100%">
                <InputTextField2 labelText="Nombre" {...props.nameProps} disabled={props.disabled} />
                <SelectInput labelText="Género" {...props.genderProps} disabled={props.disabled} />
            </Box>
            <Box display="flex" flexDirection="row" gap={10} width="100%">
                <DateInput labelText="Fecha de nacimiento" {...props.birthdateProps}
                    disabled={props.disabled} />
                {props.userType === 'empleado' ?
                    <InputTextField2 labelText="Dirección" {...props.addressProps}
                        disabled={props.disabled} /> : <Box width='100%' />}
            </Box>
            {props.userType === 'empleado' &&
                <Box display='flex' flexDirection='row' gap={10} width="100%">
                    <Box display='flex' flexDirection='column' gap={3} width="100%">
                        <InputTextField2 labelText="Cedula" {...props.dniProps} disabled={props.disabled} />
                        <DynamicMultipleSelect labelText="Roles" {...props.rolesProps}
                            disabled={props.isSuperAdmin || props.disabled}/>
                        {props.showCategories &&
                            <MultipleSelect labelText="Aplicativo Móvil" {...props.movilProps}
                                disabled={props.disabled} centerLabel={true}/>}
                    </Box>
                    <ImageInput labelText="Foto de perfil" {...props.photoProps} disabled={props.disabled} />
                </Box>
            }
            {props.showExtraInfo &&
                <Box display="flex" flexDirection="column" gap={3} width="50%" alignItems="flex-start">
                    <SwitchInput labelText="Estado" activeText="Activo" inactiveText="Inactivo" width="25%"
                        {...props.statusProps} disabled={props.isSuperAdmin || props.disabled}/>
                    <Typography sx={{ color: '#B0B0B0', fontSize: 14 }}>
                        Fecha de creación: {props.creationDate}
                    </Typography>
                </Box>
            }
        </Box>
    )
}