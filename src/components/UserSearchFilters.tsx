import { SearchInput } from "./inputField/SearchInput";
import { SelectInput } from "./inputField/SelectInput";
import React from "react";

interface UserSearchFiltersProps {
    name: string;
    onChangeName: (value: string) => void;
    onSearchName: () => void;
    phoneNumber: string;
    onChangePhoneNumber: (value: string) => void;
    onSearchPhoneNumber: () => void;
    email: string;
    onChangeEmail: (value: string) => void;
    onSearchEmail: () => void;
    dni: string;
    onChangeDni: (value: string) => void;
    onSearchDni: () => void;
    roles: string[];
    selectedRole: string;
    onSelectRole: (value: string) => void;
}

export const UserSearchFilters: React.FC<UserSearchFiltersProps> = ({ name, onChangeName, onSearchName,
    phoneNumber, onChangePhoneNumber, onSearchPhoneNumber, email, onChangeEmail, onSearchEmail,
    dni, onChangeDni, onSearchDni, roles, selectedRole, onSelectRole 
}) => {
    return (
        <div style={{ width: "90%", display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "70%", display: "flex", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 0 50%" }}>
                        <SearchInput name="Nombre" value={name} onChange={onChangeName}
                            onSearch={onSearchName} style={{ width: "90%" }}
                        />
                    </div>
                    <div style={{ flex: "1 0 50%" }}>
                        <SearchInput name="Celular" value={phoneNumber} onChange={onChangePhoneNumber}
                            onSearch={onSearchPhoneNumber} style={{ width: "90%" }} />
                    </div>
                    <div style={{ flex: "1 0 50%" }}>
                        <SearchInput name="Email" value={email} onChange={onChangeEmail}
                            onSearch={onSearchEmail} style={{ width: "90%" }} />
                    </div>
                    <div style={{ flex: "1 0 50%" }}>
                        <SearchInput name="Cedula" value={dni} onChange={onChangeDni}
                            onSearch={onSearchDni} style={{ width: "90%" }} />
                    </div>
                </div>
                <div>
                    <SelectInput values={roles} value={selectedRole} onSelect={onSelectRole}
                    label="Filtrar por roles"/>
                </div>
            </div>
        </div>
    )
}