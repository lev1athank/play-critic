import axios from "axios";

// Счетчик попыток обновления токена
let refreshTokenAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

const apiClient = axios.create({
    baseURL: "http://localhost:3452", 
    withCredentials: true, 
    headers: {
        "Content-Type": "application/json", 
    },
});

apiClient.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Проверяем, не превышено ли максимальное количество попыток
            if (refreshTokenAttempts >= MAX_REFRESH_ATTEMPTS) {
                console.error("Превышено максимальное количество попыток обновления токена");
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            refreshTokenAttempts++;

            try {
                await apiClient.post("/auth/refresh-token"); 
                
                // Сбрасываем счетчик при успешном обновлении
                refreshTokenAttempts = 0;

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Ошибка обновления токенов:", refreshError);
                
                // Если это последняя попытка, сбрасываем счетчик
                if (refreshTokenAttempts >= MAX_REFRESH_ATTEMPTS) {
                    refreshTokenAttempts = 0;
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
