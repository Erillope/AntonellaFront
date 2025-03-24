import React from "react";
import { CheckboxInput } from "./CheckBoxInput";
import { Box } from "@mui/material";

interface EmployeeCategoriesCheckProps {
    selectedCategories?: string[];
    onSelectedCategories?: (categories: string[]) => void;
    disabled?: boolean;
}

export const EmployeeCategoriesCheck: React.FC<EmployeeCategoriesCheckProps> = ({ selectedCategories, onSelectedCategories, disabled}) => {
    const includeCategory = (category: string): boolean => !!(selectedCategories?.includes(category))
    const selectCategory = (category: string) => {
        let categories = []
        if (selectedCategories && includeCategory(category)) {
            categories = selectedCategories?.filter((selectedCategory) => selectedCategory !== category);
            onSelectedCategories?.(categories); return
        }
        categories = [...(selectedCategories || []), category];
        onSelectedCategories?.(categories);
    };

    return ( 
        <>
        <div style={{display: "flex", justifyContent: "flex-start"}}>
            <p style={{ fontWeight: "bold" }}>Tipo empleado:</p>
        </div>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
            <CheckboxInput checked={includeCategory('CABELLO')} disabled={disabled}
            onChecked={() => selectCategory('CABELLO')} label="Cabello" />
            <CheckboxInput checked={includeCategory('MAQUILLAJE')} disabled={disabled}
            onChecked={() => selectCategory('MAQUILLAJE')} label="Maquillaje" />
            <CheckboxInput checked={includeCategory('UÑAS')} disabled={disabled}
            onChecked={() => selectCategory('UÑAS')} label="Uñas" />
            <CheckboxInput checked={includeCategory('SPA')} disabled={disabled}
            onChecked={() => selectCategory('SPA')} label="Spa" />
        </Box>
        </>
    )
}