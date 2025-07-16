import { Visibility } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Pagination, PaginationItem } from "@mui/material";
import React from "react";
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
    page?: number;
    setPage?: (page: number) => void;
    rowsPerPage?: number;
    totalRows?: number;
}

export function TableView(props: TableViewProps) {
    const showPaginator = () => {
        if (props.showPaginator === undefined) return true;
        return props.showPaginator;
    }
    const rowsPerPage = showPaginator() ? props.rowsPerPage??5 : props.rows?.length ?? 0

    return (
        <TableContainer component={Paper} sx={{ width: props.width ?? '100%', borderRadius: 5, overflowX: 'hidden' }}>
            <Table>
                <TableHeader headers={props.headers} />
                <TableViewBody rows={props.rows ?? []} colSpan={props.headers?.length}/>
            </Table>
            {showPaginator() &&
                <TablePaginator rowsLength={props.rows?.length ?? 0} page={props.page} setPage={props.setPage}
                totalRows={props.totalRows}
                rowsPerPage={rowsPerPage}/>
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
    colSpan?: number;
    emptyMessage?: string;
}

function TableViewBody(props: TableViewBodyProps) {
    return (
        <TableBody sx={{ backgroundColor: "#F3F3F3" }}>
            {props.rows.map((row, index) => (
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
            {props.rows.length === 0 && (
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
    page?: number;
    setPage?: (page: number) => void;
    totalRows?: number;
}

function TablePaginator(props: TablePaginationProps) {
    const calculateTotalPages = (length: number) => {
        return Math.ceil(length / props.rowsPerPage);
    }
    return (
        <Pagination
            count={props.totalRows ? calculateTotalPages(props.totalRows) : Math.ceil(props.rowsLength)}
            page={(props.page??0) + 1}
            onChange={(_, page) => props.setPage?.(page - 1)}
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