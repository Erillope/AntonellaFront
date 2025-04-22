import { useEffect, useState } from "react"
import { useDateInput } from "../components/inputs/DateInput"
import { useInputTextField } from "../components/inputs/InputTextField"
import { useSelectInput } from "../components/inputs/SelectInput"
import { ConfigApi } from "../api/config_api"
import { capitalizeFirstLetter } from "../api/utils"
import { Product, ProductApi } from "../api/product_api"

export const useSearchProduct = () => {
    const nameController = useInputTextField()
    const typeController = useSelectInput()
    const startDate = useDateInput()
    const endDate = useDateInput()
    const [products, setProducts] = useState<Product[]>([])
    const [allProducts, setAllProducts] = useState<Product[]>([])

    const configApi = new ConfigApi()
    const productApi = new ProductApi()

    useEffect(() => {
        const init = async () => {
            typeController.setValue('Todos')
            startDate.setValue(null as any)
            endDate.setValue(null as any)
            const types = await configApi.getProductTypesConfig()
            const products = await productApi.getAll()
            if (products){
                setProducts(products)
                setAllProducts(products)
            }
            typeController.setValues(['Todos', ...types.map(t => capitalizeFirstLetter(t))])
        }
        init()
    }, [])

    const filterProducts = () => {
        const filteredProducts = allProducts.filter(product => includesName(product))
            .filter(product => includesType(product))
            .filter(product => isGreaterThanStartDate(product))
            .filter(product => isLessThanEndDate(product))
        setProducts(filteredProducts)
    }

    useEffect(filterProducts, [nameController.value, typeController.value, startDate.value, endDate.value])

    const includesName = (product: Product): boolean => {
        if (nameController.isEmpty()) return true
        return product.name.toLowerCase().includes(nameController.value.toLowerCase())
    }

    const includesType = (product: Product): boolean => {
        if (typeController.isEmpty()) return true
        if (typeController.value === 'Todos') return true
        return product.productType.toLowerCase().includes(typeController.value.toLowerCase())
    }

    const isGreaterThanStartDate = (product: Product): boolean => {
        if (!startDate.value) return true
        return product.stockModifiedDate >= startDate.value
    }

    const isLessThanEndDate = (product: Product): boolean => {
        if (!endDate.value) return true
        return product.stockModifiedDate <= endDate.value
    }

    return {
        nameProps: nameController.getProps(),
        typeProps: typeController.getProps(),
        startDateProps: startDate.getProps(),
        endDateProps: endDate.getProps(),
        products,
    }
}