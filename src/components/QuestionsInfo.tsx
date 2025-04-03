import { Box, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { Modal } from "@mui/material"
import { useState } from "react";
import { CreateQuestion } from "./CreateQuestion";
import CloseIcon from "@mui/icons-material/Close"
import { QuestionsTable } from "./QuestionsTable";
import { CreateQuestion as CreateQuestionData } from "../api/store_service_api";
import { Question } from "../api/store_service_api";
import { QuestionInfo } from "./QuestionInfo";

interface QuestionsInfoProps {
    questions?: Question[];
    onCreateQuestion?: (question: CreateQuestionData) => void;
    onChangeQuestions?: (questions: Question[]) => void;
    onDeleteQuestion?: (questionId: string) => void;
    editable?: boolean;
}

export const QuestionsInfo: React.FC<QuestionsInfoProps> = ({ questions = [], onCreateQuestion, onChangeQuestions, onDeleteQuestion, editable=true}) => {
    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedQuestion, setSelectedQuestion] = useState<string>('');

    const createQuestion = (question: CreateQuestionData) => {
        onCreateQuestion?.(question)
        setOpen(false)
    }

    const deleteQuestion = (questionId: string) => {
        onDeleteQuestion?.(questionId)
        setSelectedQuestion('')
    }

    const handleSort = () => {
        setOrder(order === "asc" ? "desc" : "asc");
        questions.reverse()
    }

    const changeQuestion = (question: Question) => {
        const selectedQuestionData = questions.find((q) => q.id == question.id)
        if (selectedQuestionData) {
            const updatedQuestions = questions.map((q) => (q.id === question.id ? question : q));
            onChangeQuestions?.(updatedQuestions)
            setSelectedQuestion('')
        }
    }

    return (
        <Box display="flex" flexDirection="column" gap={1} p={2} width="100%">
            <Box display="flex" alignItems="center" gap={1}>
                <h3>Preguntas({questions.length})</h3>
                <IconButton size="small" style={{ backgroundColor: '#AF234A', color: 'white' }}
                    onClick={() => setOpen(true)} disabled={!editable}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Modal open={open}>
                <Box bgcolor='white' width='70%' height='95%' position='absolute' top='50%' left='50%'
                    sx={{ transform: 'translate(-50%, -50%)' }} borderRadius={2} boxShadow={24}>
                    <IconButton onClick={() => setOpen(false)}
                        sx={{
                            position: "absolute", top: 8, right: 8, color: "white", backgroundColor: "#C9285D", "&:hover": { backgroundColor: "#AF234A" },
                        }}>
                        <CloseIcon />
                    </IconButton>
                    <CreateQuestion onCreateQuestion={createQuestion} />
                </Box>
            </Modal>
            <QuestionsTable questions={questions} page={page} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage} onViewAction={setSelectedQuestion} setPage={setPage} order={order} handleSort={handleSort} />
            <Modal open={!!selectedQuestion} onClose={() => setSelectedQuestion('')}>
                <Box bgcolor='white' width='70%' height='75%' position='absolute' top='50%' left='50%'
                    sx={{ transform: 'translate(-50%, -50%)' }} borderRadius={2} boxShadow={24}>
                    <IconButton onClick={() => setSelectedQuestion('')}
                        sx={{
                            position: "absolute", top: 8, right: 8, color: "white", backgroundColor: "#C9285D", "&:hover": { backgroundColor: "#AF234A" },
                        }}>
                        <CloseIcon />
                    </IconButton>
                    <QuestionInfo question={questions.find((q) => q.id == selectedQuestion)}
                        onChangeQuestion={changeQuestion} onDeleteQuestion={deleteQuestion}
                        disabled={!editable}/>
                </Box>
            </Modal>
        </Box>
    )
}