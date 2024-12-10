import type { Metadata } from "next";

import "./globals.css";
import Header from "@/UI/header/Header";
import Sidebar from "@/UI/sidebar/sidebar";


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
      <body>
        <Header />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
