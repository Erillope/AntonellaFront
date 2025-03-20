import { TextField, IconButton, InputAdornment } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import React from "react";

interface SearchInputProps {
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: () => void;
    style?: React.CSSProperties;
}

export const SearchInput: React.FC<SearchInputProps> = ({ name, value, onChange, onSearch, style }) => {
    return (
        <TextField
            label={name}
            variant="outlined"
            margin="normal"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            style={style}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={onSearch??(()=>{})}>
                                <SearchIcon style={{ fontSize: "25px" }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}