import axios from "axios";

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
            originalRequest._retry = true;

            try {
                await apiClient.post("/auth/refresh-token"); 

                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Ошибка обновления токенов:", refreshError);

                // Здесь можно обработать завершение сессии
                // Например, перенаправить на страницу авторизации
                // window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
