import axios from "axios";
import React, { createContext, useContext, useState, FC } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";

interface User {
  name: string;
  email: string;
  organization_id: string;
  profession: string;
  contact: string;
}

interface UserContextProps {
  userData: unknown;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface UserProviderProps {
  children: React.ReactNode; // ReactNode represents any renderable JSX
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token);
  });

  const [cookies, setCookie] = useCookies(["token"]);

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setCookie("token", token, { path: "/" });
  };

  const removeToken = () => {
    localStorage.removeItem("token");
  };

  const loginMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      // console.log(email, password);
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        { email, password }
      );
      const { token, user } = response.data.data;
      // const { token } = response.data;
      console.log(response.data.data);
      const { name, organization, phone: contact } = user;
      setToken(token);
      const { designation: profession, organization_id } = organization;
      setUserData({ name, email, contact, profession, organization_id });
    }
  );

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeToken();
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoggedIn,
        isLoading: loginMutation.isLoading,
        isSuccess: loginMutation.isSuccess,
        isError: loginMutation.isError,
        error: loginMutation.error,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
