import React from 'react';
import styles from './style.module.scss';

const LoadingAnimation = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingAnimation;
