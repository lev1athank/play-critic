import type { Metadata } from "next";

import "./globals.css";
import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";

import { Nunito } from 'next/font/google'
import RegField from "@/UI/notificationRegistrField/regField";

export const nunito = Nunito({
  weight: "400",
  style: 'normal',
  subsets: ['latin'],
  variable: '--mainFont'
})

export const metadata: Metadata = {
  title: "play critic",
  description: "play critic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={nunito.className}>
        <Header />
        <Sidebar />
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <div style={{
            width: "300px",
            height: "100%"
          }}></div>
          {children}
        </div>
        <RegField />
      </body>
    </html>
  );
}
