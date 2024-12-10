import { btnNavSidebar } from '@/types/TnavBtnSidebat'
import NavBtnSidebar from './elements/NavBtnSidebar'
import styles from './style.module.scss'



const btn:btnNavSidebar[] = [
    {
        name: 'Лента',
        path: '/'
    },
    {
        name: 'Библиотека',
        path: '/'
    },
    {
        name: 'FAQ',
        path: '/'
    }
]

const Navigation = () => {
  return (
    <div className={styles.navField}>
        {
            btn.map((el, i)=><NavBtnSidebar {...el} key={i}/>)
        }

    </div>
  )
}

export default Navigation