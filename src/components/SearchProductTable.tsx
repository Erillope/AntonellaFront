import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import { Product } from "../api/product_api";
import { toDateString } from "../api/date";
import { Visibility } from "@mui/icons-material";

interface SearchProductTableProps {
    products?: Product[];
    page?: number;
    rowsPerPage?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
    onViewAction?: (id: string) => void;
    order?: "asc" | "desc";
    handleSort?: () => void;
}

export const SearchProductTable: React.FC<SearchProductTableProps> = ({ products, page, rowsPerPage, setPage, setRowsPerPage, onViewAction, order, handleSort }) => {
    return (
        <TableContainer component={Paper} style={{ margin: "auto" }}>
            <Table>
                <ProductTableHeader order={order} handleSort={handleSort} />
                <ProductTableBody products={products} page={page} rowsPerPage={rowsPerPage}
                    onViewAction={onViewAction} />
            </Table>
            <ProductTablePagination productsLength={products?.length} page={page}
                rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} />
        </TableContainer>
    )
}

interface ProductTableHeaderProps {
    order?: "asc" | "desc";
    handleSort?: () => void;
}


const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({ order, handleSort }) => {
    return (
        <TableHead style={{ backgroundColor: "#37474F" }}>
            <TableRow>
                <TableCell style={{ width: "25%" }}>
                    <TableSortLabel active direction={order} onClick={handleSort}
                        className="header">
                        Producto
                    </TableSortLabel>
                </TableCell>
                <TableCell className="header" style={{ width: "10%" }}>Precio</TableCell>
                <TableCell className="header" style={{ width: "20%" }}>Disponibilidad</TableCell>
                <TableCell className="header" style={{ width: "10%" }}>Volumen</TableCell>
                <TableCell className="header" style={{ width: "25%" }}>Fecha modificación stock</TableCell>
                <TableCell className="header" style={{ width: "10%" }}>Gestionar</TableCell>
            </TableRow>
        </TableHead>
    )
}


interface ProductTableBodyProps {
    products?: Product[];
    page?: number;
    rowsPerPage?: number;
    onViewAction?: (id: string) => void;
}

const ProductTableBody: React.FC<ProductTableBodyProps> = ({ products = [], page = 0, rowsPerPage = 0,
    onViewAction
}) => {
    return (
        <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
                <TableRow key={question.id}>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>{question.name}</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>{question.price}</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>{question.stock}</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>{question.volume}</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>{toDateString(question.stockModifiedDate)}</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#37474F" }}>
                        <IconButton style={{ color: "#37474F", marginRight: 5 }}
                            onClick={() => onViewAction?.(question.id)}>
                            <Visibility />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

interface ProductTablePaginationProps {
    productsLength?: number;
    page?: number;
    rowsPerPage?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
}

const ProductTablePagination: React.FC<ProductTablePaginationProps> = ({ productsLength = 0, page = 0,
    rowsPerPage = 0, setPage, setRowsPerPage
}) => {
    return (
        <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={productsLength}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage?.(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage?.(parseInt(e.target.value, 10))}
        />
    )
}