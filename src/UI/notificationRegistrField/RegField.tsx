"use client";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./style.module.scss";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import z from "zod";
import Image from "next/image";
import apiClient from "@/tool/axiosClient";

const RegField = () => {
    const [typeFormAuth, setTypeFormAuth] = useState<boolean>(true);
    const { iSregShow } = useTypeSelector((state) => state.regField);
    const { setIsRegShow, setIsAuth } = useActions();
    const background = useRef<HTMLDivElement>(null);
    const [alerts, setAlerts] = useState<string[]>([]);

    const nullData = {
        login: "",
        password: "",
        rePassword: "",
    };

    const [dataReg, setDataReg] = useState({
        login: "",
        password: "",
        rePassword: "",
    });

    const data = z.object({
        login: z.string().min(1, { message: "логин отсутствует" }),
        password: z
            .string()
            .min(6, { message: "пароль должен быть минимум из 6 символов" }),
    });

    const sendSubmit = async (form: FormEvent) => {
        form.preventDefault();
        const validation = data.safeParse(dataReg);
        const newAlerts: string[] = [];

        if (validation.error) {
            newAlerts.push(...validation.error.errors.map((el) => el.message));
        }

        if (typeFormAuth && dataReg.password !== dataReg.rePassword) {
            newAlerts.push("Пароли не совпадают");
        }

        setAlerts(newAlerts);

        if (newAlerts.length > 0) return;

        try {
            await apiClient.post(`/auth/${typeFormAuth ? "singup" : "login"}`, {
                ...dataReg,
            });
            setIsAuth(true);
            setIsRegShow(false);
            location.reload();
        } catch (err) {
            console.log(err);

            setAlerts(["Ошибка при регистрации"]);
        }
    };

    const setData = (e: ChangeEvent<HTMLInputElement>) => {
        setDataReg((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    if (!iSregShow) return <></>;
    else
        return (
            <div
                className={styles.background}
                ref={background}
                onClick={() => {
                    setIsRegShow(false);
                    setDataReg(nullData);
                    setAlerts([]);
                }}
            >
                <div className={styles.authField}>
                    <div
                        className={styles.regField}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={styles.closeBtn}
                            onClick={() => {
                                setIsRegShow(false);
                                setDataReg(nullData);
                                setAlerts([]);
                            }}
                        >
                            <Image
                                alt="close"
                                src={"/close.svg"}
                                width={46}
                                height={46}
                                className={styles.avatar}
                            />
                        </div>
                        <form className={styles.form} onSubmit={sendSubmit}>
                            <span className={styles.titleForm}>
                                {typeFormAuth ? "Регистрация" : "Вход"}
                            </span>
                            <div className={styles.inputData}>
                                <span>
                                    <label htmlFor="login">Логин</label>
                                    <input
                                        type="text"
                                        name="login"
                                        value={dataReg.login}
                                        required
                                        min={1}
                                        max={30}
                                        onChange={setData}
                                    />
                                </span>
                                <span>
                                    <label htmlFor="password">Пароль</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={dataReg.password}
                                        required
                                        min={6}
                                        onChange={setData}
                                    />
                                </span>
                                {typeFormAuth && (
                                    <span>
                                        <label htmlFor="rePassword">
                                            Подтвердите пароль
                                        </label>
                                        <input
                                            type="password"
                                            name="rePassword"
                                            value={dataReg.rePassword}
                                            required
                                            min={6}
                                            onChange={setData}
                                        />
                                    </span>
                                )}
                            </div>
                            <button type="submit" className={styles.btnForm}>
                                {typeFormAuth ? "Создать" : "Войти"}
                            </button>
                            <span
                                className={styles.swapForm}
                                onClick={() => {
                                    setTypeFormAuth((state) => !state);
                                    setDataReg(nullData);
                                    setAlerts([]);
                                }}
                            >
                                {typeFormAuth
                                    ? "есть аккаунт"
                                    : "создать аккаунт"}
                            </span>
                        </form>
                    </div>
                    <div className={styles.alertField}>
                        {alerts.length > 0 &&
                            alerts.map((alert, index) => (
                                <span
                                    key={index}
                                    className={styles.alert}
                                    style={{
                                        animationDelay: `${index * 0.2}s`,
                                    }}
                                >
                                    {alert}
                                </span>
                            ))}
                    </div>
                </div>
            </div>
        );
};

export default RegField;
