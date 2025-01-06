"use client";

import { Provider, useDispatch } from "react-redux";
import "./globals.css";
import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";

import { Nunito } from "next/font/google";
import RegField from "@/UI/notificationRegistrField/RegField";
import { store } from "../store/store";

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
    return (
        <html lang="en">
            <body className={nunito.className}>
                <Provider store={store}>
                    <Header />
                    <Sidebar />
                    <div
                        style={{
                            height: "100%",
                            width: "calc(100% - 300px)",
                            marginLeft: "300px",
                        }}
                    >
                        {children}
                    </div>
                    <RegField />
                </Provider>
            </body>
        </html>
    );
}
