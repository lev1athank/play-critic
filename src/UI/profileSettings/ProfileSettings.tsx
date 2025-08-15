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
import LoadingAnimation from '../Loading/Loading';

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
    const [userData, setUserData] = useState<UserProfileData>()
    const stateIsEdit = useState<Boolean>(false)
    
    
    useEffect(()=>{
        const reqData = async () => {
            const gUserData = await getUserData(userName)
            console.log(gUserData);
            
            setUserData(gUserData.data)
        }
        reqData()
    },[pathname])

    
    const saveUser = useCallback(()=>{
        if(!userData?.userInfo) return
        const userInfo = userData.userInfo
        saveUserData({
            descriptionProfile: userInfo.descriptionProfile,
            isCloseProfile: userInfo.isCloseProfile,
            loveGame: userInfo.loveGame,
            userId: userInfo.userId
        })
    }, [userData])


    // const suggestions = useMemo(() => {
    //     if (!searchQuery.trim() || !userGames) return [];
    //     return userGames
    //         .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    //         .slice(0, 3)
    //         .map(g => g.name);
    // }, [searchQuery, userGames]);

    return (
        <div className={styles.userSetting}>
            <div className={styles.splitWrapper}>
                {/* <UserInfo

                />
                <UserGameInfo

                /> */}
                {
                    userData ? (
                        <>
                        <UserInfo stateIsEditing={stateIsEdit} userData={{userInfo: userData, setUserInfo: setUserData}}/>
                        </>
                    ) : (
                        <LoadingAnimation />
                    )
                }
            </div>
        </div>
    );
}
