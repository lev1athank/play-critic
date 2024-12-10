'use client'
import Image from "next/image"
import styles from './style.module.scss'
import { Lemon } from 'next/font/google'

const lemon = Lemon({
    weight: "400",
    style: "normal",
    subsets: ["latin"]
})

const Logo = () => {
    return (
        <div className={styles.headLogo}>
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
            <div className={`${styles.siteName} ${lemon.className}`}>PlayCritic</div>
        </div>
    )
}

export default Logo