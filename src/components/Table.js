import React, { useEffect, useState } from 'react'
import '../assets/scss/table.scss'
import { searchFields } from '../constants/searchFields.const'
import useQuery from '../hooks/useQuery'
import Pagination from './Pagination'
import SearchBar from './SearchBar'

const Table = () => {
    const [selectedPage, setSelectedPage] = useState(1)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [pageData, setPageData] = useState([])
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [actionTypes, setActionTypes] = useState([])
    const [applicationTypes, setApplicationTypes] = useState([])

    const query = useQuery()

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        handleFiltration()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, query])

    useEffect(() => {
        handlePageList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredData])

    const handlePageList = () => {
        const firstElementIndex = (selectedPage - 1) * 10
        const lastElementIndex = selectedPage * 10
        const onePage = filteredData.slice(firstElementIndex, lastElementIndex)
        setPageData(onePage)
    }

    const handleFiltration = () => {
        const filters = []
        searchFields.forEach(item => {
            if (query.get(item)) filters.push({ name: item, value: query.get(item) })
        })

        const finalData = data.filter(DataItem => {
            let valid = true
            if (query.get('fromDate')) {
                const from = new Date(`${query.get('fromDate')} 00:00`)
                const to = new Date(`${query.get('toDate')} 24:00`)
                const itemDate = new Date(DataItem.creationTimestamp)
                if (!(to > itemDate && itemDate >= from)) {
                    return false
                }
            }
            filters.forEach(searchBy => {
                if (searchBy.name === 'fromDate' || searchBy.name === 'toDate') {
                    return
                }
                if (searchBy.value !== DataItem[searchBy.name]?.toString()) {
                    valid = false
                }
            })
            return valid
        })

        setNumberOfPages(Math.ceil(finalData.length / 10))
        setFilteredData(finalData)
    }

    const getData = async () => {
        const response = await fetch(process.env.REACT_APP_BASE_URL)
            .then(res => res.json()).then(data => data.result.auditLog);

        // using set to have array with no duplicates
        const allActionTypes = new Set()
        const allApplicationTypes = new Set()

        // using forEach instead of map for less complexity (one forEach instead of two maps)
        response.forEach(element => {
            allActionTypes.add(element.actionType)
            allApplicationTypes.add(element.applicationType)
        });

        setActionTypes(Array.from(allActionTypes))
        setApplicationTypes(Array.from(allApplicationTypes))
        setNumberOfPages(Math.ceil(response.length / 10))
        setData(response);
    };

    const emptyData = () => <p className='empty-data'>-/-</p>

    return (
        <div>
            <SearchBar actionTypes={actionTypes} applicationTypes={applicationTypes} />
            <div className='full-table'>
                <table className='data-table'>
                    <thead>
                        <tr className='table-row'>
                            <th className='table-col'>Log ID</th>
                            <th className='table-col'>Application Type</th>
                            <th className='table-col'>Application ID</th>
                            <th className='table-col'>Action</th>
                            <th className='table-col'>Action Details</th>
                            <th className='table-col date'>Date : Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageData.map(item => (
                            <tr key={item.logId} className='table-row'>
                                <td className='table-col'>{item.logId}</td>
                                <td className='table-col'>{item.applicationType}</td>
                                <td className='table-col'>{item.applicationId || emptyData()}</td>
                                <td className='table-col'>{item.actionType}</td>
                                <td className='table-col'>{emptyData()}</td>
                                <td className='table-col'>{item.creationTimestamp.replace(' ', ' / ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination selectedPage={selectedPage} setSelectedPage={setSelectedPage} numberOfPages={numberOfPages} />
            </div>

        </div>
    )
}

export default Table