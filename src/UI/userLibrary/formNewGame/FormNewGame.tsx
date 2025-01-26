"use client";

import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";

const FormNewGame = () => {
    const [imageGame, setImageGame] = useState<string>("");
    const [scores, setScores] = useState<{ [key: string]: number }>({}); // Для хранения значений всех ползунков
    const inputData = [
        { name: "Сюжет", id: "story" },
        { name: "Геймплей", id: "gameplay" },
        { name: "Оригинальность / Инновации", id: "originality" },
        { name: "Погружение / Атмосфера", id: "immersion" },
    ]
    const handleInput = (e: HTMLInputElement, id: string) => {
        const min = 0;
        const max = 10;
        const activeColor = "#9A5CD8";
        const inactiveColor = "#ffffff";
        const newValue = +e.value;
        const ratio = ((newValue - min) / (max - min)) * 100;

        // Изменяем стиль ползунка
        e.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;

        // Обновляем состояние соответствующего значения
        setScores((prev) => ({
            ...prev,
            [id]: newValue,
        }));
    };

    return (
        <div className={styles.background}>
            <div className={styles.formNewGame}>
                <div className={styles.gameDataField}>
                    <div className={styles.gameImage}>
                        {imageGame ? (
                            <Image
                                src={imageGame}
                                width={200}
                                height={250}
                                alt="game image"
                            />
                        ) : (
                            <Image
                                src={"/gamepa in img.svg"}
                                width={100}
                                height={100}
                                alt="game image"
                            />
                        )}
                    </div>
                    <div className={styles.gameData}>
                        <div className={styles.searchGame}>
                            <span className={styles.searchTitle}>
                                Выберите игру
                            </span>
                            <input
                                className={styles.search}
                                placeholder="Название игры"
                            />
                        </div>
                        <div className={styles.recallField}>
                            <span className={styles.recallTitle}>Отзыв</span>
                            <textarea
                                className={styles.recall}
                                maxLength={220}
                                placeholder="Кратко расскажи своё мнение"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className={styles.scoreField}>
                    {inputData.map((field) => (
                        <div key={field.id} className={styles.scoreInpField}>
                            <span className={styles.name}>{field.name}</span>
                            <input
                                className={styles.rangeScore}
                                type="range"
                                min={1}
                                max={10}
                                defaultValue={5}
                                onInput={(e) => handleInput(e.currentTarget, field.id)}
                            />
                            <span className={styles.valueScore}>
                                {scores[field.id] ?? 5}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormNewGame;
