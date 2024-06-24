"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/components/axios";

interface AuthContextType {
  role: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  role: null,
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: any) => {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole) {
      setRole(JSON.parse(storedRole));
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await axiosInstance.post("users/auth", credentials, {
        withCredentials: true,
      });
      const userRes = res.data;
      if (userRes && userRes.status === "success") {
        setRole(userRes?.role);
        localStorage.setItem("role", JSON.stringify(userRes?.role))
        router.push("/tickets");
      } else {
        throw new Error("Error de autenticación");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error desconocido");
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
