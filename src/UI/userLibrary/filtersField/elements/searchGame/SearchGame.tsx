"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useActions } from "@/hooks/useActions";
import { useState, useRef, useEffect } from "react";

const SearchGame = () => {
    const { filtersGameSlice } = useActions();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        story: 1,
        gameplay: 1,
        originality: 1,
        immersion: 1,
    });

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSliderChange = (key: keyof typeof filters, value: number) => {
        setFilters((prev) => {
            const updated = { ...prev, [key]: value };
            filtersGameSlice(updated);
            return updated;
        });
    };

    const resetFilter = (key: keyof typeof filters) => {
        setFilters((prev) => {
            const updated = { ...prev, [key]: 1 };
            filtersGameSlice(updated);
            return updated;
        });
    };

    const labels = {
        story: "Сюжет",
        gameplay: "Геймплей",
        originality: "Оригинальность",
        immersion: "Погружение",
    };

    const activeFilters = Object.entries(filters).filter(([, val]) => val > 1);

    return (
        <div className={styles.searchGame}>
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Найти игру"
                    onChange={(el) => filtersGameSlice({ nameGame: el.target.value })}
                />
                <div className={styles.activeFilters}>
                    {activeFilters.map(([key, val]) => (
                        <div
                            key={key}
                            className={styles.filterTag}
                            onClick={() => resetFilter(key as keyof typeof filters)}
                            title="Сбросить фильтр"
                        >
                            {labels[key as keyof typeof labels]}: {val}
                            <span className={styles.closeCross}>×</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.filterWrapper} ref={ref}>
                <button
                    className={styles.btnFilter}
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    <Image src={"/filter.svg"} width={24} height={24} alt="filter" />
                    Фильтр
                </button>

                {showFilters && (
                    <div className={styles.filterPopup}>
                        {Object.entries(filters).map(([key, value]) => {
                            // Вычисляем % заполнения для заливки трека
                            const percent = ((value - 1) / 9) * 100;
                            return (
                                <div className={styles.sliderWrapper} key={key}>
                                    <div className={styles.sliderHeader}>
                                        <span>{labels[key as keyof typeof labels]}</span>
                                        <span className={styles.sliderValue}>{value}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={value}
                                        onChange={(e) =>
                                            handleSliderChange(
                                                key as keyof typeof filters,
                                                Number(e.target.value)
                                            )
                                        }
                                        style={{
                                            background: `linear-gradient(to right, var(--purple) 0%, var(--purple) ${percent}%, var(--dark25) ${percent}%, var(--dark25) 100%)`,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchGame;
