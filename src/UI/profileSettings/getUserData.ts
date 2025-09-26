import apiClient from "@/tool/axiosClient";
import { SaveUserDataParams } from "@/types/userInfo";

export async function getUserData(userName: string): Promise<any> {
   const userInfo = await apiClient.get(`/api/getUserInfo?userName=${userName}`)
   // return new Promise((resolve) => {
   //    setTimeout(() => {
   //       resolve(userInfo)
   //    }, 5000)
   // })
   return userInfo
}



export async function saveUserData(params: SaveUserDataParams) {
   try {
      console.log(params);

      // Если есть новый аватар (файл), сначала загружаем его
      if (params.avatar instanceof File) {
         // Используем ID пользователя как имя файла
         const formData = new FormData();
         formData.append('avatar', params.avatar);
         formData.append('userId', params.userId); // для формирования имени файла на сервере

         // Загружаем аватар
         const avatarResponse = await apiClient.post('/api/uploadUserAvatar', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         const response = await apiClient.post('/api/updateUserProfile', params);

         return response;
      } else {
         // Если аватар не меняется, просто обновляем остальные данные
         const response = await apiClient.post('/api/updateUserProfile', {
            userId: params.userId,
            userName: params.userName,
            descriptionProfile: params.descriptionProfile,
            loveGame: params.loveGame,
            isCloseProfile: params.isCloseProfile,
         });

         return response;
      }
   } catch (error) {
      console.error('Ошибка при сохранении данных пользователя:', error);
      throw error;
   }
}


