import { ICard } from "./Card";



interface TUserProfile {
    descriptionProfile: string;
    loveGame: number[];
    isCloseProfile: boolean;
}

export interface TUserInfo {
    login: string;
    userName: string;
    avatar: string;
    _id: string;
    profileId: TUserProfile;   // данные профиля отдельно, необязательные
    userGamesId: ICard[];
    _avatarFile?: File | null;
}


export interface SaveUserDataParams {
   userId: string;
   userName: string;
   descriptionProfile: string;
   loveGame: number[];
   isCloseProfile: boolean;
   avatar?: File | null;
}