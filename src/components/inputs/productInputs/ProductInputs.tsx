import { Box, Typography } from "@mui/material"
import { InputTextField2, InputTextFieldProps, NumberInputField } from "../InputTextField"
import { SelectInput, SelectInputProps } from "../SelectInput"
import { ListImageInput } from "../ListImageInput";
import { SwitchInput, SwitchInputProps } from "../SwitchInput";

export interface ProductInputsProps {
    categoryProps?: SelectInputProps;
    subCategoryProps?: SelectInputProps;
    nameProps?: InputTextFieldProps;
    descriptionProps?: InputTextFieldProps;
    productTypeProps?: SelectInputProps;
    priceProps?: InputTextFieldProps;
    stockProps?: InputTextFieldProps;
    volumeProps?: InputTextFieldProps;
    stockAdditionalProps?: InputTextFieldProps;
    imageListProps?: InputTextFieldProps;
    statusProps?: SwitchInputProps;
    disabled?: boolean;
    showExtraInfo?: boolean;
    creationDate?: string;
    stockModifiedDate?: string;
}

export const ProductInputs = (props: ProductInputsProps) => {
    const showExtraInfo = props.showExtraInfo ?? false;

    return (
        <Box display="flex" flexDirection="column" alignItems={'center'} width='100%' gap={2}>
            <Box display="flex" flexDirection="row" gap={5} width='100%'>
                <Box display="flex" flexDirection="column" flex={5} gap={2}>
                    <Box display="flex" flexDirection="row" gap={5}>
                        <SelectInput labelText="Categoría" disabled={props.disabled}
                            {...props.categoryProps} />
                        <SelectInput labelText="Subcategoría" disabled={props.disabled}
                            {...props.subCategoryProps} />
                    </Box>
                    <InputTextField2 labelText="Nombre" disabled={props.disabled} {...props.nameProps} />
                    <InputTextField2 labelText="Descripción" rows={4} disabled={props.disabled}
                        {...props.descriptionProps} />
                </Box>
                <Box display="flex" flexDirection="column" gap={2} flex={5}>
                    <SelectInput labelText="Tipo de producto" {...props.productTypeProps}
                        disabled={props.disabled} />
                    <Box display="flex" flexDirection="row" gap={5} justifyContent={'space-between'}>
                        <NumberInputField labelText="Precio" {...props.priceProps} disabled={props.disabled} />
                        <NumberInputField labelText="Stock" {...props.stockProps}
                            disabled={showExtraInfo} />
                    </Box>
                    <Box display="flex" flexDirection="row" gap={5} justifyContent={'space-between'}>
                        <NumberInputField labelText="Volumen (mL)" {...props.volumeProps} disabled={props.disabled} />
                        {(showExtraInfo && !props.disabled) ?
                            <NumberInputField labelText="Stock Adicional" {...props.stockAdditionalProps} />
                            : <Box width='100%' />
                        }
                    </Box>
                    {showExtraInfo &&
                        <Typography sx={{ color: '#B0B0B0', fontSize: 14 }}>
                            Última modificación de stock: {props.stockModifiedDate}
                        </Typography>
                    }
                </Box>
            </Box>
            <ListImageInput labelText="Imágenes" disabled={props.disabled} width='100%' {...props.imageListProps} />
            {props.showExtraInfo &&
                <Box display="flex" flexDirection="column" gap={3} width="100%" alignItems="flex-start">
                    <SwitchInput labelText="Estado" activeText="Activo" inactiveText="Inactivo" width="25%"
                        {...props.statusProps} disabled={props.disabled} />
                    <Typography sx={{ color: '#B0B0B0', fontSize: 14 }}>
                        Fecha de creación: {props.creationDate}
                    </Typography>
                </Box>
            }
        </Box>
    )
}