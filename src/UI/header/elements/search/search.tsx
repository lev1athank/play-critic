'use client'
import styles from './style.module.scss'
import Image from 'next/image'
const Search = () => {
  return (
    <div className={styles.search}>
      <Image 
        src={'/search.svg'}
        width={34}
        height={34}
        alt='search'
        style={{
          marginLeft: "10px",
          fill: "var(--dark25)"
      }}
      />
      <input type="text"  className={styles.inputSearch} placeholder='Найти'/>
    </div>
  )
}

export default Search