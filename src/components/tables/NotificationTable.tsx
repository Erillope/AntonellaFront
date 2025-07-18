import { Box, Typography } from "@mui/material"
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"
import { Notification } from "../../api/notification"
import { toDateString, toTimeString } from "../../api/utils"

const headers: HeaderInfo[] = [
    { label: 'Título', width: '30%' },
    { label: 'Tipo', width: '30%' },
    { label: 'Fecha de envío', width: '30%' },
    { label: 'Gestionar', width: '10%' }
]

export interface NotificationTableProps {
    notifications?: Notification[];
    onViewAction?: (id: string) => void;
    page?: number;
    onChangePage?: (page: number) => void;
    totalRows?: number;
}

export const NotificationTable = (props: NotificationTableProps) => {
    const mapDate = (date: Date): string => {
        return toDateString(date) + " " + toTimeString(date);
    }

    const buildRows = (notification: Notification): RowComponent => {
        return {
            cells: [
                <Box display='flex' justifyContent={'center'} width='70%'>{notification.title}</Box>,
                <Typography>{notification.type}</Typography>,
                <Typography>{notification.publishDate ? mapDate(notification.publishDate) : notification.createdDate ? mapDate(notification.createdDate) : ""}</Typography>,
                <ManageActionCell viewAction={() => props.onViewAction?.(notification.id??'')} color="black" />
            ]
        }
    }

    return (
        <TableView headers={headers} width="90%" rows={props.notifications?.map(buildRows)}
            page={props.page} setPage={props.onChangePage} totalRows={props.totalRows}
        />
    )
}