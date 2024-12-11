'use client'
import { btnNavSidebar } from "@/types/TnavBtnSidebat";
import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";

const NavBtnSidebar: React.FC<{
  data: btnNavSidebar;
  isActive: boolean;
  fan: () => void;
}> = ({ data, isActive, fan }) => {
  return (
    <Link
      href={data.path}
      className={`${styles.navBtn} ${isActive ? styles.active : ""}`}
      onClick={fan}
    >
      <Image
        src={"/iconSidebar/" + data.icon + ".svg"}
        alt="icon"
        width={38}
        height={38}
      />
      {data.name}
    </Link>
  );
};

export default NavBtnSidebar;
