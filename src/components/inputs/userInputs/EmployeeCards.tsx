import { Avatar, Box } from "@mui/material";
import { User } from "../../../api/user_api";
import { capitalizeFirstLetter } from "../../../api/utils";

export interface EmployeeCardProps {
    user?: User;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ user }) => {
    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
            padding="16px"
            bgcolor="#f3f3f3"
            width={'50%'}
            margin="8px auto"
            borderRadius="10px"
        >
            <Avatar
                src={user?.photo ?? ''}
                sx={{ width: 56, height: 56, marginRight: "16px" }}
            />
            <Box>
                <p style={{ fontWeight: "bold", fontSize: 15, color:'black' }}>{capitalizeFirstLetter(user?.name??'')}</p>
            </Box>
        </Box>
    );
};