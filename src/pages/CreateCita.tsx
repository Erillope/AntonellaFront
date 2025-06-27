import { CreateCitaModal } from "../components/inputs/citaInputs/CreateCitaModal";
import { ItemsTable } from "../components/tables/ItemsTable";
import { ActionForm } from "../components/forms/ActionForm";
import { Box } from "@mui/material";
import { useState } from "react";
import { confirmDeleteItemMessage, successItemAddedMessage } from "../utils/alerts";
import { DynamicAutocomplete } from "../components/inputs/DynamicMultipleSelect";
import { SelectInput } from "../components/inputs/SelectInput";
import { SwitchInput } from "../components/inputs/SwitchInput";
import { useCita } from "../hooks/useCita";

export const CreateCita = () => {
    const [open, setOpen] = useState(false)
    const citaController = useCita()
    const createCitaProps = citaController.getCitaProps();

    return (
        <ActionForm width={'90%'} handleSubmit={citaController.createOrder}>
            <Box display='flex' flexDirection='column' gap={2} height={'100%'} padding={5}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={3}>
                    <DynamicAutocomplete labelText="Cliente" {...citaController.clientProps}/>
                    <SelectInput labelText="Método de pago" {...citaController.paymentTypeProps} />
                </Box>
                <CreateCitaModal
                    citaProps={{
                        ...createCitaProps,
                    }}
                    answerFormProps={{ questions: citaController.generateAnswersProps(), error: citaController.answerError}}
                    onCreateSubmit={() => {
                        if (citaController.addServiceItem()) {
                            setOpen(false);
                            successItemAddedMessage();
                        }
                        return false;
                    }}
                    onEditSubmit={() => {
                        if (citaController.editServiceItem()) {
                            setOpen(false);
                        }
                        return false;
                    }}
                    onDelete={() => {
                        setOpen(false);
                        confirmDeleteItemMessage(() => {
                            citaController.onDeleteServiceItem()
                        })
                    }}
                    init={citaController.initServiceItem}
                    open={open}
                    setOpen={setOpen}
                    totalServicios={citaController.serviceItems.length}
                    mode={citaController.mode}
                    onDiscard={citaController.discartChanges}
                />
                <Box>
                    <ItemsTable items={citaController.getItems()} onSelectItem={(id) => {
                        citaController.loadServiceItem(id);
                        setOpen(true);
                    }} />
                </Box>
                <Box display={'flex'} flexDirection={'row'}  gap={3}>
                    <SwitchInput labelText="Estado orden" activeText="Confirmado" inactiveText="No Confirmado" {...citaController.orderStatusProps}/>
                    <SwitchInput labelText="Estado pago" activeText="Pagado" inactiveText="Pendiente"
                    {...citaController.orderPaymentStatusProps} 
                    />
                    <SwitchInput labelText="Confirmacion cliente" activeText="Confirmado" inactiveText="No Confirmado" {...citaController.clientConfirmedProps} />
                </Box>
            </Box>
        </ActionForm>
    );
}