"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await axiosInstance.post("users/auth", credentials, {
        withCredentials: true,
      });
      const userRes = res.data;
      if (userRes && userRes.status === "success") {
        setUser(userRes.user);
        localStorage.setItem("user", JSON.stringify(userRes.user));
        router.push("/tickets");
      } else {
        throw new Error("Error de autenticación");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error desconocido");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
