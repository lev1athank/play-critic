'use client';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import apiClient from '@/tool/axiosClient';
import { Statistics } from '@/types/usersGame';

const categories = [
    { label: 'Сюжет', key: 'averageStory' },
    { label: 'Геймплей', key: 'averageGameplay' },
    { label: 'Оригинальность', key: 'averageOriginality' },
    { label: 'Погружение', key: 'averageImmersion' }
];



const Info = ({ appid, toggleInfoWindow }: { appid: number, toggleInfoWindow: () => void }) => {
    const [statistics, setStatistics] = useState<Statistics>({
        averageStory: 0,
        averageGameplay: 0,
        averageOriginality: 0,
        averageImmersion: 0,
        count: 0,
        reviewCount: 0
    });

    const [animatedStats, setAnimatedStats] = useState<Statistics>({
        averageStory: 0,
        averageGameplay: 0,
        averageOriginality: 0,
        averageImmersion: 0,
        count: 0,
        reviewCount: 0
    });

    const [popIndex, setPopIndex] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await apiClient.get(`/api/getStatistics?appid=${appid}`);

            const data = response.data.data || {
                averageStory: 0,
                averageGameplay: 0,
                averageOriginality: 0,
                averageImmersion: 0,
                count: 0,
                reviewCount: 0
            };
            setStatistics(data);

            const duration = 1000;
            const start = performance.now();

            const animate = (time: number) => {
                const progress = Math.min((time - start) / duration, 1);
                setAnimatedStats({
                    averageStory: data.averageStory * progress,
                    averageGameplay: data.averageGameplay * progress,
                    averageOriginality: data.averageOriginality * progress,
                    averageImmersion: data.averageImmersion * progress,
                    count: Math.round(data.count * progress),
                    reviewCount: Math.round(data.reviewCount * progress)
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(() => setPopIndex('total'), 50);
                }
            };
            requestAnimationFrame(animate);
        };
        fetchData();
    }, [appid]);


    const averageTotalAnimated =
        (animatedStats.averageStory +
            animatedStats.averageGameplay +
            animatedStats.averageOriginality +
            animatedStats.averageImmersion);

    const renderCircle = (
        value: number,
        colorClass: string,
        isTotal?: boolean
    ) => {
        const maxValue = isTotal ? 40 : 10;
        const percent = (value / maxValue) * 100;

        return (
            <div className={`${styles.circular} ${isTotal && popIndex === 'total' ? styles.pop : ''}`}>
                <svg viewBox="0 0 36 36" className={styles.circularChart}>
                    <path
                        className={styles.bgPath}
                        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className={colorClass}
                        style={{ strokeDasharray: `${percent} 100` }}
                        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <span className={styles.scoreValue}>{value.toFixed(1)}</span>
            </div>
        );
    };


    return (
        <>
            <h3 className={styles.title}>Статистика</h3>

            <div className={styles.statsBlock}>
                <div>
                    <span>Всего оценок</span>
                    <strong>{animatedStats.count}</strong>
                </div>
                <div>
                    <span>Всего отзывов</span>
                    <strong>{animatedStats.reviewCount}</strong>
                </div>
            </div>

            {/* Общий балл — отдельный большой круг */}
            <div className={styles.totalScoreBig}>
                {renderCircle(averageTotalAnimated, styles.progressPathTotal, true)}
                <span className={styles.totalLabel}>Общий рейтинг</span>
            </div>

            {/* Остальные критерии */}
            <div className={styles.gridScores}>
                {categories.map(({ label, key }) => (
                    <div key={key} className={styles.scoreCard}>
                        {renderCircle(animatedStats[key as keyof Statistics], styles.progressPath)}
                        <span className={styles.scoreLabel}>{label}</span>
                    </div>
                ))}
            </div>

            <button className={styles.btnReviews} onClick={toggleInfoWindow}>Читать отзывы</button>

        </>
    );
};

export default Info;
