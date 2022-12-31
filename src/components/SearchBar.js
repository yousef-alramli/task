import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../assets/scss/searchBar.scss'

const SearchBar = ({ actionTypes, applicationTypes }) => {
    const [logId, setLogId] = useState('')
    const [actionType, setActionType] = useState('')
    const [applicationType, setApplicationType] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectDate, setSelectDate] = useState('')
    const [applicationId, setApplicationId] = useState('')

    const [query, setQuery] = useSearchParams();

    const handlePushParams = (name, value) => {
        query.delete(name)
        query.append(name, value)
    }

    const validateDates = (fromDate, toDate) => {
        if (!fromDate && toDate || fromDate && !toDate) {
            alert('You must add both dates (from date and to date) or none of them')
            return false
        }

        const from = new Date(fromDate)
        const to = new Date(toDate)
        if (from > to) {
            alert('invalid dates to date must be larger than from date')
            return false
        }
        return true
    }

    const handleSubmit = () => {
        if (!validateDates(fromDate, toDate)) {
            return
        }
        
        logId ? handlePushParams('logId', logId) : query.delete('logId')
        actionType ? handlePushParams('actionType', actionType) : query.delete('actionType')
        applicationType ? handlePushParams('applicationType', applicationType) : query.delete('applicationType')
        fromDate ? handlePushParams('fromDate', fromDate) : query.delete('fromDate')
        toDate ? handlePushParams('toDate', toDate) : query.delete('toDate')
        selectDate ? handlePushParams('selectDate', selectDate) : query.delete('selectDate')
        applicationId ? handlePushParams('applicationId', applicationId) : query.delete('applicationId')

        handlePushParams('page', 1)
        setQuery(query)
    }

    return (
        <div className='search-container'>
            <div className='input-holder'>
                <label className='search-label'>Log ID</label>
                <input
                    value={logId}
                    onChange={(e) => setLogId(e.target.value)}
                    className='search-input' placeholder='e.g. 000000000'
                />
            </div>

            <div className='input-holder'>
                <label className='search-label'>Action type</label>
                <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className='search-input'
                >
                    <option value=''></option>
                    {actionTypes.map((action, index) => (
                        <option key={`${action}${index}`} value={action}>{action}</option>
                    ))}
                </select>
            </div>

            <div className='input-holder'>
                <label className='search-label'>Application type</label>
                <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                    className='search-input'
                >
                    {applicationTypes.map((app, index) => (
                        <option key={`${app}${index}`} value={app}>{app}</option>
                    ))}
                </select>
            </div>

            <div className='input-holder'>
                <label className='search-label'>From Date</label>
                <input
                    value={fromDate}
                    type='date'
                    onChange={(e) => setFromDate(e.target.value)}
                    className='search-input'
                    placeholder='Select Date'
                />
            </div>

            <div className='input-holder'>
                <label className='search-label'>To Date</label>
                <input
                    value={toDate}
                    type='date'
                    onChange={(e) => setToDate(e.target.value)}
                    className='search-input'
                    placeholder='Select Date'
                />
            </div>

            <div className='input-holder'>
                <label className='search-label'>Select date</label>
                <input
                    value={selectDate}
                    onChange={(e) => setSelectDate(e.target.value)}
                    className='search-input'
                />
            </div>

            <div className='input-holder'>
                <label className='search-label'>Application ID</label>
                <input
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className='search-input'
                    placeholder='e.g. 000000/0000'
                />
            </div>

            <div className='input-holder submit-button-holder'>
                <button onClick={handleSubmit} className='search-input submit-button'>Search Logger</button>
            </div>
        </div>
    )
}

export default SearchBar