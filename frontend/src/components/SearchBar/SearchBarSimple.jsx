import { useState } from 'react'

const SearchBarSimple = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Ricerca:', searchQuery)
  }

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}
    >
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type='text'
          placeholder='Dove vuoi andare?'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            flex: '1',
            fontSize: '16px'
          }}
        />
        <button
          type='submit'
          style={{
            background: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Cerca
        </button>
      </form>
    </div>
  )
}

export default SearchBarSimple
