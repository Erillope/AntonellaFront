import { Box, Typography } from "@mui/material"
import { SelectInput, SelectInputProps } from "../SelectInput"
import { DurationInput, DurationInputProps } from "../DurationInput"
import { ListImageInput, ListImageInputProps } from "../ListImageInput"
import { InputTextField2, InputTextFieldProps } from "../InputTextField"
import { PriceRange, PriceRangeProps } from "../PriceRange"
import { User } from "../../../api/user_api"
import { EmployeeCard } from "../userInputs/EmployeeCards"
import { SwitchInput, SwitchInputProps } from "../SwitchInput"
import { toDateString } from "../../../api/utils"

export interface ServiceInputsProps {
    disabled?: boolean;
    categoryProps?: SelectInputProps;
    subCategoryProps?: SelectInputProps;
    nameProps?: InputTextFieldProps;
    durationProps?: DurationInputProps;
    descriptionProps?: InputTextFieldProps;
    priceRangeProps?: PriceRangeProps;
    imageProps?: ListImageInputProps;
    users?: User[];
    statusProps?: SwitchInputProps;
    showExtraInfo?: boolean;
    creationDate?: Date;
}

export const ServiceInputs = (props: ServiceInputsProps) => {
    const profesionalesMessage = () => {
        if (haveSelectedCategory()) {
            return `Profesionales de ${props.categoryProps?.value}`
        }
        return 'Profesionales'
    }

    const haveSelectedCategory = () => {
        return !!props.categoryProps?.value && props.categoryProps.value !== ''
    }

    return (
        <Box>
            <Box display="flex" flexDirection="row" gap={5} p={2}>
                <SelectInput labelText="Categoría" {...props.categoryProps} disabled={props.disabled} />
                <SelectInput labelText="SubCategoría" {...props.subCategoryProps} disabled={props.disabled} />
                <InputTextField2 labelText="Nombre" {...props.nameProps} disabled={props.disabled} />
                <DurationInput labelText="Duración Approximada" {...props.durationProps} disabled={props.disabled} />
            </Box>
            <ListImageInput labelText="Imágenes" {...props.imageProps} disabled={props.disabled} />
            <Box display="flex" flexDirection="row" gap={5} p={2}>
                <Box display="flex" flexDirection="column" gap={2} width={'50%'}>
                    <InputTextField2 labelText="Descripción" rows={4} {...props.descriptionProps} disabled={props.disabled} />
                    <PriceRange {...props.priceRangeProps} disabled={props.disabled} />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent='center' width={'50%'}>
                    <Typography color="black" fontWeight='bold' fontSize={15}>{profesionalesMessage()}</Typography>
                    {props.users?.map((user, index) => (
                        <EmployeeCard key={index} user={user} />
                    ))}
                    {props.users?.length === 0 && (
                        <Box width={'100%'} height={'100%'} display='flex' justifyContent='center' alignItems='center' borderRadius={2}>
                            <Typography color="black" fontSize={15}>{haveSelectedCategory() ? 'No hay profesionales disponibles' : 'Elija una categoría'}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            {props.showExtraInfo &&
                <Box display="flex" flexDirection="column" gap={3} width="50%" alignItems="flex-start">
                    <SwitchInput labelText="Estado" activeText="Activo" inactiveText="Inactivo" width="25%"
                        {...props.statusProps} disabled={props.disabled} />
                    <Typography sx={{ color: '#B0B0B0', fontSize: 14 }}>
                        Fecha de creación: {props.creationDate && toDateString(props.creationDate)}
                    </Typography>
                </Box>
            }
        </Box>
    )
}