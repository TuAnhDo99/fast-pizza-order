import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchOrder() {
    const [querry, setQuerry] = useState('')
    const navigate = useNavigate()
    function handleSubmit(e) {
        e.preventDefault()
        if (!querry) return
        navigate(`/order/${querry}`)
        setQuerry('')
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Search order #"
                value={querry}
                onChange={(e) => setQuerry(e.target.value)}
                className="w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm outline-none transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:w-64 sm:focus:w-72"
            />
        </form>
    )
}

export default SearchOrder
