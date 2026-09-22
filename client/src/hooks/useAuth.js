import { useAuthStore } from "../store/authStore.js";
import api from "../api/axios.js";

export function useAuth() {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  const doLogin = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    login(data.token, data.user);
    return data.user;
  };

  const doRegister = async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    login(data.token, data.user);
    return data.user;
  };

  return {
    token,
    user,
    isAuthenticated,
    login: doLogin,
    register: doRegister,
    logout,
  };
}
