"use client";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import { useEffect, useRef, useCallback, useState, use } from "react";
import apiClient from "@/tool/axiosClient";
import Link from "next/link";
import Image from "next/image";

export function UserField() {
    const { userData } = useTypeSelector(
        (state) => state.regField
    );

    
    const { setIsRegShow } = useActions();
    const menu = useRef<HTMLDivElement>(null)
    const [imgUrl, setImgUrl] = useState<string>('')

    const toggleMenu = useCallback(() => {
        const menuState = menu?.current?.classList.toggle(styles.active);

        if (menuState) {
            const handleClick = (el: MouseEvent) => {
                if (menu.current && !menu.current.contains(el.target as Node)) {
                    menu.current.classList.remove(styles.active);
                    document.removeEventListener("click", handleClick);
                }
            };

            document.addEventListener("click", handleClick);
        }
    }, [menu]);


    const exit = () => {
        apiClient.get("/auth/logout");
        location.reload()
    };

    const fetchAvatar = useCallback(async () => {
        if (userData?.lastAvatarIMG)
            return setImgUrl(userData.lastAvatarIMG);

        if (userData?._id === undefined) {
            return;
        }


    }, [userData?._id, userData?.lastAvatarIMG]);

    useEffect(() => {
        fetchAvatar();
    }, [fetchAvatar]);

    return (
        <div className={styles.userField}>
            {userData === null ? (
                <span
                    className={styles.regBtn}
                    onClick={() => setIsRegShow(true)}
                >
                    Регистрация
                </span>
            ) : (
                <div className={styles.account} ref={menu} onClick={toggleMenu}>
                    <span className={styles.userData}>
                        <div className={styles.fieldUserName}>
                            <span className={styles.userName}>
                                {userData.userName}
                            </span>
                            <span className={styles.login}>
                                {userData.login}
                            </span>
                        </div>
                        {userData.avatar ? (<Image
                            alt="avatar"
                            src={`http://localhost:3452/img/uploads/avatar_${userData._id}`}
                            width={64}
                            height={64}
                            quality={75}
                            placeholder={'blur'}
                            blurDataURL={`http://localhost:3452/img/uploads/avatar_${userData._id}?w=10&h=10&q=10`}
                            className={styles.avatar}
                        />) : (
                            <div className={styles.avatarPlaceholder}>
                                {(() => {
                                    const words = userData.login.trim().split(" ");
                                    if (words.length === 1) {
                                        const name = words[0];
                                        return (name[0] + name[name.length - 1]).toUpperCase();
                                    } else {
                                        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                                    }
                                })()}
                            </div>
                        )}
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
