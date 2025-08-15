import React from 'react';
import styles from './style.module.scss';

interface UserGameInfoProps {
    loveGameData: any[];
    isEditing: boolean;
    showGameSearch: boolean;
    setShowGameSearch: (value: boolean) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    suggestions: string[];
    onAddGame: (name: string) => void;
    setViewGame: (game: any) => void;
    onRemoveGame: (appid: string) => void;
}

const UserGameInfo: React.FC<UserGameInfoProps> = ({
    loveGameData,
    isEditing,
    showGameSearch,
    setShowGameSearch,
    searchQuery,
    setSearchQuery,
    suggestions,
    onAddGame,
    setViewGame,
    onRemoveGame,
}) => {
    return (
        <div className={styles.userGameInfo}>
            <div className={styles.gamesSectionDecor}>
                <div className={styles.gamesSectionHeader}>
                    <div className={styles.gamesIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M7 17l-3-3 3-3" stroke="#23262f" strokeWidth="2" />
                            <path d="M17 7l3 3-3 3" stroke="#23262f" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" fill="#23262f" />
                        </svg>
                    </div>
                    <h3>Любимые игры</h3>
                </div>

                {isEditing && (
                    <div className={styles.searchPanel}>
                        <button
                            className={styles.toggleSearchBtn}
                            onClick={() => setShowGameSearch(!showGameSearch)}
                            aria-expanded={showGameSearch}
                            aria-controls="game-search-panel"
                        >
                            {showGameSearch ? 'Скрыть поиск' : 'Добавить игру'}
                        </button>

                        {showGameSearch && (
                            <div className={styles.searchBox} id="game-search-panel">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Название игры..."
                                />
                                <ul className={styles.suggestionsList}>
                                    {suggestions.map((name, idx) => (
                                        <li key={idx}>
                                            <button onClick={() => onAddGame(name)}>
                                                {name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.gamesGridDecor}>
                    {loveGameData.map((game, index) => {
                        if (!game) return null;
                        return (
                            <div
                                key={index}
                                className={styles.gameCardDecor}
                                onClick={() => setViewGame(game)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === 'Enter' ? setViewGame(game) : null)}
                            >
                                <div className={styles.gameImageContainerDecor}>
                                    <img
                                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                                        alt={game.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loading="lazy"
                                    />
                  }
                                    {isEditing && (
                                        <button
                                            className={styles.removeGameButtonDecor}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveGame(game.appid);
                                            }}
                                            aria-label="Удалить игру"
                                            title="Удалить игру"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    {typeof game.score === 'number' && (
                                        <div className={styles.scoreBadgeDecor}>
                                            {game.score}
                                        </div>
                                    )}
                                </div>
                                <p className={styles.gameNameDecor}>{game.name}</p>
                            </div>
                        );
                    })}

                    {isEditing && (
                        <button
                            className={styles.addGameButtonDecor}
                            onClick={() => setShowGameSearch(true)}
                            type="button"
                        >
                            <span>+</span>
                            Добавить игру
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserGameInfo;
