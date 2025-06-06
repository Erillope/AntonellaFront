import { CreateCitaModal } from "../components/inputs/citaInputs/CreateCitaModal";
import { useCita } from "../hooks/useCita";
import { ItemsTable } from "../components/tables/ItemsTable";
import { ActionForm } from "../components/forms/ActionForm";
import { Box } from "@mui/material";
import { useState } from "react";
import { confirmDeleteItemMessage, successItemAddedMessage } from "../utils/alerts";

export const CreateCita = () => {
    const [open, setOpen] = useState(false)
    const citaController = useCita()
    const createCitaProps = citaController.getCreateCitaProps();
    return (
        <ActionForm width={'90%'}>
            <Box display='flex' flexDirection='column' gap={2} height={'100%'} padding={5}>
                <CreateCitaModal
                    citaProps={{
                        ...createCitaProps,
                        onDelete: () => {
                            setOpen(false);
                            confirmDeleteItemMessage(createCitaProps.onDelete?? (() => {}))
                        },
                        onCreateSubmit: () => {
                            setOpen(false);
                            createCitaProps.onCreateSubmit?.();
                            successItemAddedMessage();
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