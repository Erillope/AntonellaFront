import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, IconButton, TablePagination } from "@mui/material"
import { Question } from "../api/store_service_api";
import { Visibility } from "@mui/icons-material";

interface QuestionsTableProps {
    questions?: Question[];
    page?: number;
    rowsPerPage?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
    onViewAction?: (id: string) => void;
    order?: "asc" | "desc";
    handleSort?: () => void;
}

export const QuestionsTable: React.FC<QuestionsTableProps> = ({ questions, page, rowsPerPage, setRowsPerPage, onViewAction, setPage, order, handleSort}) => {
    return (
        <TableContainer component={Paper} style={{margin: "auto" }}>
            <Table>
                <QuestionsTableHeader order={order} handleSort={handleSort}/>
                <QuestionsTableBody questions={questions} page={page} rowsPerPage={rowsPerPage}
                onViewAction={onViewAction}/>
            </Table>
            <QuestionTablePagination questionsLength={questions?.length} page={page}
            rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage}/>
        </TableContainer>
    )
}

interface QuestionsTableHeaderProps {
    order?: "asc" | "desc";
    handleSort?: () => void;
}

const QuestionsTableHeader: React.FC<QuestionsTableHeaderProps> = ({ order, handleSort }) => {
    return (
        <TableHead style={{ backgroundColor: "#37474F" }}>
            <TableRow>
                <TableCell style={{ width: "40%" }}>
                    <TableSortLabel active direction={order} onClick={handleSort}
                        className="header">
                        Preguntas
                    </TableSortLabel>
                </TableCell>
                <TableCell className="header" style={{ width: "40%" }}>Tipo</TableCell>
                <TableCell className="header" style={{ width: "20%" }}>Gestionar</TableCell>
            </TableRow>
        </TableHead>
    )
}

interface QuestionTableBodyProps {
    questions?: Question[];
    page?: number;
    rowsPerPage?: number;
    onViewAction?: (id: string) => void;
}

const QuestionsTableBody: React.FC<QuestionTableBodyProps> = ({ questions = [], page = 0, rowsPerPage = 0,
    onViewAction
}) => {
    return (
        <TableBody>
            {questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
                <TableRow key={question.id}>
                    <QuestionInfoCell question={question} />
                    <QuestionTypeCell question={question} />
                    <QuestionViewCell onViewAction={() => onViewAction?.(question.id)} />
                </TableRow>
            ))}
        </TableBody>
    )
}

const QuestionInfoCell: React.FC<{ question: Question }> = ({ question }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            {question.title}
        </TableCell>
    )   
}

const QuestionTypeCell: React.FC<{ question: Question }> = ({ question }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            {question.inputType + " " + question.choiceType}
        </TableCell>
    )
}

const QuestionViewCell: React.FC<{ onViewAction: () => void }> = ({ onViewAction }) => {
    return (
        <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
            <IconButton style={{ color: "#37474F", marginRight: 5 }}
                onClick={onViewAction}>
                <Visibility />
            </IconButton>
        </TableCell>
    )
}


interface QuestionTablePaginationProps {
    questionsLength?: number;
    page?: number;
    rowsPerPage?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
}

const QuestionTablePagination: React.FC<QuestionTablePaginationProps> = ({ questionsLength=0, page=0,
    rowsPerPage=0, setPage, setRowsPerPage
}) => {
    return (
        <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={questionsLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage?.(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage?.(parseInt(e.target.value, 10))}
        />
    )
}