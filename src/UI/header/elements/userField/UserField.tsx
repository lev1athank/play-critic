"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import { useEffect, useState } from "react";
export function UserField() {
    const { iSregShow, iSAuth, userData } = useTypeSelector((state) => state.regField);
    const { setIsRegShow } = useActions();

    console.log(userData, 112);
    
    
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
                <div className={styles.account}>
                    <span className={styles.userName}>{userData.login}</span>
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
