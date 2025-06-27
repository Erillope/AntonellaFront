import { useParams } from "react-router-dom";
import { CitaForm } from "../components/inputs/citaInputs/CitaForm";
import { useCita } from "../hooks/useCita";

export const CitaInfo = () => {
    const { id } = useParams<{ id: string }>();
    const citaController = useCita(id);

    return (
        <CitaForm 
            width="95%"
            citaInputsProps={citaController.getCitaProps()} disabled={true}
            answerFormProps={{ questions: citaController.generateAnswersProps(), error: citaController.answerError }}
        />
    );
}