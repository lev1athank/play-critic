'use client'

import { btnNavSidebar } from '@/types/TnavBtnSidebat'
import NavBtnSidebar from './elements/NavBtnSidebar'
import styles from './style.module.scss'
import { useState } from 'react'



const btn:btnNavSidebar[] = [
    {
        name: 'Лента',
        path: '/',
        icon: 'lenta'
    },
    {
        name: 'Библиотека',
        path: '/user/leviathan',
        icon: 'profile'
    },
    {
        name: 'FAQ',
        path: '/',
        icon: 'FAQ'
    }
]





const Navigation = () => {
    const [activeBtn, setActiveBtn] = useState<number>(1)
    const clickBtnNav = (id:number) => {
        setActiveBtn(id)
    }

  return (
    <div className={styles.navField}>
        {
            btn.map((el, i)=><NavBtnSidebar data={el} isActive={i == activeBtn} fan={()=>clickBtnNav(i)} key={i}/>)
        }

    </div>
  )
}

export default Navigation