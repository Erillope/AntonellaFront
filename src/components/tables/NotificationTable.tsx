import { Box, Typography } from "@mui/material"
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView"
import { Notification } from "../../api/notification"
import { toDateString, toDateTimeString } from "../../api/utils"

const headers: HeaderInfo[] = [
    { label: 'Título', width: '40%' },
    { label: 'Tipo', width: '30%' },
    { label: 'Fecha', width: '20%' },
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
        return toDateString(date) + ' ' + toDateTimeString(date);
    }

    const buildRows = (notification: Notification): RowComponent => {
        return {
            cells: [
                <Box display='flex' alignItems='center' width='100%'>{notification.title}</Box>,
                <Typography>{notification.type}</Typography>,
                <Typography>{notification.publishDate ? mapDate(notification.publishDate) : notification.createdDate ? mapDate(notification.createdDate) : ""}</Typography>,
                <ManageActionCell viewAction={() => console.log('View action')} color="black" />
            ]
        }
    }

    return (
        <TableView headers={headers} width="90%" rows={props.notifications?.map(buildRows)}
            page={props.page} setPage={props.onChangePage} totalRows={props.totalRows}
        />
    )
}