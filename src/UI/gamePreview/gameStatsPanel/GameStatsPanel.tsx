import React, { useState } from 'react'
import Info from './info/Info'
import styles from './style.module.scss'
import Review from './Review/Review'
const GameStatsPanel = ({ appid }: { appid: number }) => {
  const [isInfo, setIsInfo] = useState(true)
  return (
    <div className={styles.panelWrapper}>
      <div className={styles.panel}>
        {
          isInfo ? <Info appid={appid} toggleInfoWindow={() => setIsInfo(false)} /> : <Review appid={appid} toggleReviewWindow={() => setIsInfo(true)} />
        }
      </div>
    </div >

  )
}

export default GameStatsPanel