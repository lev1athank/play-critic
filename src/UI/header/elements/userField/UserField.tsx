"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/tool/axiosClient";

export function UserField() {
    const { iSregShow, iSAuth, userData } = useTypeSelector((state) => state.regField);
    const { setIsRegShow } = useActions();
    const account = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      account.current?.addEventListener('click', (e: MouseEvent)=>{
        account.current?.classList.toggle(styles.active)
        e.stopPropagation();
        
      })

      document.addEventListener('click', ()=>{
        account.current?.classList.remove(styles.active)
      })
    })

    const exit = (e: React.MouseEvent<HTMLSpanElement>) => {
        console.log("gGGG");
        
        apiClient.get('/auth/logout')
    }
    

    return (
        <div className={styles.userField}>
            {!iSAuth && !userData.login ? (
                <span
                    className={styles.regBtn}
                    onClick={() => setIsRegShow(true)}
                >
                    Регистрация
                </span>
            ) : (
                <div className={styles.account} ref={account}>
                    <span className={styles.userData}>
                        <span className={styles.userName}>
                            {userData.login}
                        </span>
                        <Image
                            alt="avatar"
                            src={"/logo.svg"}
                            width={64}
                            height={64}
                            className={styles.avatar}
                        />
                    </span>
                    <div className={styles.userPanel}>
                        <span>Настройка</span>
                        <span onClick={(e) => exit(e)}>Выйти</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserField;
