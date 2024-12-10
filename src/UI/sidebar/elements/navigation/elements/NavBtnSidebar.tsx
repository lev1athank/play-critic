import { btnNavSidebar } from '@/types/TnavBtnSidebat'
import styles from './style.module.scss'


const NavBtnSidebar = (prop:btnNavSidebar) => {
  return (
    <button className={styles.navBtn}>
        {prop.name}
    </button>
  )
}

export default NavBtnSidebar