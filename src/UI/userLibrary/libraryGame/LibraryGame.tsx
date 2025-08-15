'use client'
import React, { useEffect, useState, useMemo } from 'react';
import FormNewGame from '../../formNewGame/FormNewGame';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import styles from './style.module.scss';
import { ICard } from '@/types/Card';
import Card from '../elements/Card/Card';
import LoadingAnimation from '@/UI/Loading/Loading';
import apiClient from '@/tool/axiosClient';
import GamePreview from '../../gamePreview/GamePreview';
import { toast } from 'react-toastify';
import { useActions } from '@/hooks/useActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faCaretLeft, faCaretRight, faForward, faForwardFast } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';


const LibraryGame = () => {
  const filter = useTypeSelector(state => state.search);
  const { game, isEditOrAdd, isPreview, gamesLibrary } = useTypeSelector(state => state.newGame);
  const { userData } = useTypeSelector(state => state.regField);
  const { updateLibrary, clearLibrary } = useActions()

  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [gameLibrariFilter, setGameLibrary] = useState<ICard[] | []>([]);

  const [isShowGame, setIsShowGame] = useState<boolean>(false);
  const [activeShowGame, setActiveShowGame] = useState<ICard | undefined>(undefined);
  const pathname = usePathname();
  useEffect(() => {
    const userName = pathname.split('/')[2];
    console.log(userName);
    
    apiClient
      .get(`/api/getUserGames?userName=${userName}`)
      .then((res) => {
        if (res.data.games && res.data.games.length !== 0) {
          clearLibrary()
          updateLibrary(res.data.games.reverse());
        } else {
          clearLibrary()
        }
      })
      .catch(() => {
        clearLibrary()
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);




  // 🔍 Фильтрация по поисковому запросу
  const gamesPerPage = 10;
  const filteredGames = useMemo(() => {
    return gamesLibrary
      ?.filter((el) =>
        el.name.toLowerCase().includes(filter.nameGame.toLowerCase())
      )
      .filter((el) => {
        if (el.story < filter.story) return false;
        if (el.gameplay < filter.gameplay) return false;
        if (el.originality < filter.originality) return false;
        if (el.immersion < filter.immersion) return false;
        return true;
      }) || []
  }, [game, filter, gamesLibrary]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage) || 1;

  const pagedGames = useMemo(() => {
    const start = page * gamesPerPage;
    return filteredGames.slice(start, start + gamesPerPage);
  }, [filteredGames, page]);


  const toFirstPage = () => setPage(0);
  const toPrevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const toNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const toLastPage = () => setPage(totalPages - 1);

  const handleInputPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const newPage = Math.min(Math.max(value - 1, 0), totalPages - 1);
      setPage(newPage);
    }
  };

  return (
    <>

      <div className={styles.libraryField}>
        {pagedGames.length > 0 ? (
          pagedGames.map((el, i) => (
            <Card
              {...el}
              userId={el.userId || ''}
              key={el.appid}
            />
          ))
        ) : isLoading ? (
          <LoadingAnimation />
        ) : filter.nameGame.trim().length > 0 ? (
          <div className={styles.noGames}>Игры не найдены по запросу</div>
        ) : (
          <div className={styles.noGames}>Нет игр в библиотеке</div>
        )}
      </div>

      <div className={styles.pageController}>
        <FontAwesomeIcon
          icon={faBackward}
          className={`${styles.array} ${styles.controlIcon}`}
          onClick={toFirstPage}
        />
        <FontAwesomeIcon
          icon={faCaretLeft}
          className={`${styles.array} ${styles.controlIcon}`}
          onClick={toPrevPage}
        />
        <div className={styles.fieldviewPage}>
          <input
            type="number"
            className={styles.setPage}
            min="1"
            max={totalPages}
            value={page + 1}
            onChange={handleInputPage}
            onClick={(el) => { el.currentTarget.select() }}
          />
          <span>/ {totalPages}</span>
        </div>
        <FontAwesomeIcon
          icon={faCaretRight}
          className={`${styles.array} ${styles.controlIcon}`}
          onClick={toNextPage}
        />
        <FontAwesomeIcon
          icon={faForward}
          className={`${styles.array} ${styles.controlIcon}`}
          onClick={toLastPage}
        />
      </div>
    </>
  );
};

export default LibraryGame;
