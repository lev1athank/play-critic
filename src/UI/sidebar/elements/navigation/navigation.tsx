"use client";

import { btnNavSidebar } from "@/types/TnavBtnSidebat";
import NavBtnSidebar from "./elements/NavBtnSidebar";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { usePathname } from "next/navigation";

const Navigation = () => {
    const [activeBtn, setActiveBtn] = useState<number>(0);

    const lenta: btnNavSidebar = {
        name: "Лента",
        path: "/",
        icon: "lenta",
    };
    const library: btnNavSidebar = {
        name: "Библиотека",
        path: "/library",
        icon: "profile",
    };
    const FAQ: btnNavSidebar = {
        name: "FAQ",
        path: "/",
        icon: "FAQ",
    };

    const { userData } = useTypeSelector((state) => state.regField);

    const [btnNavBar, setbtnNavBar] = useState<btnNavSidebar[]>([
        lenta,
        library,
        FAQ,
    ]);
    const clickBtnNav = (id: number) => {
        setActiveBtn(id);
    };

    useEffect(() => {
        const newLibrary = {
            ...library,
            path: `/library/${userData.login || ""}`,
        };

        
        const newBtnNavBar = [lenta, newLibrary, FAQ];
        setbtnNavBar(newBtnNavBar);
    }, [userData]);
    
    

    const pathname = usePathname();

    useEffect(() => {   
        const url = "/" + pathname.split("/")[1];
        const index = [lenta, library, FAQ].findIndex(({ path }) => path === url);
        if (index !== -1) setActiveBtn(index);
    }, [pathname]);
    
    return (
        <div className={styles.navField}>
            {btnNavBar.map((el, i) => (
                <NavBtnSidebar
                    data={el}
                    isActive={i == activeBtn}
                    fan={() => clickBtnNav(i)}
                    key={i}
                />
            ))}
        </div>
    );
};

export default Navigation;
