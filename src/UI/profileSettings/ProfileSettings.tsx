'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './style.module.scss';
import { useActions } from '@/hooks/useActions';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import { ICard } from '@/types/Card';
import { getUserData, saveUserData } from './getUserData';
import UserInfo from './components/userInfo/UserInfo';
import UserGameInfo from './components/userGameInfo/UserGameInfo';

const MAX_GAMES = 4;

export interface UserProfileData {
  userInfo: {
    _id: string;
    userId: string;
    descriptionProfile: string;
    loveGame: string; // Список appid через запятую
    avatar: string;
    isCloseProfile: boolean;
    __v: number;
  };
  games: ICard[];
}

export default function ProfileSettings() {
    const pathname = usePathname();
    const router = useRouter();
    const userName = useMemo(() => pathname.split('/')[2] || '', [pathname]);

    const [userInfo, setUserInfo] = useState<UserProfileData>();
    const [userGames, setUserGames] = useState<ICard[]>([]);
    const [editedInfo, setEditedInfo] = useState({
        descriptionProfile: '',
        loveGame: '',
        isCloseProfile: false,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showGameSearch, setShowGameSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { userData } = useTypeSelector(state => state.regField);
    const { toggleIsPreview, setGame } = useActions();

    // Fetch user data
    useEffect(() => {
        if (!userName) return;
        (async () => {
            setIsLoading(true);
            try {
                const { data } = await getUserData(userName);
                setUserInfo(data.userInfo);
                setUserGames(data.games);
                setEditedInfo({
                    descriptionProfile: data.userInfo.descriptionProfile || '',
                    loveGame: data.userInfo.loveGame || '',
                    isCloseProfile: data.userInfo.isCloseProfile,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [userName]);

    // Derived
    const loveGameIds = useMemo(
        () => editedInfo.loveGame.split(',').map(id => id.trim()).filter(Boolean).slice(0, MAX_GAMES),
        [editedInfo.loveGame]
    );

    const loveGameData = useMemo(
        () => loveGameIds.map(id => (id ? userGames.find(g => g.appid.toString() === id) || null : null)),
        [loveGameIds, userGames]
    );

    // Avatar handlers
    const handleAvatarClick = () => {
        if (isEditing) fileInputRef.current?.click();
    };

    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return alert('Выберите изображение.');
        if (file.size > 5 * 1024 * 1024) return alert('Максимум 5MB.');
        setSelectedAvatar(file);
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    }, []);

    // Game actions
    const setViewGame = (data: ICard) => {
        setGame({
            game: data,
            isUser: userData.id === data.userId
        });
        toggleIsPreview(true);
    };

    const handleAddGame = (name: string) => {
        if (loveGameData.length >= MAX_GAMES) return alert(`Максимум ${MAX_GAMES} игр.`);
        const game = userGames.find(g => g.name === name);
        if (!game) return alert('Не найдено.');
        if (loveGameIds.includes(game.appid.toString())) return alert('Уже есть.');
        setEditedInfo(prev => ({
            ...prev,
            loveGame: [...loveGameIds, game.appid.toString()].join(', '),
        }));
        setSearchQuery('');
        setShowGameSearch(false);
    };

    const handleRemoveGame = (appid: string) => {
        setEditedInfo(prev => ({
            ...prev,
            loveGame: loveGameIds.map(id => id === appid ? null : id).join(','),
        }));
    };

    // Save/cancel
    const handleSave = async () => {
        if (!userInfo) return;
        setIsLoading(true);
        try {
            const payload = {
                userId: userInfo.userId,
                descriptionProfile: editedInfo.descriptionProfile,
                loveGame: editedInfo.loveGame,
                isCloseProfile: editedInfo.isCloseProfile,
                avatar: selectedAvatar || userInfo.avatar,
            };
            const response = await saveUserData(payload);
            if (response.status === 200) {
                setUserInfo(prev => prev && ({
                    ...prev,
                    ...editedInfo,
                    avatar: response.data.avatarUrl || prev.avatar,
                }));
                setIsEditing(false);
                setSelectedAvatar(null);
                setAvatarPreview(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (!userInfo) return;
        setEditedInfo({
            descriptionProfile: userInfo.descriptionProfile,
            loveGame: userInfo.loveGame || '',
            isCloseProfile: userInfo.isCloseProfile,
        });
        setIsEditing(false);
        setSearchQuery('');
        setShowGameSearch(false);
        setSelectedAvatar(null);
        setAvatarPreview(null);
    };

    const suggestions = useMemo(() => {
        if (!searchQuery.trim() || !userGames) return [];
        return userGames
            .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 3)
            .map(g => g.name);
    }, [searchQuery, userGames]);

    return userInfo && (
        <div className={styles.userSetting}>
            <div className={styles.splitWrapper}>
                <UserInfo
                    userName={userName}
                    userInfo={userInfo}
                    editedInfo={editedInfo}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    avatarPreview={avatarPreview}
                    loveGameData={loveGameData}
                    fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                    onAvatarClick={handleAvatarClick}
                    onAvatarChange={handleAvatarChange}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onRemoveGame={handleRemoveGame}
                    router={router}
                />
                <UserGameInfo
                    loveGameData={loveGameData}
                    isEditing={isEditing}
                    showGameSearch={showGameSearch}
                    setShowGameSearch={setShowGameSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    suggestions={suggestions}
                    onAddGame={handleAddGame}
                    setViewGame={setViewGame}
                    onRemoveGame={handleRemoveGame}
                />
            </div>
        </div>
    );
}
