import { Visibility } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Pagination, PaginationItem } from "@mui/material";
import React, { useEffect } from "react";
import "../../styles/table.css";

export interface RowComponent {
    cells: React.ReactNode[];
}

export interface HeaderInfo {
    label: string;
    width: string;
}

export interface TableViewProps {
    headers?: HeaderInfo[];
    width?: string;
    rows?: RowComponent[];
    showPaginator?: boolean;
}

export function TableView(props: TableViewProps) {
    const showPaginator = () => {
        if (props.showPaginator === undefined) return true;
        return props.showPaginator;
    }
    const [rowsPerPage, setRowsPerPage] = React.useState(showPaginator() ? 5 : props.rows?.length ?? 0);
    const [page, setPage] = React.useState(0);
    useEffect(() => setPage(0), [props.rows])

    return (
        <TableContainer component={Paper} sx={{ width: props.width ?? '100%', borderRadius: 5 }}>
            <Table>
                <TableHeader headers={props.headers} />
                <TableViewBody rows={props.rows ?? []} page={page} rowsPerPage={rowsPerPage} colSpan={props.headers?.length}/>
            </Table>
            {showPaginator() &&
                <TablePaginator rowsLength={props.rows?.length ?? 0} page={page} setPage={setPage}
                    rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
            }
        </TableContainer>
    )
}


function TableHeader(props: TableViewProps) {
    return (
        <TableHead style={{ backgroundColor: "#F44565" }}>
            <TableRow>
                {props.headers?.map((header, index) => (
                    <TableCell key={index} style={{ width: header.width }} className="header">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {header.label}
                        </Box>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}


interface TableViewBodyProps {
    rows: RowComponent[];
    page: number;
    rowsPerPage: number;
    colSpan?: number;
    emptyMessage?: string;
}

function TableViewBody(props: TableViewBodyProps) {
    const startElement = props.page * props.rowsPerPage;
    const endElement = startElement + props.rowsPerPage;
    const elements = props.rows.slice(startElement, endElement);
    return (
        <TableBody sx={{ backgroundColor: "#F3F3F3" }}>
            {elements.map((row, index) => (
                <TableRow key={index}>
                    {row.cells.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {cell}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
            {elements.length === 0 && (
                <TableRow>
                    <TableCell colSpan={props.colSpan} style={{ textAlign: 'center', fontSize: 12}}>
                        {props.emptyMessage ?? "No hay elementos registrados"}
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}


interface TablePaginationProps {
    rowsLength: number;
    rowsPerPage: number;
    page: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

function TablePaginator(props: TablePaginationProps) {
    return (
        <Pagination
            count={props.rowsLength > 0 ? Math.ceil(props.rowsLength / props.rowsPerPage) : 1}
            page={props.page + 1}
            onChange={(_, page) => props.setPage(page - 1)}
            variant="outlined"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            renderItem={(item) => (
                <PaginationItem
                    {...item}
                    className={`custom-pagination-item${item.selected ? " selected" : ""
                        }${item.type === 'end-ellipsis' ? " ellipsis" : ""}`}
                />
            )}
            className="custom-pagination"
        />
    );
}

export function ManageActionCell(props: { viewAction?: () => void, color?: string }) {
    return (
        <IconButton style={{ color: props.color ?? "#F44565" }}
            onClick={props.viewAction}>
            <Visibility />
        </IconButton>
    )
}