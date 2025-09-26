import apiClient from '@/tool/axiosClient';
import { ICard } from '@/types/Card';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';
import { useActions } from '@/hooks/useActions';
import Image from 'next/image';

interface UserID {
  login: string;
  userName: string;
  avatar: string;
  profileId: string;
  userGamesId: string[];
}

interface ReviewData {
  userId: UserID;
  appid: number;
  name: string;
  story: number;
  gameplay: number;
  originality: number;
  immersion: number;
  description: string;
  status: string;
  createdAt: Date;
}



const ExpandableDescription = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;

  const isLong = text.length > maxLength;
  const displayText = !expanded && isLong ? text.slice(0, maxLength) + '…' : text;

  return (
    <>
      <p className={styles.description}>{displayText}</p>
      {isLong && (
        <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Свернуть' : 'Показать больше'}
        </button>
      )}
    </>
  );
};

interface ReviewProps {
  appid: number;
  toggleReviewWindow: () => void;
}

const PAGE_SIZE = 10;

const Review = ({ appid, toggleReviewWindow }: ReviewProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const [newSort, setNewSort] = useState(true);
  const loadingRef = useRef(false);
  const startRef = useRef(0);
  const { clearGame } = useActions()

  useEffect(() => {
    startRef.current = start;
  }, [start]);

  // Загрузка отзывов (reset = true сбрасывает список)
  const fetchReviews = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const currentStart = reset ? 0 : startRef.current;
      const params = new URLSearchParams();
      params.append('appid', appid.toString());
      params.append('start', currentStart.toString());
      params.append('newSort', newSort ? 'true' : 'false');

      const response = await apiClient.get<ReviewData[]>(`/api/getReviews?${params.toString()}`);

      const data = response.data || [];

      if (reset) {
        setReviews(data);
      } else {
        setReviews(prev => [...prev, ...data]);
      }
      setStart(currentStart + data.length);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Ошибка получения отзывов', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [appid, newSort]);

  // При смене сортировки или appid сбрасываем список и грузим заново
  useEffect(() => {
    fetchReviews(true);
  }, [appid, newSort, fetchReviews]);

  const toggleSort = () => {
    setNewSort(prev => !prev);
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const clean = name.trim();
    if (clean.length === 1) return clean[0].toUpperCase();
    return `${clean[0].toUpperCase()}${clean[clean.length - 1].toUpperCase()}`;
  };

  return reviews && (
    <div className={styles.reviewWrapper}>
      <div className={styles.headerBar}>
        <div className={styles.title}>Отзывы пользователей</div>
        <button className={styles.btnBack} onClick={toggleReviewWindow}>
          ← К статистике
        </button>
      </div>

      <div className={styles.sortFilter}>
        <button className={styles.sortButton} onClick={toggleSort}>
          {newSort ? 'Показать старые' : 'Показать новые'}
        </button>
      </div>

      <div className={styles.reviewsContainer}>
        {reviews.length === 0 && !loading && (
          <div className={styles.noReviews}>Отзывов пока нет</div>
        )}

        {reviews.map((r, i) => (
          <div key={i} className={styles.reviewCard}>
            <Link className={styles.topRow} href={`/profile/${r.userId.login}`} onClick={() => clearGame(true)}>
              <div className={styles.avatar}>
                {r.userId.avatar ? (
                  <Image src={`http://localhost:3452/img/uploads/${r.userId.avatar}`} width={56} height={56} placeholder={'blur'} blurDataURL={`http://localhost:3452/img/uploads/avatar_${r.userId.avatar}?w=10&h=10&q=10`} alt={r.userId.userName} />
                ) : (
                  <div className={styles.initials}>{getInitials(r.userId.userName)}</div>
                )}
              </div>
              <div className={styles.headerAndScores}>
                <div className={styles.header}>
                  <span className={styles.username}>{r.userId.userName}</span>
                  <span className={styles.date}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.scores}>
                  <div className={styles.scoreCard}>📖 <strong>{r.story}</strong></div>
                  <div className={styles.scoreCard}>🎮 <strong>{r.gameplay}</strong></div>
                  <div className={styles.scoreCard}>✨ <strong>{r.originality}</strong></div>
                  <div className={styles.scoreCard}>🎧 <strong>{r.immersion}</strong></div>
                </div>
              </div>
            </Link>
            <ExpandableDescription text={r.description} />
          </div>
        ))}

        {loading && <div className={styles.loading}>Загрузка...</div>}
        {!loading && hasMore && (
          <button className={styles.loadMoreBtn} onClick={() => fetchReviews(false)}>
            Ещё отзывы
          </button>
        )}
        {!loading && !hasMore && reviews.length > 0 && (
          <div className={styles.noMore}>Отзывов больше нет</div>
        )}
      </div>
    </div>
  );
};

export default Review;