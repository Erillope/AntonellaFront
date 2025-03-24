import React, { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, IconButton } from "@mui/material";
import { Delete } from '@mui/icons-material';

interface SelectRolesProps {
    roles?: string[];
    selectedRoles?: string[];
    onAddRole?: (role: string) => void;
    onRemoveRole?: (role: string) => void;
    disabled?: boolean;
}

export const SelectRoles: React.FC<SelectRolesProps> = ({ roles, selectedRoles, onAddRole, onRemoveRole, disabled = false }) => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

    useEffect(() => {
        setOptions(loadOptions());
    }, [selectedRoles])

    const loadOptions = (): string[] => {
        if (roles === undefined) { return []; }
        if (selectedRoles) {
            return roles.filter((role) => !selectedRoles.includes(role));
        }
        return roles
    }

    const removeSelected = (role: string) => {
        onRemoveRole && onRemoveRole(role);
        selectedRole && setSelectedRole(null);
    }

    const handleOnchange = (value: string | null) => {
        setSelectedRole(value);
        if (value) {
            onAddRole && onAddRole(value);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: "100%", justifyContent: 'center' }}>
            <Autocomplete
                disablePortal
                value={selectedRole}
                options={options}
                disabled={disabled}
                onChange={(_, value) => handleOnchange(value)}
                sx={{ width: "80%" }}
                renderInput={(params) => <TextField {...params} label="Roles" />}
            />
            {selectedRoles && selectedRoles.length > 0 &&
                <div style={{ display: 'flex', flexWrap: "wrap", flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10, width: "80%" }}>
                    {selectedRoles.map((role) => (
                        <div key={role} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: "lightblue", paddingLeft: 5, paddingRight: disabled ? 5:0, borderRadius: 5, border: "1px solid #000" }}>
                            <span style={{ fontWeight: "bold", fontSize: "15px" }}>{role}</span>
                            {!disabled &&
                                <IconButton onClick={() => removeSelected(role)}>
                                    <Delete style={{ color: "#C9285D" }} />
                                </IconButton>
                            }

                        </div>
                    ))}
                </div>
            }

        </div>
    )
}