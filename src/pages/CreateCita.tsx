import { CreateCitaModal } from "../components/inputs/citaInputs/CreateCitaModal";
import { useCita } from "../hooks/useCita";
import { ItemsTable } from "../components/tables/ItemsTable";
import { ActionForm } from "../components/forms/ActionForm";
import { Box } from "@mui/material";
import { useState } from "react";
import { confirmDeleteItemMessage, successItemAddedMessage } from "../utils/alerts";
import { DynamicAutocomplete } from "../components/inputs/DynamicMultipleSelect";
import { SelectInput } from "../components/inputs/SelectInput";

export const CreateCita = () => {
    const [open, setOpen] = useState(false)
    const citaController = useCita()
    const createCitaProps = citaController.getCreateCitaProps();
    
    return (
        <ActionForm width={'90%'} handleSubmit={citaController.createOrder}>
            <Box display='flex' flexDirection='column' gap={2} height={'100%'} padding={5}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <DynamicAutocomplete labelText="Cliente"{...citaController.clientEmailProps} />
                    <SelectInput labelText="Método de pago" {...citaController.paymentTypeProps}/>
                </Box>
                <CreateCitaModal
                    citaProps={{
                        ...createCitaProps,
                        onDelete: () => {
                            setOpen(false);
                            confirmDeleteItemMessage(createCitaProps.onDelete?? (() => {}))
                        },
                        onCreateSubmit: (): boolean => {
                            if (!createCitaProps.onCreateSubmit?.()) return false;
                            setOpen(false);
                            successItemAddedMessage();
                            return true;
                        },
                        onEditSubmit: () => {
                            setOpen(false);
                            createCitaProps.onEditSubmit?.();
                        }
                    }}
                    init={citaController.initNewServiceItem}
                    open={open}
                    setOpen={setOpen}
                    totalServicios={citaController.serviceItems.length}
                />
                <Box>
                    <ItemsTable items={citaController.getItems()} onSelectItem={(id) => {
                        citaController.initServiceItem(id);
                        setOpen(true);
                    }}/>
                </Box>
            </Box>
        </ActionForm>
    );
}