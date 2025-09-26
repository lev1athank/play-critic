"use client";
import { useRef, useState, FormEvent, ChangeEvent } from "react";
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const nullData = {
    login: "",
    userName: "",
    password: "",
    rePassword: "",
  };

  const [dataReg, setDataReg] = useState(nullData);

  const data = z.object({
    login: z.string().min(2, { message: "логин должен быть минимум из 2 символов" }).max(30, { message: "логин не должен превышать 30 символов" }),
    password: z.string().min(6, { message: "пароль должен быть минимум из 6 символов" }).max(100, { message: "пароль не должен превышать 100 символов" }),
  });

  const sendSubmit = async (form: FormEvent) => {
    form.preventDefault();
    const validation = data.safeParse(dataReg);
    const newAlerts: string[] = [];
    const newFieldErrors: { [key: string]: boolean } = {};

    if (validation.error) {
      validation.error.errors.forEach((el) => {
        newAlerts.push(el.message);
        newFieldErrors[el.path[0]] = true;
      });
    }

    if (typeFormAuth && dataReg.password !== dataReg.rePassword) {
      newAlerts.push("Пароли не совпадают");
      newFieldErrors.rePassword = true;
    }

    if (typeFormAuth) {
      console.log(typeFormAuth);
      
      if(dataReg.userName.length < 3)
            newAlerts.push("Имя пользователя должен быть минимум из 3 символов");
            newFieldErrors.userName = true;

      if(dataReg.userName.length > 30)
            newAlerts.push("Имя пользователя не должно превышать 30 символов");
            newFieldErrors.userName = true;
      
    }

    setAlerts(newAlerts);
    setFieldErrors(newFieldErrors);

    if (newAlerts.length > 0) return;

    try {
      await apiClient.post(`/auth/${typeFormAuth ? "signup" : "login"}`, {
        ...dataReg,
      });

      setIsAuth(true);
      setIsRegShow(false);
      location.reload();
    } catch (err) {
      console.log(err);

      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data?.error
      ) {
        setAlerts([(err as { response: { data: { error: string } } }).response.data.error]);
      } else {
        setAlerts(["Произошла ошибка. Попробуйте еще раз."]);
      }
    }
  };

  const setData = (e: ChangeEvent<HTMLInputElement>) => {
    setDataReg((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  if (!iSregShow) return null;

  return (
    <div
      className={styles.background}
      ref={background}
    >
      <div className={styles.authField}>
        <div className={styles.regField}>
          <div
            className={styles.closeBtn}
            onClick={() => {
              setIsRegShow(false);
              setDataReg(nullData);
              setAlerts([]);
              setFieldErrors({});
            }}
          >
            <Image alt="close" src="/close.svg" width={30} height={30} />
          </div>

          <form className={styles.form} onSubmit={sendSubmit}>
            <h2 className={styles.titleForm}>{typeFormAuth ? "Регистрация" : "Вход"}</h2>

            <div className={styles.inputGroup}>
              <label>
                <span>Логин</span>
                <input
                  type="text"
                  name="login"
                  value={dataReg.login}
                  onChange={setData}
                  autoFocus
                  autoComplete="username"
                  placeholder="Введите логин"
                  className={fieldErrors.login ? styles.error : ""}
                />
              </label>

              {
                typeFormAuth && (
                  <label>
                    <span>Имя пользователя</span>
                    <input
                      type="text"
                      name="userName"
                      value={dataReg.userName}
                      onChange={setData}
                      autoFocus
                      autoComplete="username"
                      placeholder="Введите имя пользователя"
                      className={fieldErrors.userName ? styles.error : ""}
                    />
                  </label>
                )
              }

              <label>
                <span>Пароль</span>
                <input
                  type="password"
                  name="password"
                  value={dataReg.password}
                  onChange={setData}
                  autoComplete={typeFormAuth ? "new-password" : "current-password"}
                  placeholder="Введите пароль"
                  className={fieldErrors.password ? styles.error : ""}
                />
              </label>

              {typeFormAuth && (
                <label>
                  <span>Подтвердите пароль</span>
                  <input
                    type="password"
                    name="rePassword"
                    value={dataReg.rePassword}
                    onChange={setData}
                    placeholder="Повторите пароль"
                    className={fieldErrors.rePassword ? styles.error : ""}
                  />
                </label>
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
                setFieldErrors({});
              }}
            >
              {typeFormAuth ? "Уже есть аккаунт?" : "Создать новый аккаунт"}
            </span>
          </form>

          <div className={styles.alertField}>
            {alerts.map((alert, index) => (
              <span key={index} className={styles.alert} style={{ animationDelay: `${index * 0.2}s` }}>
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegField;
