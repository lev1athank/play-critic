'use client'
import { useActions } from '@/hooks/useActions'
import styles from './style.module.scss'
import { useTypeSelector } from '@/hooks/useTypeSelector'
import { useEffect, useState } from 'react'

const NewGame = () => {
	const { toggleEditOrAdd } = useActions()
  const { userData } = useTypeSelector(
    (state) => state.regField
  );
  const [userName, setUserName] = useState<string>("")
  
  useEffect(() => {
    setUserName(window.location.pathname.split('/')[2])
  })
  


  if (userData.login !== userName) return (<div className={styles.otherUser}>Библиотека пользователя: { userName }</div>);
  


  return (
    <button className={styles.btnNewGame} onClick={()=>toggleEditOrAdd(true)}>Добавить игру +</button>
  )
}

export default NewGame