'use client'
import { useActions } from '@/hooks/useActions'
import styles from './style.module.scss'
import { useTypeSelector } from '@/hooks/useTypeSelector'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const NewGame = () => {
  const { toggleEditOrAdd } = useActions()
  const { userData } = useTypeSelector(
    (state) => state.regField
  );
  const [login, setLogin] = useState<string>("")

  useEffect(() => {
    setLogin(window.location.pathname.split('/')[2])
  })



  if (userData?.login !== login) return (
    <div className={styles.otherUserContainer}>
      <div className={styles.otherUser}>Библиотека пользователя: <b>{login}</b></div>
      <Link className={styles.btnNewGame} href={`/profile/${login}`}>Открыть профиль</Link>
    </div>
  );



  return (
    <button className={styles.btnNewGame} onClick={() => toggleEditOrAdd(true)}>Добавить игру +</button>
  )
}

export default NewGame