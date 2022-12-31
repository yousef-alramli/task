import React, { useEffect, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"
import '../assets/scss/pagination.scss'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ numberOfPages, selectedPage, setSelectedPage }) => {
    const [firstNumber, setFirstNumber] = useState(1)
    const [lastNumber, setLastNumber] = useState(1)
    const [NumberOfPagesShown, setNumberOfPagesShown] = useState(7)
    const [showCollapseDots, setShowCollapseDots] = useState(true)

    const [query, setQuery] = useSearchParams();

    useEffect(() => {
        // if there's page param then will change the page
        const page = query.get('page')
        page && setSelectedPage(Number(page))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, numberOfPages])

    useEffect(() => {
        handlePagination()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPage, numberOfPages])


    const handleSelectPage = (pageNum) => {
        query.delete('page')
        query.append('page', pageNum)
        setQuery(query)
        setSelectedPage(pageNum)
    }

    const handlePagination = () => {
        const numberOfPagesToShow = numberOfPages > 7 ? 7 : numberOfPages
        const siblingsEachSide = Math.floor(numberOfPagesToShow / 2)
        const firstNumberToShow = selectedPage - siblingsEachSide >= 1 ? selectedPage - siblingsEachSide : 1
        const lastNumberToShow = selectedPage + siblingsEachSide

        setShowCollapseDots(selectedPage + siblingsEachSide + 1 < numberOfPages)
        setNumberOfPagesShown(numberOfPagesToShow)

        // logic to do not exceed the number of pages
        if (lastNumberToShow > numberOfPages) setFirstNumber(numberOfPages - numberOfPagesToShow + 1)
        else setFirstNumber(firstNumberToShow)

        setLastNumber(lastNumberToShow)
    }


    return (
        <div className='pagination-holder'>
            {selectedPage > 1 && <HiChevronLeft color='#68737d' onClick={() => handleSelectPage(selectedPage - 1)} />}
            {Array(NumberOfPagesShown).fill('').map((item, index) => {
                const pageNum = index + firstNumber
                return (
                    <div key={pageNum} className={`page-number-holder ${pageNum === selectedPage && 'selected'}`} onClick={() => handleSelectPage(pageNum)}>
                        <p className='page-number'>{pageNum}</p>
                    </div>
                )
            })}
            {showCollapseDots && <div className='page-number-holder'>
                <p className='page-number'>...</p>
            </div>}
            {lastNumber < numberOfPages && <div className='page-number-holder' onClick={() => handleSelectPage(numberOfPages)}>
                <p className='page-number'>{numberOfPages}</p>
            </div>}
            {selectedPage < numberOfPages && <HiChevronRight size={15} color='#68737d' onClick={() => handleSelectPage(selectedPage + 1)} />}
        </div>
    )
}

export default Pagination