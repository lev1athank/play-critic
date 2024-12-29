"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import axios from "axios";
import { useEffect } from "react";
import Cookie from "js-cookie";


export async function UserField() {
  const { iSregShow, iSAuth } = useTypeSelector((state) => state.regField);
  const { setIsRegShow } = useActions()

  const awaitAxios = async (method:string):Promise<void> => {
    await axios(`http://localhost/auth/${method}`, {
      headers: {
        // Authorization: `Bearer ${}` 
      }
    })
  }
   
  //TODO
  useEffect(() => {
    const accessToken = Cookie.get('AccessToken')
    if(!accessToken) {
      const refreshToken = Cookie.get('RefreshToken')
      if(!refreshToken) return
      
    }
  }, [, iSAuth])
  

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
