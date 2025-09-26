"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";

import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";

import "./globals.css";
import { Nunito } from "next/font/google";
import dynamic from "next/dynamic";
import AuthChecker from "./providers/AuthChecker";

const GamePreview = dynamic(() => import("@/UI/gamePreview/GamePreview"), {
  ssr: false,
});
const FormNewGame = dynamic(() => import("@/UI/formNewGame/FormNewGame"), {
  ssr: false,
});
const RegField = dynamic(() => import("@/UI/notificationRegistrField/RegField"), {
  ssr: false,
});
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer), 
  { ssr: false, loading: () => null }
);

export const nunito = Nunito({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--mainFont",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Provider store={store}>
          <AuthChecker />
          <Header />
          <Sidebar />
          <div style={{ height: "100%", width: "calc(100% - 300px)", marginLeft: "300px", position: "relative" }}>
            {children}
          </div>
          <GamePreview />
          <FormNewGame />
          <RegField />
          <ToastContainer />

        </Provider>
      </body>
    </html>
  );
}
