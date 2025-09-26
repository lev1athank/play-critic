import React, { useState, useMemo, useEffect } from 'react';
import styles from './style.module.scss';
import { ICard } from '@/types/Card';
import { useActions } from '@/hooks/useActions';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import UserGameCatalog from './userGameCatalog/UserGameCatalog';
import { TUserInfo } from '@/types/userInfo';
import Image from 'next/image';
import { FaGamepad } from "react-icons/fa6";

interface PropsUserGameInfo {
  isEditing: boolean;
  editedUserData: TUserInfo;
  setEditedUserData: React.Dispatch<React.SetStateAction<TUserInfo>>;
  userInfo: TUserInfo;
}

const MAX_GAMES = 4;

const UserGameInfo: React.FC<PropsUserGameInfo> = ({ isEditing, editedUserData, setEditedUserData, userInfo }) => {

  const [showGameSearch, setShowGameSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleIsPreview, setGame } = useActions();
  const { userData } = useTypeSelector(state => state.regField);

  const handleOutsideClick = (e: MouseEvent) => {
    const searchPanel = document.getElementById('game-search-panel');
    if (searchPanel && !searchPanel.contains(e.target as Node)) {
      setShowGameSearch(false);
    }
  };

  useEffect(() => {
    if (showGameSearch) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showGameSearch]);



  // Filter games to show only favorites
  // TODO
  const loveGameData = useMemo(() =>
    editedUserData.profileId.loveGame.reverse(),
    [editedUserData.profileId.loveGame]
  );

  const arrayLoveGames = useMemo(() =>
    userInfo.userGamesId.filter(el => loveGameData?.includes(el.appid)).reverse()
    , [loveGameData])

  // Search in all available games
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return (editedUserData?.userGamesId as ICard[] | undefined)
      ?.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !loveGameData?.includes(g.appid)
      )
      .slice(0, 3) ?? []; // Limit to first 3 games
  }, [searchQuery, editedUserData?.userGamesId]);

  const onRemoveGame = (appid: number) => {
    setEditedUserData((prev) => ({
      ...prev,
      profileId: {
        ...prev.profileId,
        loveGame: prev.profileId.loveGame.filter(id => id !== appid)
      }
    }
    )
    );
  };

  const onAddGame = (game: ICard) => {
    console.log(game, 123);

    setEditedUserData((prev) => ({
      ...prev,
      profileId: {
        ...prev.profileId,
        loveGame: [...prev.profileId.loveGame, game.appid]
      }
    }
    )
    );
    setShowGameSearch(false);
    setSearchQuery('');
  };

  const isUser = useMemo(() => userData?._id == userInfo._id, [userInfo._id, userData?._id]);


  return (
    <div className={styles.userGameInfo}>

      <div className={styles.gamesSectionDecor}>
        <div className={styles.gamesSectionHeader}>
          <div className={styles.gamesIcon}>
            <FaGamepad size={30} opacity={0.7} />
          </div>
          <h3>Любимые игры</h3>
        </div>

        <div className={styles.gamesGridDecor}>
          {arrayLoveGames?.map((game) => {
            if (!game) return null;
            return (
              <div
                key={game.appid}
                className={styles.gameCardDecor}
                role="button"
                tabIndex={0}
                onClick={() => {
                  toggleIsPreview(true);
                  setGame({ game, isUser });
                }}
              >
                <div className={styles.gameImageContainerDecor}>
                  <Image
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    className={styles.gameImgMinimal}
                    loading="lazy"
 
                    fill               // картинка занимает весь контейнер
                    style={{ objectFit: "cover" }}

                  />
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
                      <span>&times;</span>
                    </button>
                  )}
                  <div className={styles.scoreBadgeDecor}>
                    <span>{((game.story + game.gameplay + game.originality + game.immersion))}</span>
                  </div>
                </div>
                <div className={styles.gameCardInfoMinimal}>
                  <span className={styles.gameNameMinimal}>{game.name}</span>
                </div>
              </div>
            );
          })}
          {isEditing && (loveGameData?.length || 0) < MAX_GAMES && (
            <button
              className={styles.addGameButtonDecor}
              onClick={() => setShowGameSearch(!showGameSearch)}
              type="button"
            >
              <span>+</span>
              Добавить игру
            </button>
          )}
        </div>
        {showGameSearch && (
          <div className={styles.searchBoxMinimal} id="game-search-panel">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className={styles.searchInputMinimal}
              autoFocus
            />
            <ul className={styles.suggestionsListMinimal}>
              {suggestions?.length === 0 && (
                <li className={styles.noResultMinimal}>Ничего не найдено</li>
              )}
              {suggestions?.map((game) => (
                <li key={game.appid}>
                  <button className={styles.suggestionBtnMinimal} onClick={() => onAddGame(game)}>
                    <span className={styles.suggestionNameMinimal}>{game.name}</span>
                    <span className={styles.suggestionScoreMinimal}>{((game.story + game.gameplay + game.originality + game.immersion) / 4).toFixed(1)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!showGameSearch && <UserGameCatalog />}
    </div>
  );
};

export default UserGameInfo;
