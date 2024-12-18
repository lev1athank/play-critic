"use client";
import { useRef, useState, useEffect } from "react";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
const RegField = () => {

  const [isForm, setIsForm] = useState(false);
  const { iSregShow } = useTypeSelector(state=>state.regField)
  const { setIsRegShow } = useActions()
  const background = useRef<HTMLDivElement>(null)
  

  
  return (
    <div className={styles.background} ref={background} style={!iSregShow ? {display:"none"} : {}} onClick={()=>setIsRegShow(false)}>
      <div className={styles.regField} onClick={(e) => e.stopPropagation()}>
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
              <label htmlFor="repitPassword">Повторите пароль</label>
              <input type="password" name="repitPassword" />
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
