import Image from "next/image"
import styles from './style.module.scss'
const Logo = () => {
    return (
        <div className={styles.headLogo}>
            {/* <Image src="" alt="" /> */}
            <div className={styles.img}></div>
            <div className={styles.siteName}>PlayCritic</div>
        </div>
    )
}

export default Logo