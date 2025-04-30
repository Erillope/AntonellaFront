import { Box } from "@mui/material";
import { User } from "../../api/user_api";
import { HeaderInfo, ManageActionCell, RowComponent, TableView } from "./TableView";
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from "@mui/icons-material/Man";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export interface UserTableProps {
    width?: string;
    users?: User[];
    onViewAction?: (id: string) => void;
}

const headers: HeaderInfo[] = [
    { label: "Usuario", width: "10%" },
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
        } />
    )
}


function UsertInfo(props: { user: User }) {
    return (
        <Box display='flex' alignItems='flex-start' width='100%'>
            {props.user.gender === "Masculino" ? <ManIcon style={{ color: "#29AAE1", marginRight: 5 }} /> : <WomanIcon style={{ color: "#F44565", marginRight: 5 }} />}
            {props.user.name}
        </Box>
    )
}


function UserContact(props: { user: User }) {
    return (
        <Box display='flex' alignItems='flex-start' width='50%' flexDirection='column'
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