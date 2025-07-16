import { useSearchUser } from "../hooks/useSearchUser";
import { UserSearchFilters } from "../components/inputs/userInputs/UserSearchFilters";
import { Box } from "@mui/material";
import { UserTable } from "../components/tables/UserTable";
import { useNavigate } from "react-router-dom";

export const SearchUser = () => {
    const navigate = useNavigate();
    const { filterUserProps, totalUsers, users, page, onChangePage } = useSearchUser();
    return (
        <Box display='flex' flexDirection='column' gap={5} width='90%'>
            <UserSearchFilters {...filterUserProps} />
            <Box paddingBottom={5}>
                <UserTable users={users} onChangePage={onChangePage} totalUsers={totalUsers} page={page}
                    onViewAction={(userId: string) => navigate(`/user/search/${userId}`)}/>
            </Box>
        </Box>
    );
}