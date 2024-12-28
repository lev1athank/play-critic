"use client";
import {
    useRef,
    useState,
    useEffect,
    ChangeEvent,
    FormEvent,
    FormEventHandler,
} from "react";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { useActions } from "@/hooks/useActions";
import z, { map } from "zod";
import axios, { AxiosResponse } from "axios";
import Cookie from "js-cookie";
import Image from "next/image";

const RegField = () => {
    const [typeFormAuth, setTypeFormAuth] = useState<boolean>(true);
    const { iSregShow } = useTypeSelector((state) => state.regField);
    const { setIsRegShow } = useActions();
    const background = useRef<HTMLDivElement>(null);
    const [alerts, setAlerts] = useState<string[]>();

    type a = {
        login: string;
        password: string;
        rePasswoed: string;
    };
    type Ttokens = { Access_token: string; Refresh_token: string };
    const nullData = {
        login: "",
        password: "",
        rePasswoed: "",
    };

    const [dataReg, setDataReg] = useState<{
        login: string;
        password: string;
        rePasswoed: string;
    }>(nullData);

    const data = z.object({
        login: z.string().min(1, {
            message: 'логин отсутствует'
        }),
        password: z.string().min(6, {
            message: 'пароль должен быть минимум из 6 символов'
        }),
    });

    const sendSubmit = async (form: FormEvent) => {
        const validation = data.safeParse(dataReg);
        setAlerts([])
        if (validation.error) 
            setAlerts(validation.error.errors.map((el) => el.message));
        if (dataReg.password !== dataReg.rePasswoed) 
            setAlerts((prev) => (prev ? [...prev, 'Пароли не совпадают'] : ['Пароли не совпадают']))

        if(validation.error || dataReg.password !== dataReg.rePasswoed) return
        console.log(alerts)
        try {
            const res = await axios.post("http://localhost:3452/auth/singup", {
                ...dataReg,
            });
            console.log(res.data);

            const tokens: Ttokens = res.data;
            Cookie.set("AccessToken", tokens.Access_token, { expires: 15 });
            Cookie.set("RefreshToken", tokens.Refresh_token, {
                expires: 15 * 24 * 60,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const setData = (e: ChangeEvent<HTMLInputElement>) => {
        setDataReg((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div
            className={styles.background}
            ref={background}
            style={!iSregShow ? { display: "none" } : {}}
            onClick={() => {
                setIsRegShow(false);
                setDataReg(nullData);
                setAlerts([])
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
                            setAlerts([])
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
                    <form className={styles.form}>
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
                                    required={true}
                                    min={1}
                                    max={30}
                                    onChange={(e) => setData(e)}
                                />
                            </span>
                            <span>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={dataReg.password}
                                    required={true}
                                    min={6}
                                    onChange={(e) => setData(e)}
                                />
                            </span>
                            {typeFormAuth ? (
                                <span>
                                    <label htmlFor="rePasswoed">
                                        Подтвердите пароль
                                    </label>
                                    <input
                                        type="password"
                                        name="rePasswoed"
                                        value={dataReg.rePasswoed}
                                        required={true}
                                        min={6}
                                        onChange={(e) => setData(e)}
                                    />
                                </span>
                            ) : (
                                <></>
                            )}
                        </div>
                        <button
                            type="button"
                            className={styles.btnForm}
                            onClick={sendSubmit}
                        >
                            {typeFormAuth ? "Создать" : "Войти"}
                        </button>
                        <span
                            className={styles.swapForm}
                            onClick={() => {
                                setTypeFormAuth((state) => !state);
                                setDataReg(nullData);
                                setAlerts([])
                            }}
                        >
                            {typeFormAuth ? "есть аккаунт" : "создать аккаунт"}
                        </span>
                    </form>
                </div>
                <div className={styles.alertField}>
                    {alerts?.map((alert, index) => (
                        <span key={index} className={styles.alert} style={{
                            animationDelay:`${index * 0.2}s`
                        }}>
                            {alert}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegField;
