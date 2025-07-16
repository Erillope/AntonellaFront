import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"
import { permissionsIcons } from "./RolePermissionsTable"
import { Box, Typography } from "@mui/material"
import { AccessPermission } from "../../api/role_api"

export interface RoleData {
    id: string;
    name: string;
    accesses: AccessPermission[];
    numUsers: number;
}

const headers: HeaderInfo[] = [
    { label: "Role", width: "20%" },
    { label: "Accesos", width: "60%" },
    { label: "Num Usuarios", width: "20%" },
    { label: "Gestionar", width: "10%" }
]

interface RoleTableProps {
    roles?: RoleData[];
    onViewAction?: (id: string) => void;
    totalRoles?: number;
    page?: number;
    onChangePage?: (page: number) => void;
}

export const RoleTable = (props: RoleTableProps) => {
    const buildRow = (role: RoleData): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='flex-start' width='20%'>{role.name}</Box>,
                <RoleAccessCell accesses={role.accesses} />,
                <Typography>{role.numUsers}</Typography>,
                <ManageActionCell viewAction={() => props.onViewAction?.(role.id)} color="black"/>
            ]
        }
    }

    return (
        <TableView headers={headers} rows={props.roles?.map(buildRow)}
        totalRows={props.totalRoles} page={props.page} setPage={props.onChangePage}
        />
    )
}

const RoleAccessCell = (props: { accesses: AccessPermission[] }) => {
    return (
        <Box display='flex' alignItems='center' gap={1}>
            {props.accesses.map((access) => {
                const icon = permissionsIcons[access.access.toLowerCase()]
                return icon ? <Box key={access.access}>{icon}</Box> : null
            })}
        </Box>
    )
}