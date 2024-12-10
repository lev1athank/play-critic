'use client'
import Logo from './elements/logo/Logo'
import Navigation from './elements/navigation/navigation'
import styles from './style.module.scss'
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <Navigation />
    </div>
  )
}

export default Sidebar