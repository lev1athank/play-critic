'use client'
import styles from './style.module.scss'
import { useEffect, useRef, useState } from 'react'
import apiClient from '@/tool/axiosClient'
import { FaSearch, FaUser } from "react-icons/fa" 
import { FaXmark } from "react-icons/fa6";
import { useRouter } from 'next/navigation'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setResults([])
        setShowDropdown(false)
        return
      }
      try {
        const response = await apiClient.get(`/api/getAllUsersName?userName=${query}`)
        setResults(response.data.usersName)
        setShowDropdown(true)
      } catch (err) {
        console.error('Ошибка поиска:', err)
        setResults([])
      }
    }

    const delayDebounce = setTimeout(fetchData, 500)
    return () => clearTimeout(delayDebounce)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (name: string) => {
    setQuery(name)
    router.push(`/profile/${name}`)  
    setShowDropdown(false)
  }

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={styles.search}>
        <FaSearch className={styles.icon} size={'1.8rem'}/>
        <input
          type="text"
          className={styles.inputSearch}
          placeholder="Найти пользователя"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setShowDropdown(true)}
        />
        {query && (
          <FaXmark
            className={styles.clearIcon}
            onClick={() => {
              setQuery('')
              setResults([])
              setShowDropdown(false)
            }}
          />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((item, i) => (
            <li key={i} className={styles.dropdownItem} onClick={() => handleSelect(item)}>
              <span>{item}</span>
              <FaUser />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search
