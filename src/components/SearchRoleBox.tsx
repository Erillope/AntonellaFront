import React from "react";

interface SearchRoleBoxProps {
    children: React.ReactNode;
}

export const SearchRoleBox: React.FC<SearchRoleBoxProps> = ({ children }) => {
    const childrens = React.Children.toArray(children);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: '100%'}}>
            <div style={{ width: "90%" }}>
                {childrens[0]}
            </div>
            <div style={{ width: "90%" }}>
                {childrens[1]}
            </div>
        </div>
    );
}