'use client';

import { Provider } from "react-redux";
import "./globals.css";
import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";

import { Nunito } from "next/font/google";
import RegField from "@/UI/notificationRegistrField/RegField";
import { store } from "../store/store";
import { useEffect } from "react";
import { verifyUser } from "@/store/favorites/registr.slice";

export const nunito = Nunito({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--mainFont",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    // Проверяем токен при загрузке
    store.dispatch(verifyUser());
}, []);
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Provider store={store}>
          <Header />
          <Sidebar />
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div
              style={{
                width: "300px",
                height: "100%", 
              }}
            ></div>
            {children}
          </div>
          <RegField />
        </Provider>
      </body>
    </html>
  );
}
