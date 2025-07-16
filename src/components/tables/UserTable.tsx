import { Box } from "@mui/material";
import { User } from "../../api/user_api";
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView";
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from "@mui/icons-material/Man";
import WcIcon from '@mui/icons-material/Wc';
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { JSX } from "react";

export interface UserTableProps {
    width?: string;
    users?: User[];
    page?: number;
    onChangePage?: (page: number) => void;
    onViewAction?: (id: string) => void;
    totalUsers?: number;
}

const headers: HeaderInfo[] = [
    { label: "Usuario", width: "20%" },
    { label: "Contacto", width: "70%" },
    { label: "Gestionar", width: "20%" }
]

export function UserTable(props: UserTableProps) {
    const buildRow = (user: User): RowComponent => {
        return {
            cells: [
                <UsertInfo user={user} />,
                <UserContact user={user} />,
                <ManageActionCell
                    viewAction={() => props.onViewAction?.(user.id)}
                />
            ]
        }
    }

    return (
        <TableView headers={headers} width={props.width} rows={
            props.users?.map((user) => buildRow(user))
        } setPage={props.onChangePage} page={props.page}
        totalRows={props.totalUsers}
        />
    )
}


function UsertInfo(props: { user: User }) {
    const genderIcon: { [key: string]: JSX.Element } = {
        "Masculino": <ManIcon style={{ color: "#29AAE1", marginRight: 5 }} />,
        "Femenino": <WomanIcon style={{ color: "#F44565", marginRight: 5 }} />,
        "Otro": <WcIcon style={{ color: "#BA68C8 ", marginRight: 5 }} />
    }

    return (
        <Box display='flex' alignItems='flex-start' width='100%'>
            {genderIcon[props.user.gender]}
            {props.user.name}
        </Box>
    )
}


function UserContact(props: { user: User }) {
    return (
        <Box display='flex' alignItems='flex-start' width='100%' flexDirection='column'
            sx={{ translate: "40% 0"}}>
            <Box display='flex' alignItems='center' fontSize={12}>
                <PhoneIcon style={{ color: "#F44565", marginRight: 5, fontSize: 16 }} />
                {props.user.phoneNumber}
            </Box>
            <Box display='flex' alignItems='center' fontSize={12}>
                <EmailIcon style={{ color: "#F44565", marginRight: 5, fontSize: 16 }} />
                {props.user.email}
            </Box>
        </Box>
    )
}