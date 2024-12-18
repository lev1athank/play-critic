"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useDispatch } from 'react-redux';
import { useActions } from "@/hooks/useActions";

export function UserField() {
  const { iSregShow, iSAuth } = useTypeSelector((state) => state.regField);
  const { setIsRegShow } = useActions()

  return (
    <div className={styles.userField}>
      {/* <span className={styles.inBtn}>Войти</span> */}
      {!iSAuth ? (
        <span className={styles.regBtn} onClick={()=>setIsRegShow(true)}>Регистрация</span>
      ) : (
        <div className={styles.account}>
          <span className={styles.userName}>leviathan</span>
          <Image
            alt="avatar"
            src={"/logo.svg"}
            width={64}
            height={64}
            className={styles.avatar}
          />
        </div>
      )}
    </div>
  );
}

export default UserField;
