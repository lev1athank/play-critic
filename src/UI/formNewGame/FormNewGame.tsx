"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { useActions } from "@/hooks/useActions";
import apiClient from "@/tool/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import { ICard } from "@/types/Card";
import { useTypeSelector } from "@/hooks/useTypeSelector";
import { FaBookOpen, FaGamepad, FaHeadset, FaLightbulb, FaTimes } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside";

// ========================
// Константы
// ========================
const inputData = [
  { name: "Сюжет", id: "story", icon: <FaBookOpen /> },
  { name: "Геймплей", id: "gameplay", icon: <FaGamepad /> },
  { name: "Оригинальность", id: "originality", icon: <FaLightbulb /> },
  { name: "Погружение", id: "immersion", icon: <FaHeadset /> },
];

const ACTIVE_COLOR = "#9A5CD8";
const INACTIVE_COLOR = "#fffffff8";
const DEFAULT_SCORES = {
  story: 5,
  gameplay: 5,
  originality: 5,
  immersion: 5,
};
const DEFAULT_COUNT = 20;

const statuses = [
  { label: "Пройдена", value: "completed" },
  { label: "Заброшена", value: "requested" },
  { label: "Без статуса", value: "none" },
];



// ========================
// Хук для debounce
// ========================
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ========================
// Основной компонент
// ========================
const FormNewGame: React.FC = () => {
  const { userData } = useTypeSelector((state) => state.regField);
  const { isEditOrAdd, game } = useTypeSelector((state) => state.newGame);
  const { clearGame, updateLibrary, toggleIsPreview, setGame } = useActions();

  // ========================
  // Состояния
  // ========================
  const [selected, setSelected] = useState("none");
  const [imageGame, setImageGame] = useState<number | null>(null);
  const [scores, setScores] = useState(DEFAULT_SCORES);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [blockSearch, setBlockSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [games, setGames] = useState<{ name: string; appid: number }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // ========================
  // Поиск игр
  // ========================
  const searchGame = useCallback(async () => {
    if (debouncedSearchTerm.length < 2) return;
    try {
      const response = await apiClient.get(`/api/getGame?name=${debouncedSearchTerm}`);
      setGames(response.data.game);
    } catch (err) {
      console.error("Failed to fetch game data:", err);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    searchGame();
  }, [searchGame]);

  // ========================
  // Обработка ползунков
  // ========================
  const handleInput = useCallback((id: keyof typeof scores, value: number) => {
    setScores((prev) => {
      const newScores = { ...prev, [id]: value };
      setCount(Object.values(newScores).reduce((acc, v) => acc + v, 0));
      return newScores;
    });
  }, []);

  // ========================
  // Выбор игры из списка
  // ========================
  const handleGameSelect = useCallback((game: { name: string; appid: number }) => {
    setImageGame(game.appid);
    setSearchTerm(game.name);
    setIsDropdownOpen(false);
  }, []);

  // ========================
  // Сброс формы
  // ========================
  const resetForm = useCallback(
    (close: boolean = false) => {
      setImageGame(null);
      setScores(DEFAULT_SCORES);
      setCount(DEFAULT_COUNT);
      setDescription("");
      setSearchTerm("");
      setIsDropdownOpen(false);
      setGames([]);
      setBlockSearch(false);
      setSelected("none");
      if (close) clearGame(false);
      else if (!blockSearch) clearGame(true);
    },
    [blockSearch, clearGame]
  );

  // ========================
  // Добавление/редактирование игры
  // ========================
  const addGame = useCallback(async () => {
    if (!searchTerm || !imageGame) return;

    try {
      const response = await apiClient.post(`/api/${!blockSearch ? "addGame" : "editGame"}`, {
        appid: imageGame,
        name: searchTerm,
        ...scores,
        status: selected,
        description,
      });

      if (response.status === 200) {
        toast.success(!blockSearch ? "Игра успешно добавлена!" : "Игра успешно обновлена!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });

        if (!userData) return null;
        const gameData: ICard = {
          _id: userData?._id,
          userId: userData?._id,
          appid: imageGame,
          name: searchTerm,
          ...scores,
          createdAt: game?.createdAt as string,
          status: selected,
          description,
        };

        updateLibrary([gameData]);
        resetForm();
        if (blockSearch) setGame({ game: gameData, isUser: true });
        toggleIsPreview(true);
      }
    } catch (error: any) {
      toast.error(
        !blockSearch ? "Игра уже добавлена!" : "Ошибка обновления",
        { position: "bottom-right", autoClose: 5000, theme: "colored" }
      );
    }
  }, [blockSearch, imageGame, searchTerm, scores, description, game, updateLibrary, resetForm, setGame, toggleIsPreview, selected, userData]);

  // ========================
  // Инициализация формы при редактировании
  // ========================
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
    setCount([game.story, game.gameplay, game.originality, game.immersion].reduce((a, v) => a + v, 0));
    setDescription(game.description || "");
    setSearchTerm(game.name || "");
    setIsDropdownOpen(false);
    setGames([]);
    setBlockSearch(true);
    setSelected(game.status || "none");
  }, [game, resetForm]);

  // ========================
  // Выход из формы
  // ========================
  if (!isEditOrAdd || !userData) return null;


  return (
    <div className={styles.background}>
      <div className={styles.formNewGame}>
        {/* Кнопка закрытия формы */}
        <button className={styles.closeButton} onClick={() => resetForm(true)}>
          <FaTimes />
        </button>

        {/* Игровое изображение и выбор игры */}
        <div className={styles.gameDataField}>
          <div className={styles.gameImage}>
            <div className={styles.mainImage}>
              {imageGame ? (
                <Image
                  src={`https://steamcdn-a.akamaihd.net/steam/apps/${imageGame}/library_600x900.jpg`}
                  width={167}
                  height={250}
                  alt="game image"
                  loading="lazy"
                />
              ) : (
                <Image
                  src="/gamepad.svg"
                  width={150}
                  height={150}
                  alt="game placeholder"
                />
              )}
            </div>
          </div>

          {/* Детали игры: поиск и отзыв */}
          <div className={styles.gameDetails}>
            {/* Поиск игры */}
            <div className={styles.searchGame} ref={dropdownRef}>
              <span className={styles.searchTitle}>Выберите игру</span>
              <input
                placeholder="Название игры"
                value={searchTerm}
                className={styles.search}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={blockSearch}
              />
              {isDropdownOpen && games.length > 0 && (
                <ul className={styles.dropdownList}>
                  {games.map((g) => (
                    <li key={g.name} className={styles.dropdownItem} onClick={() => handleGameSelect(g)}>
                      <Image
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/capsule_184x69.jpg`}
                        width={123}
                        height={46}
                        alt={g.name}
                        className={styles.dropdownImage}
                      />
                      <span>{g.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Отзыв */}
            <div className={styles.recallField}>
              <span className={styles.recallTitle}>Отзыв</span>
              <textarea
                maxLength={220}
                placeholder="Кратко расскажи своё мнение"
                value={description}
                className={styles.recall}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Статус игры */}
        <div className={styles.adventureField}>
          {statuses.map((status) => (
            <button
              key={status.value}
              className={`${styles.statusButton} ${selected === status.value ? styles.active : ""}`}
              onClick={() => setSelected(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Ползунки оценок */}
        <div className={styles.scoreFieldGrid}>
          {[0, 1].map(row => (
            <div key={row} className={styles.scoreRow}>
              {[0, 1].map(col => {
                const idx = row * 2 + col; const field = inputData[idx];
                return (
                  <div key={field.id} className={styles.scoreInpBox}>
                    <div className={styles.sliderWrapper}>
                      <input id={field.id} className={styles.rangeScoreCustom} type="range" min={1} max={10}
                        value={scores[field.id as keyof typeof scores]}
                        onChange={(e) =>
                          handleInput(field.id as keyof typeof scores, +e.target.value)
                        }
                      />
                      <span className={styles.sliderLabel}> {field.icon} {field.name} </span>
                    </div>
                    <span className={styles.valueScoreCustom}>{scores[field.id as keyof typeof scores]}</span>
                  </div>
                );
              })} </div>))} </div>

        {/* Кнопка сохранить / редактировать */}
        <button onClick={addGame} className={styles.saveBtn}>
          {!blockSearch ? "Сохранить" : "Редактировать"}
          <span className={styles.count}>{count}</span>
        </button>

        <ToastContainer />
      </div>
    </div>

  );
};

export default FormNewGame;