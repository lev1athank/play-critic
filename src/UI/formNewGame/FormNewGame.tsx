"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGamepad, faLightbulb, faHeadset, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useActions } from "@/hooks/useActions";
import apiClient from "@/tool/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ICard } from "@/types/Card";
import { useTypeSelector } from "@/hooks/useTypeSelector";

const inputData = [
  { name: "Сюжет", id: "story", icon: faBook },
  { name: "Геймплей", id: "gameplay", icon: faGamepad },
  { name: "Оригинальность", id: "originality", icon: faLightbulb },
  { name: "Погружение", id: "immersion", icon: faHeadset },
];

const ACTIVE_COLOR = "#9A5CD8";
// const INACTIVE_COLOR = "#ffffff";
const INACTIVE_COLOR = "#282a3aff";

const DEFAULT_SCORES = {
  story: 5,
  gameplay: 5,
  originality: 5,
  immersion: 5,
};

const DEFAULT_COUNT = 20;
const statuses = [
  { label: 'Пройдена', value: 'completed' },
  { label: 'Заброшена', value: 'requested' },
  { label: 'Без статуса', value: 'none' },
];


const FormNewGame: React.FC = () => {
  const { isEditOrAdd, game } = useTypeSelector(state => state.newGame);
  const { userData } = useTypeSelector(state => state.regField);
  const { clearGame, updateLibrary, toggleIsPreview, setGame } = useActions();
  const [selected, setSelected] = useState('none');
  const [imageGame, setImageGame] = useState<number | null>(null);
  const [scores, setScores] = useState(DEFAULT_SCORES);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [blockSearch, setBlockSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [games, setGames] = useState<{ name: string; appid: number }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Поиск игры
  const searchGame = useCallback(async () => {
    try {
      const response = await apiClient.post("/api/getGame", { name: searchTerm });
      setGames(response.data.game);
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    }
  }, [searchTerm]);

  // Дебаунс поиска
  useEffect(() => {
    if (searchTerm.length < 2) return;
    const timer = setTimeout(searchGame, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, searchGame]);

  // Обработка изменения ползунка
  const handleInput = useCallback((input: HTMLInputElement, id: string) => {
    const newValue = +input.value;
    setScores(prev => {
      const newScores = { ...prev, [id]: newValue };
      setCount(Object.values(newScores).reduce((acc, val) => acc + val, 0));
      return newScores;
    });
  }, []);

  // Выбор игры из списка
  const handleGameSelect = useCallback((game: { name: string; appid: number }) => {
    setImageGame(game.appid);
    setSearchTerm(game.name);
    setIsDropdownOpen(false);
  }, []);

  // Закрытие дропдауна при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Обновление стиля ползунков
  useEffect(() => {
    inputData.forEach(({ id }) => {
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (input) {
        const value = scores[id as keyof typeof scores];
        const ratio = ((value - 1) / (10 - 1)) * 100;
        input.style.background = `linear-gradient(90deg, ${ACTIVE_COLOR} ${ratio}%, ${INACTIVE_COLOR} ${ratio}%)`;
      }
    });
  }, [isEditOrAdd, scores]);

  // Сброс формы
  const resetForm = useCallback((close: boolean = false) => {
    setImageGame(null);
    setScores(DEFAULT_SCORES);
    setCount(DEFAULT_COUNT);
    setDescription("");
    setSearchTerm("");
    setIsDropdownOpen(false);
    setGames([]);
    setBlockSearch(false);
    setSelected('none');
    if (close) clearGame(false);
    else if (!blockSearch) clearGame(true);
  }, [blockSearch, clearGame]);

  // Добавление/редактирование игры
  const addGame = useCallback(async () => {
    try {
      const response = await apiClient.post(`/api/${!blockSearch ? "addGame" : "editGame"}`, {
        appid: imageGame,
        name: searchTerm,
        story: scores.story,
        gameplay: scores.gameplay,
        originality: scores.originality,
        immersion: scores.immersion,
        status: selected,
        description,
      });

      if (response.status === 200) {
        toast.success(!blockSearch ? "Игра успешно добавлена!" : "Игра успешно обновлена", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });

        const gameData: ICard = {
          _id: userData.id,
          userId: userData.id,
          appid: imageGame ?? 0,
          name: searchTerm,
          story: scores.story,
          gameplay: scores.gameplay,
          originality: scores.originality,
          immersion: scores.immersion,
          createdAt: game?.createdAt as string,
          status: selected,
          description,
        };
        console.log(gameData);
        

        updateLibrary([gameData]);
        resetForm();
        if (blockSearch) setGame({ game: gameData, isUser: true });
        toggleIsPreview(true);
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        toast.error(!blockSearch ? "Игра уже добавлена!" : "Ошибка обновления", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });
      }
    }
  }, [blockSearch, imageGame, searchTerm, scores, description, game, updateLibrary, resetForm, setGame, toggleIsPreview, selected]);

  // Инициализация формы при редактировании
  useEffect(() => {
    if (!game) {
      resetForm();
      return;
    }
    setImageGame(game.appid);
    setScores({
      story: game.story,
      gameplay: game.gameplay,
      originality: game.originality,
      immersion: game.immersion,
    });
    setCount([game.story, game.gameplay, game.originality, game.immersion].reduce((acc, val) => acc + val, 0));
    setDescription(game.description || "");
    setSearchTerm(game.name || "");
    setIsDropdownOpen(false);
    setGames([]);
    setBlockSearch(true);
    setSelected(game.status || 'none');
  }, [game, resetForm]);

  if (!isEditOrAdd) return null;

  return (
    <div className={styles.background}>
      <div className={styles.formNewGame}>
        <button className={styles.closeButton} onClick={() => resetForm(true)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.gameDataField}>
          <div className={styles.gameImage}>
            <div className={styles.mainImage}>
              {imageGame ? (
                <Image
                  src={`https://steamcdn-a.akamaihd.net/steam/apps/${imageGame}/library_600x900.jpg`}
                  className={styles.imageLogo}
                  width={167}
                  height={250}
                  alt="game image"
                  loading="eager"
                />
              ) : (
                <Image
                  src="/gamepad.svg"
                  width={150}
                  height={150}
                  alt="game image"
                  className={styles.noImage}
                />
              )}
            </div>
          </div>
          <div className={styles.gameDetails}>
            <div className={styles.searchGame} ref={dropdownRef}>
              <span className={styles.searchTitle}>Выберите игру</span>
              <input
                className={styles.search}
                placeholder="Название игры"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={blockSearch}
              />
              {isDropdownOpen && games.length > 0 && (
                <ul className={styles.dropdownList}>
                  {games.map(game => (
                    <li
                      key={game.name}
                      className={styles.dropdownItem}
                      onClick={() => handleGameSelect(game)}
                    >
                      <Image
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/capsule_184x69.jpg`}
                        width={123}
                        height={46}
                        alt={game.name}
                        loading="eager"
                        className={styles.dropdownImage}
                      />
                      <span>{game.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.recallField}>
              <span className={styles.recallTitle}>Отзыв</span>
              <textarea
                className={styles.recall}
                maxLength={220}
                placeholder="Кратко расскажи своё мнение"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className={styles.adventureField}>
          {statuses.map((status) => (
            <button
              key={status.value}
              className={`${styles.statusButton} ${selected === status.value ? styles.active : ''
                }`}
              onClick={() => setSelected(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
        <div className={styles.scoreFieldGrid}>
          {[0, 1].map(row => (
            <div key={row} className={styles.scoreRow}>
              {[0, 1].map(col => {
                const idx = row * 2 + col;
                const field = inputData[idx];
                return (
                  <div key={field.id} className={styles.scoreInpBox}>
                    <div className={styles.sliderWrapper}>
                      <input
                        id={field.id}
                        className={styles.rangeScoreCustom}
                        type="range"
                        min={1}
                        max={10}
                        value={scores[field.id as keyof typeof scores]}
                        onChange={e => handleInput(e.currentTarget, field.id)}
                      />
                      <span className={styles.sliderLabel}>
                        <FontAwesomeIcon icon={field.icon} style={{ marginRight: "8px" }} />
                        {field.name}
                      </span>
                    </div>
                    <span className={styles.valueScoreCustom}>{scores[field.id as keyof typeof scores]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <button className={styles.saveBtn} onClick={addGame}>
          {!blockSearch ? "Сохранить" : "Редактировать"}
          <span className={styles.count}>{count}</span>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormNewGame;