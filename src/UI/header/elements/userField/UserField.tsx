"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/tool/axiosClient";
import Link from "next/link";

export function UserField() {
    const { iSregShow, iSAuth, userData } = useTypeSelector(
        (state) => state.regField
    );
    const { setIsRegShow } = useActions();
    const account = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const accountElem = account.current;

        const handleAccountClick = (e: MouseEvent) => {
            accountElem?.classList.toggle(styles.active);
        };

        const handleDocumentClick = (e: MouseEvent) => {
            if (!accountElem?.contains(e.target as Node)) {
                accountElem?.classList.remove(styles.active);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        accountElem?.addEventListener("click", handleAccountClick);

    });

    const exit = () => {
        apiClient.get("/auth/logout");
        location.reload()
    };

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
                        <Link href={`/profile/${userData.login}`}>профиль</Link>
                        <span onClick={() => exit()}>Выйти</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserField;
