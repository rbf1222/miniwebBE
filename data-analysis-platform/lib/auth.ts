import { create } from "zustand";

// 1. 기존 User 인터페이스에 avatarUrl을 추가합니다.
interface User {
  username: string;
  role: "admin" | "user";
  token: string;
  avatarUrl?: string; // 프로필 사진 URL (optional)
}

// 2. 기존 AuthState 인터페이스에 updateUser 함수를 추가합니다.
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (token: string, role: "admin" | "user", username: string) => void;
  logout: () => void;
  initialize: () => void;
  updateUser: (newUserInfo: Partial<User>) => void; // 프로필 업데이트 함수
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (token: string, role: "admin" | "user", username:string) => {
    const user = { username, role, token };
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_role", role);
    localStorage.setItem("auth_username", username);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_username");
    localStorage.removeItem("auth_avatarUrl"); // 로그아웃 시 avatarUrl도 제거합니다.
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("auth_role") as "admin" | "user" | null;
    const username = localStorage.getItem("auth_username");
    const avatarUrl = localStorage.getItem("auth_avatarUrl") || undefined; // localStorage에서 avatarUrl도 불러옵니다.

    if (token && role && username) {
      set({
        user: { username, role, token, avatarUrl }, // user 객체에 avatarUrl을 포함시킵니다.
        isAuthenticated: true,
        isInitializing: false,
      });
    } else {
      set({
        isInitializing: false,
      });
    }
  },

  // 3. updateUser 함수의 실제 동작을 구현합니다.
  updateUser: (newUserInfo) => {
    const currentState = get();
    // 로그인된 상태일 때만 동작합니다.
    if (currentState.user) {
      // 새로운 정보를 기존 user 정보와 합칩니다.
      const updatedUser = { ...currentState.user, ...newUserInfo };
      
      // 변경된 정보(username, avatarUrl)를 localStorage에도 업데이트합니다.
      if (newUserInfo.username) {
        localStorage.setItem("auth_username", newUserInfo.username);
      }
      if (newUserInfo.avatarUrl) {
        localStorage.setItem("auth_avatarUrl", newUserInfo.avatarUrl);
      } else if (newUserInfo.avatarUrl === null) {
        // avatarUrl을 null로 업데이트하면 localStorage에서 제거합니다.
        localStorage.removeItem("auth_avatarUrl");
      }

      // Zustand 상태를 업데이트합니다.
      set({ user: updatedUser });
    }
  },
}));
