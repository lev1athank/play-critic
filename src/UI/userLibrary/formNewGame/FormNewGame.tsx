'use client'
import React, { useState } from "react";
import styles from "./style.module.scss";
import Image from 'next/image';
const FormNewGame = () => {
    const [imageGame, setImageGame] = useState<string>('')

    return (
        <div className={styles.background}>
            <div className={styles.formNewGame}>
                <div className={styles.gameDataField}>
                    <div className={styles.gameImage}>
                        {
                            imageGame ? <Image 
                            src={imageGame}
                            width={200}
                            height={250}
                            alt="game image"
                        /> : <Image 
                        src={"/gamepa in img.svg"}
                        width={100}
                        height={100}
                        alt="game image"
                    />
                        }
                        
                    </div>  
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
                    <div className={styles.scoreField}></div>
                </div>
            </div>
        </div>
    );
};

export default FormNewGame;
