import { useEffect, useState } from "react"
import { useDateInput } from "../components/inputs/DateInput"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useSelectInput } from "../components/inputs/SelectInput"
import { Product, ProductApi, ProductFilter } from "../api/product_api"
import { movilCategories } from "../api/config"

export const useSearchProduct = () => {
    const nameController = useInputTextField()
    const typeController = useSelectInput()
    const startDate = useDateInput()
    const endDate = useDateInput()
    const [products, setProducts] = useState<Product[]>([])
    const [totalProducts, setTotalProducts] = useState<number>(0)
    const [totalFilteredProducts, setTotalFilteredProducts] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const productApi = new ProductApi()

    useEffect(() => {
        const init = async () => {
            typeController.setValue('Todos')
            startDate.setValue(null as any)
            endDate.setValue(null as any)
            const productsData = await productApi.filter({limit: 5})
            const products = productsData?.products ?? []
            const totalProducts = productsData?.total ?? 0
            setTotalProducts(totalProducts)
            setProducts(products)
            setTotalFilteredProducts(totalProducts)
            typeController.setValues(['Todos', ...movilCategories])
        }
        init()
    }, [])

    const getFilterProps = (offset: number, limit: number): ProductFilter => {
        return {
            name: nameController.isEmpty() ? undefined : nameController.value,
            type: typeController.value === 'Todos' ? undefined : typeController.isEmpty() ? undefined : typeController.value,
            startStockModifiedDate: startDate.value ?? undefined,
            endStockModifiedDate: endDate.value ?? undefined,
            limit,
            offset,
        }
    }

    const onChangePage = async (page: number) => {
        const offset = page * 5
        setPage(page)
        const productsData = await productApi.filter(getFilterProps(offset, 5))
        if (productsData) {
            setTotalFilteredProducts(productsData.filteredCount)
            setProducts(productsData.products)
        }
    }

    const filter = async () => {
        const productsData = await productApi.filter(getFilterProps(0, 5))
        setPage(0)
        if (productsData) {
            setTotalFilteredProducts(productsData.filteredCount)
            setProducts(productsData.products)
            setTotalProducts(productsData.total)
        }
    }

    useEffect(() => {filter()}, [nameController.value, typeController.value, startDate.value, endDate.value])


    return {
        nameProps: nameController.getProps(),
        typeProps: typeController.getProps(),
        startDateProps: startDate.getProps(),
        endDateProps: endDate.getProps(),
        products,
        totalProducts,
        totalFilteredProducts,
        page,
        onChangePage,
    }
}