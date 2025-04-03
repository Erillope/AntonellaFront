import { SearchProductTable } from "../components/SearchProductTable"
import { Product, ProductApi } from "../api/product_api"
import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import { TextInputField } from "../components/inputField/TextInputField"
import { SelectInput } from "../components/inputField/SelectInput"
import { DateField } from "../components/inputField/DateField"
import { useNavigate } from "react-router-dom"

export const SearchProduct = () => {
    const productApi = new ProductApi()
    const navigate = useNavigate()
    const [allProdcts, setAllProducts] = useState<Product[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(0);
    const [selectedType, setSelectedType] = useState("TODO")
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date())
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const servicesType = ["TODO", "CABELLO", "SPA", "UÑAS", "MAQUILLAJE"]

    const onSearchName = (name: string) => {
        const filteredProducts = allProdcts.filter((product) => product.name.toLowerCase().startsWith(name.toLowerCase()))
        setProducts(filteredProducts)
        setPage(0)
        setRowsPerPage(5)
    }

    const onSearchType = (type: string) => {
        setSelectedType(type)
        if (type === "TODO") {
            setProducts(allProdcts)
            return
        }
        const filteredProducts = allProdcts.filter((product) => product.type.toLowerCase().startsWith(type.toLowerCase()))
        setProducts(filteredProducts)
        setPage(0)
        setRowsPerPage(5)
    }

    const onSearchStartDate = (d: Date) => {
        setSelectedStartDate(d)
        const filteredProducts = allProdcts.filter((p) => p.stockModifiedDate >= d && p.stockModifiedDate <= selectedEndDate)
        setProducts(filteredProducts)
        setPage(0)
        setRowsPerPage(5)
    }

    const onSearchEndDate = (d: Date) => {
        setSelectedEndDate(d)
        const filteredProducts = allProdcts.filter((p) => p.stockModifiedDate >= selectedStartDate && p.stockModifiedDate <= d)
        setProducts(filteredProducts)
        setPage(0)
        setRowsPerPage(5)
    }

    const getProducts = async () => {
        const products = await productApi.getAll()
        if (products) {
            setProducts(products)
            setAllProducts(products)
        }
    }

    useEffect(() => { getProducts() }, [])

    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'100%'} gap={2}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'}>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} width={'50%'}>
                    <TextInputField labelText="Nombre del producto" onValueChange={onSearchName}/>
                    <SelectInput values={servicesType} value={selectedType} label="Tipo de servicio"
                    onSelect={onSearchType}/>
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'50%'} gap={2}
                    paddingTop={2}>
                    <DateField labelText="Fecha desde" value={selectedStartDate}
                    onChange={(d) => d && onSearchStartDate(d)}/>
                    <DateField labelText="Fecha hasta" value={selectedEndDate}
                    onChange={(d) => d && onSearchEndDate(d)}/>
                </Box>

            </Box>
            <SearchProductTable products={products} page={page} setPage={setPage} rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage} onViewAction={(id) => navigate('/product/search/'+id)}/>
        </Box>
    )
}