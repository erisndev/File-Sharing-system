// src/contexts/AuthProvider.jsx
import React, { useReducer, useEffect } from "react";
import { AuthContext } from "./authContext";
import { authAPI } from "@/services/api";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await authAPI.me();
        const user = res.data?.user || res.data || null;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.error("Auth initialization error:", err);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    init();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await authAPI.login(credentials);

      const token = res.data?.token || res.data?.accessToken;
      const userFromRes = res.data?.user;

      if (token) localStorage.setItem("token", token);

      let user = userFromRes;
      if (!user) {
        const meRes = await authAPI.me();
        user = meRes.data?.user || meRes.data;
      }

      if (!user) throw new Error("Unable to retrieve user profile");

      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (data) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await authAPI.register(data);

      const token = res.data?.token || res.data?.accessToken;
      const userFromRes = res.data?.user;

      if (token) localStorage.setItem("token", token);

      let user = userFromRes;
      if (!user) {
        const meRes = await authAPI.me();
        user = meRes.data?.user || meRes.data;
      }

      if (!user) throw new Error("Unable to retrieve user profile");

      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
