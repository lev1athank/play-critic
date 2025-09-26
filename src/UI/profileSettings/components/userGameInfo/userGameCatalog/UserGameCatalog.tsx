import React, { useState } from 'react';
import styles from './style.module.scss';
import CatalogModal from './CatalogModal';

interface Catalog {
  id: number;
  name: string;
  created: string;
  games: number[];
}

const UserGameCatalog: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [activeCatalog, setActiveCatalog] = useState<Catalog | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newCatalog: Catalog = {
      id: Date.now(),
      name: newName,
      created: new Date().toLocaleDateString(),
      games: [],
    };
    setCatalogs([...catalogs, newCatalog]);
    setNewName('');
    setShowCreate(false);
  };

  return (
      <div className={styles.gamesSectionDecor}>
        <div className={styles.gamesSectionHeader}>
          <div className={styles.gamesIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#a084f3" />
              <rect x="7" y="7" width="10" height="10" rx="2" fill="#fff" />
            </svg>
          </div>
          <h3>Коллекция</h3>
        </div>
        <div className={styles.gamesGridDecor}>
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className={styles.gameCardDecor}
              role="button"
              tabIndex={0}
              onClick={() => setActiveCatalog(catalog)}
            >
              <div className={styles.gameCardInfoMinimal}>
                <span className={styles.gameNameMinimal}>{catalog.name}</span>
                <span style={{ fontSize: 12, color: '#888' }}>{catalog.created}</span>
              </div>
            </div>
          ))}
          <button
            className={styles.addGameButtonDecor}
            onClick={() => setShowCreate(true)}
            type="button"
          >
            <span>+</span>
            Новыя коллекция
          </button>
        </div>
        {showCreate && (
          <div className={styles.searchBoxMinimal} style={{ maxWidth: 400 }}>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Название коллекции"
              className={styles.searchInputMinimal}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className={styles.suggestionBtnMinimal} onClick={handleCreate}>Сохранить</button>
              <button className={styles.suggestionBtnMinimal} onClick={() => setShowCreate(false)}>Отмена</button>
            </div>
          </div>
        )}
        {activeCatalog && <CatalogModal catalog={activeCatalog} onClose={() => setActiveCatalog(null)} />}
      </div>
  );
};

export default UserGameCatalog;
