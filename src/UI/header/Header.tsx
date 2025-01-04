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

  useEffect(() => {
    (async () =>{
      try {
        const data = await apiClient.get("/auth/verify"); // Токены автоматически обновятся в куках
        setUserData(data.data)
        console.log(data.data);
        
      } catch (error) {
        clearUserData()
      }
    })()
    
}, []);
  return (
    
    <header className={styles.header}>
      <Search />
      <UserField />
    </header>
  )
}

export default Header