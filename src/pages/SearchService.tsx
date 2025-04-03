import { useEffect } from "react"
import { useService } from "../hooks/useService"
import { SearchServiceTable } from "../components/SearchServiceTable"
import { useNavigate } from "react-router-dom"

export const SearchService = () => {
    const navigate = useNavigate()
    const { initSearch, typeInfo } = useService({})

    useEffect(initSearch, [])
    
    return (
        <div style={{ width: '100%', marginTop: '20px'}}>
            <SearchServiceTable servicesInfo={typeInfo}
            onViewAction={(type: string) => navigate(`/service/${type}`)}/>
        </div>
    )
}