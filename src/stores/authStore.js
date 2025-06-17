import Cookies from "js-cookie";
import { create } from "zustand";

const initToken = Cookies.get("token");
const isLoggedIn = !!initToken;

const useAuthStore = create((set) => ({
    token: initToken,
    isLoggedIn: isLoggedIn,
    setToken: (token) => {
        Cookies.set("token", token);
        set({ token, isLoggedIn: true });
    },
    logout: () => {
        Cookies.remove("token");
        set({ token: '', isLoggedIn: false });
    }
}))
export default useAuthStore;