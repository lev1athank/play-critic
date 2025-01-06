import Image from "next/image";
import styles from "./style.module.scss";

const SearchGame = () => {
    return (
        <div className={styles.searchGame}>
            <input type="text" placeholder="Найти игру"/>
            <button className={styles.btnSearch}>
                <Image
                    src={"/search.svg"}
                    width={34}
                    height={34}
                    alt="search"
                    style={{
                        fill: "white",
                    }}
                />
            </button>
            <button className={styles.btnFilter}>
            <Image
                    src={"/filter.svg"}
                    width={34}
                    height={34}
                    alt="search"
                    style={{
                        marginTop: "5px",
                        fill: "white",
                    }}
                />
                Фильтр
            </button>
        </div>
    );
};

export default SearchGame;
