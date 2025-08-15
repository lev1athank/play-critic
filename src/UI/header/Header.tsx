'use client'
import { useTypeSelector } from '@/hooks/useTypeSelector'
import Search from './elements/search/search'
import UserField from './elements/userField/UserField'
import styles from './style.module.scss'
import { useEffect } from 'react'
import apiClient from '@/tool/axiosClient'
import { useActions } from '@/hooks/useActions'
const Header = () => {
  const { setUserData, clearUserData } = useActions();


  return (
    
    <header className={styles.header}>
      <Search />
      <UserField />
    </header>
  )
}

export default Header