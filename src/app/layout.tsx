"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";

import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";
import RegField from "@/UI/notificationRegistrField/RegField";

import "./globals.css";
import { Nunito } from "next/font/google";
import AuthChecker from "./providers/AuthChecker";
import { ToastContainer } from "react-toastify";
import ProfileSettings from "@/UI/profileSettings/ProfileSettings";
import GamePreview from "@/UI/gamePreview/GamePreview";
import FormNewGame from "@/UI/formNewGame/FormNewGame";

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
          <div style={{ height: "100%", width: "calc(100% - 300px)", marginLeft: "300px" }}>
            {children}
          </div>
          <GamePreview />
          <FormNewGame />
          <RegField />
          {/* <ProfileSettings /> */}
          <ToastContainer />

        </Provider>
      </body>
    </html>
  );
}
