"use client";
import { useState } from "react";
import styles from "./style.module.scss";
const RegField = () => {

  const [isForm, setIsForm] = useState(false);

  return (
    <div className={styles.background}>
      <div className={styles.regField}>
        <form className={styles.form}>
          <span className={styles.titleForm}>Регистрация</span>
          <div className={styles.inputData}>
            <span>
              <label htmlFor="login">Логин</label>
              <input type="text" name="login" />
            </span>
            <span>
              <label htmlFor="password">Пароль</label>
              <input type="password" name="password" />
            </span>
            <span>
              <label htmlFor="RepitPassword">Повторите пароль</label>
              <input type="password" name="RepitPassword" />
            </span>
          </div>
          <button type="button" className={styles.btnForm} onSubmit={()=>null}>Создать</button>
          <span className={styles.swapForm}>есть аккаунт</span>
        </form>
      </div>
    </div>
  );
};

export default RegField;
