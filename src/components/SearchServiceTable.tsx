import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ServiceTypeInfo } from "../api/types"
import { v4 as uuidv4 } from "uuid"
import { Visibility } from "@mui/icons-material"

interface SearchServiceTableProps {
    servicesInfo?: ServiceTypeInfo[];
    onViewAction?: (type: string) => void;
}

export const SearchServiceTable: React.FC<SearchServiceTableProps> = ({ servicesInfo, onViewAction}) => {
    return (
        <TableContainer component={Paper} style={{ margin: "auto" }}>
            <Table>
                <SearchServiceTableHeader />
                <SearchServiceTableBody servicesInfo={servicesInfo} onViewAction={onViewAction}/>
            </Table>
        </TableContainer>
    )
}


const SearchServiceTableHeader = () => {
    return (
        <TableHead style={{ backgroundColor: "#37474F" }}>
            <TableRow>
                <TableCell className="header" style={{ width: "30%" }}>Tipo Servicio</TableCell>
                <TableCell className="header" style={{ width: "10%" }}>#Cantidad</TableCell>
                <TableCell className="header" style={{ width: "10%" }}>Profesionales</TableCell>
                <TableCell className="header" style={{ width: "40%" }}>Subcategorías</TableCell>
                <TableCell className="header" style={{ width: "10%" }}>Gestionar</TableCell>
            </TableRow>
        </TableHead>
    )
}

interface SearchServiceTableBodyProps {
    servicesInfo?: ServiceTypeInfo[];
    onViewAction?: (type: string) => void;
}

const SearchServiceTableBody: React.FC<SearchServiceTableBodyProps> = ({ servicesInfo, onViewAction}) => {
    return (
        <TableBody>
            {servicesInfo && servicesInfo.length > 0 ? (
            servicesInfo.map((info) => (
                <TableRow key={uuidv4()}>
                <TableCell>{info.type}</TableCell>
                <TableCell>{info.num}</TableCell>
                <TableCell>{info.employees}</TableCell>
                <TableCell>{info.subTypes.join(", ")}</TableCell>
                <TableCell>
                    <IconButton onClick={() => onViewAction?.(info.type)}>
                    <Visibility />
                    </IconButton>
                </TableCell>
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                No hay servicios disponibles.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
    )
}