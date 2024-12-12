'use client'
import Image from 'next/image'
import styles from './style.module.scss'

export function UserField() {
  return (
    <div className={styles.userField}>
      {/* <span className={styles.inBtn}>Войти</span> */}
      <span className={styles.regBtn}>Регистрация</span>
      {/* <div className={styles.account}>
        <span className={styles.userName}>leviathan</span>
        <Image 
          alt='avatar'
          src={'/logo.svg'}
          width={64}
          height={64}
          className={styles.avatar}
        />
      </div> */}
    </div>
  )
}

export default UserField