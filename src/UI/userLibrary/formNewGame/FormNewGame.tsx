import React from "react";
import styles from "./style.module.scss";
const FormNewGame = () => {
    return (
        <div className={styles.background}>
            <div className={styles.formNewGame}>
                <div className={styles.gameDataField}>
                    <div className={styles.gameImage}></div>
                    <div className={styles.gameData}>
                        <div className={styles.searchGame}>
                            <span className={styles.searchTitle}>
                                Выберите игру
                            </span>
                            <input
                                className={styles.search}
                                placeholder="Названеие игры"
                            />
                        </div>
                        <div className={styles.recallField}>
                        <span className={styles.recallTitle}>Отзыв</span>
                        <textarea className={styles.recall} maxLength={180} placeholder="Кратко раскожи свое мнение"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormNewGame;
