import { Avatar, Box } from "@mui/material";
import { User } from "../api/user_api"
import { BACK_URL } from "../api/config";
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
            border="1px solid #e0e0e0"
            borderRadius="8px"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            bgcolor="#fff"
            maxWidth="400px"
            margin="8px auto"
        >
            <Avatar
                src={BACK_URL + (user?.photo ?? '')}
                sx={{ width: 56, height: 56, marginRight: "16px" }}
            />
            <Box>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>{user?.name}</p>
                <p style={{ margin: 0, color: "#757575", fontSize: "0.875rem" }}>{user?.email}</p>
            </Box>
        </Box>
    );
};