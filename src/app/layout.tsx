import type { Metadata } from "next";

import "./globals.css";
import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";

import { Nunito } from 'next/font/google'

const nunito = Nunito({
  weight: "400",
  style: 'normal',
  subsets: ['latin'],
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
        {children}
      </body>
    </html>
  );
}
