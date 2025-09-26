import React from 'react';
import styles from './style.module.scss';

interface Catalog {
  id: number;
  name: string;
  created: string;
  games: number[];
}


interface CatalogModalProps {
  catalog: Catalog;
  onClose: () => void;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ catalog, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{catalog.name}</h2>
            <div className={styles.modalDate}>Создан: {catalog.created}</div>
          </div>
          <button className={styles.addGameButton}>
            + Добавить игру
          </button>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          {catalog.games.length === 0 ? (
            <div className={styles.emptyState}>
              Этот каталог пока пуст. Добавьте игры, чтобы начать.
            </div>
          ) : (
            <div className={styles.gamesGridModal}>
              {/* Здесь будет отображение игр */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;
