'use client'
import Search from './elements/search/search'
import UserField from './elements/userField/UserField'
import styles from './style.module.scss'
const Header = () => {

  return (
    
    <header className={styles.header}>
      <Search />
      <UserField />
    </header>
  )
}

export default Header