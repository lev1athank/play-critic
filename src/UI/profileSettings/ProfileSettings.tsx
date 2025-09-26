'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './style.module.scss';
import { ICard } from '@/types/Card';
import { getUserData, saveUserData } from './getUserData';
import UserInfo from './components/userInfo/UserInfo';
import LoadingAnimation from '../Loading/Loading';
import UserGameInfo from './components/userGameInfo/UserGameInfo';
import { useActions } from '@/hooks/useActions';
import { SaveUserDataParams, TUserInfo } from '@/types/userInfo';

export default function ProfileSettings() {
    const { setNewUserData } = useActions();
    const pathname = usePathname();
    const userName = useMemo(() => pathname.split('/')[2] || '', [pathname]);

    const [userData, setUserData] = useState<TUserInfo>();
    const [editedUserData, setEditedUserData] = useState<TUserInfo>({} as TUserInfo);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userName)
                    return console.log('User not found');
                    
                const response = await getUserData(userName);
                console.log(response.data, 123);
                
                setUserData(response.data);
                setEditedUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        if (userName) fetchUserData();
    }, [userName]);

    const saveUser = useCallback(async () => {
        if (!editedUserData) return;

        try {
            const payload:SaveUserDataParams = {
                userId: editedUserData._id,
                userName: editedUserData.userName,
                descriptionProfile: editedUserData.profileId.descriptionProfile || '',
                isCloseProfile: editedUserData.profileId.isCloseProfile ?? userData?.profileId.isCloseProfile ?? false,
                loveGame: editedUserData.profileId.loveGame || userData?.profileId.loveGame || [],
                avatar: editedUserData._avatarFile
            };

            await saveUserData(payload);

            // Обновляем глобальный стейт и локальный
            setNewUserData({
                userName: editedUserData.userName,
                lastAvatarIMG: editedUserData._avatarFile ? URL.createObjectURL(editedUserData._avatarFile) : undefined
            });

            setUserData(editedUserData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }, [editedUserData, setNewUserData, userData]);

    if (!userData || !editedUserData) {
        return (
            <div className={styles.userSetting}>
                <div className={styles.splitWrapper}>
                    <LoadingAnimation />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.userSetting}>
            <div className={styles.splitWrapper}>
                {userData && editedUserData ? (
                    <>
                        <UserInfo
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            userData={userData}
                            editedUserData={editedUserData}
                            setEditedUserData={setEditedUserData}
                            onSave={saveUser}
                        />
                        <UserGameInfo
                            isEditing={isEditing}
                            editedUserData={editedUserData}
                            setEditedUserData={setEditedUserData}
                            userInfo={userData}
                        />
                    </>
                ) : (
                    <LoadingAnimation />
                )}
            </div>
        </div>
    );
}
