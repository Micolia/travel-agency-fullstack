import { useState } from 'react'
import './searchBar.css'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    console.log({
      destination: searchQuery,
      startDate,
      endDate,
      budget
    })
  }

  return (
    <div className='search-bar'>
      <form onSubmit={handleSearch} className='search-form'>
        <div className='search-input-group'>
          <input
            type='text'
            placeholder='Dove vuoi andare?'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input destination'
          />
          <input
            type='date'
            placeholder='Data partenza'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='search-input date'
          />
          <input
            type='date'
            placeholder='Data ritorno'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='search-input date'
          />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className='search-input budget'
          >
            <option value=''>Budget</option>
            <option value='0-500'>€0 - €500</option>
            <option value='500-1000'>€500 - €1000</option>
            <option value='1000-2000'>€1000 - €2000</option>
            <option value='2000+'>€2000+</option>
          </select>
          <button type='submit' className='search-button'>
            🔍 Cerca
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
