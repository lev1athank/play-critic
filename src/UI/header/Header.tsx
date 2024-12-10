'use client'
import Search from './elements/search/Search'
import styles from './style.module.scss'
const Header = () => {

  return (
    
    <header className={styles.header}>
      <Search />
    </header>
  )
}

export default Header