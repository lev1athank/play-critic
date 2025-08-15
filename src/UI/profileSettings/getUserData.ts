import apiClient from "@/tool/axiosClient";

export async function getUserData(userName:string) {
   console.log(userName);
   const userInfo = await apiClient.get(`/api/getUserInfo?userName=${userName}`)
   const games = await apiClient.get(`/api/getUserGames?userName=${userName}`)
   userInfo.data.games = games.data.games
   console.log(userInfo, 1231);
   

   
   return userInfo
}

export interface SaveUserDataParams {
   userId: string;
   descriptionProfile: string;
   loveGame: string;
   isCloseProfile: boolean;
   avatar?: File | string;
}

export async function saveUserData(params: SaveUserDataParams) {
   console.log(params, 111);

   try {
      // Формируем обычный объект для передачи в JSON body
      const body: any = {
         userId: params.userId,
         descriptionProfile: params.descriptionProfile,
         loveGame: params.loveGame,
         isCloseProfile: params.isCloseProfile,
      };

      // Если есть новый аватар (файл), его нужно загрузить отдельно, иначе передаем строку (url)
      if (params.avatar instanceof File) {
         // Обычно аватар загружается отдельно, но если нужно, можно реализовать отдельную загрузку
         // Здесь просто пропускаем avatar, если это файл
      } else if (typeof params.avatar === 'string') {
         body.avatarUrl = params.avatar;
      }

      const response = await apiClient.post('/api/updateUserProfile', body);

      return response;
   } catch (error) {
      console.error('Ошибка при сохранении данных пользователя:', error);
      throw error;
   }
}

// Функция для загрузки аватара отдельно (если нужно)
export async function uploadAvatar(file: File, userName: string) {
   try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userName', userName);
      
      const response = await apiClient.post('/api/uploadAvatar', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      
      return response.data.avatarUrl;
   } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
      throw error;
   }
}

