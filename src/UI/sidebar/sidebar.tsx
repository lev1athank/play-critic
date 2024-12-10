'use client'
import Logo from './elements/logo/Logo'
import styles from './style.module.scss'
const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Logo />
    </div>
  )
}

export default Sidebar