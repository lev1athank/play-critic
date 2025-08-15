import { ICard } from '@/types/Card';
import React, { FC, memo } from 'react';
import styles from './style.module.scss';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import { useActions } from '@/hooks/useActions';

interface IgameData extends ICard {
  userId: string
}

const Card: FC<IgameData> = memo(({...data})=>{
  console.log(data.name);
  
  const totalScore = [data.gameplay, data.immersion, data.originality, data.story].reduce((sum, val) => sum + val, 0);
  const { isPreview } = useTypeSelector(state => state.newGame);
  const { userData } = useTypeSelector(state => state.regField);
  const { toggleIsPreview, setGame } = useActions()
  
  const setViewGame = () => {
    setGame({
      game: data,
      isUser: userData.id == data.userId
    })
    toggleIsPreview(true)
  }
  
  
  return (
    <div className={styles.card} onClick={setViewGame}>
      <div className={styles.imageContainer}>
        <img
          src={`https://steamcdn-a.akamaihd.net/steam/apps/${data.appid}/header.jpg`}

          alt={data.name}
          className={styles.image}
        />
        <div className={styles.scoreBadge}>
          <div className={styles.mainScore}>{totalScore}</div>
          <div className={`${styles.flyout} ${styles.leftTop}`}>📖 {data.story}</div>
          <div className={`${styles.flyout} ${styles.leftCenter}`}>🎮 {data.gameplay}</div>
          <div className={`${styles.flyout} ${styles.bottomCenter}`}>💡 {data.originality}</div>
          <div className={`${styles.flyout} ${styles.bottomRight}`}>🎧 {data.immersion}</div>
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{data.name}</h2>
        <div className={styles.fullTitle}>{data.name}</div>
      </div>
    </div>
  );
})

export default Card;
