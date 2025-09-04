import React, { createContext, useCallback, useContext, useReducer } from "react";
import { applicationAPI } from "@/services/api";

const ApplicationContext = createContext(null);

const initialState = {
  mine: [], // bidder's applications
  byTender: {}, // { [tenderId]: Application[] }
  current: null, // currently viewed application
  loadingMine: false,
  loadingByTender: {}, // { [tenderId]: boolean }
  loadingCurrent: false,
  updating: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SET_LOADING_MINE":
      return { ...state, loadingMine: action.payload };
    case "SET_LOADING_BY_TENDER": {
      const { tenderId, loading } = action.payload;
      return {
        ...state,
        loadingByTender: { ...state.loadingByTender, [tenderId]: loading },
      };
    }
    case "SET_LOADING_CURRENT":
      return { ...state, loadingCurrent: action.payload };
    case "SET_UPDATING":
      return { ...state, updating: action.payload };

    case "SET_MINE":
      return { ...state, mine: action.payload };
    case "SET_BY_TENDER": {
      const { tenderId, applications } = action.payload;
      return {
        ...state,
        byTender: { ...state.byTender, [tenderId]: applications },
      };
    }
    case "SET_CURRENT":
      return { ...state, current: action.payload };

    case "UPDATE_STATUS": {
      const { id, status, payload } = action.payload;

      // Helper to update an array by id
      const updateArray = (arr) =>
        Array.isArray(arr)
          ? arr.map((a) => (a?.id === id ? { ...a, status, ...(payload || {}) } : a))
          : arr;

      // update mine
      const mine = updateArray(state.mine);

      // update all byTender lists
      const byTender = Object.keys(state.byTender).reduce((acc, key) => {
        acc[key] = updateArray(state.byTender[key]);
        return acc;
      }, {});

      // update current
      const current = state.current && state.current.id === id
        ? { ...state.current, status, ...(payload || {}) }
        : state.current;

      return { ...state, mine, byTender, current };
    }

    default:
      return state;
  }
}

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setError = (e) => {
    const message =
      e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unexpected error";
    dispatch({ type: "SET_ERROR", payload: message });
    return message;
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const fetchMine = useCallback(async () => {
    dispatch({ type: "SET_LOADING_MINE", payload: true });
    try {
      const res = await applicationAPI.getMine();
      const list = res?.data?.applications ?? res?.data ?? [];
      dispatch({ type: "SET_MINE", payload: Array.isArray(list) ? list : [] });
    } catch (e) {
      setError(e);
    } finally {
      dispatch({ type: "SET_LOADING_MINE", payload: false });
    }
  }, []);

  const fetchByTender = useCallback(async (tenderId) => {
    if (!tenderId) return;
    dispatch({ type: "SET_LOADING_BY_TENDER", payload: { tenderId, loading: true } });
    try {
      const res = await applicationAPI.getByTender(tenderId);
      const list = res?.data?.applications ?? res?.data ?? [];
      dispatch({ type: "SET_BY_TENDER", payload: { tenderId, applications: Array.isArray(list) ? list : [] } });
    } catch (e) {
      setError(e);
    } finally {
      dispatch({ type: "SET_LOADING_BY_TENDER", payload: { tenderId, loading: false } });
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    if (!id) return;
    dispatch({ type: "SET_LOADING_CURRENT", payload: true });
    try {
      const res = await applicationAPI.getById(id);
      const item = res?.data?.application ?? res?.data ?? null;
      dispatch({ type: "SET_CURRENT", payload: item });
    } catch (e) {
      setError(e);
    } finally {
      dispatch({ type: "SET_LOADING_CURRENT", payload: false });
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    if (!id || !status) return { success: false, error: "Missing id or status" };
    dispatch({ type: "SET_UPDATING", payload: true });
    try {
      const res = await applicationAPI.updateStatus(id, status);
      const item = res?.data?.application ?? res?.data ?? { id, status };
      dispatch({ type: "UPDATE_STATUS", payload: { id, status: item.status, payload: item } });
      return { success: true, data: item };
    } catch (e) {
      const msg = setError(e);
      return { success: false, error: msg };
    } finally {
      dispatch({ type: "SET_UPDATING", payload: false });
    }
  }, []);

  const value = {
    ...state,
    clearError,
    fetchMine,
    fetchByTender,
    fetchById,
    updateStatus,
  };

  return (
    <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
};
