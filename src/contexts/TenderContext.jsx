/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import api, { tenderAPI } from "@/services/api";

const TenderContext = createContext();

const initialState = {
  tenders: [],
  selectedTender: null,
  loading: false,
  error: null,
  filters: {
    category: "",
    status: "",
    search: "",
  },
};

const tenderReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TENDERS":
      return { ...state, tenders: action.payload, loading: false };
    case "SET_SELECTED_TENDER":
      return { ...state, selectedTender: action.payload };
    case "ADD_TENDER":
      return { ...state, tenders: [action.payload, ...state.tenders] };
    case "UPDATE_TENDER":
      return {
        ...state,
        tenders: state.tenders.map((tender) =>
          (tender.id ?? tender._id) ===
          (action.payload.id ?? action.payload._id)
            ? action.payload
            : tender
        ),
      };
    case "DELETE_TENDER":
      return {
        ...state,
        tenders: state.tenders.filter(
          (tender) => (tender.id ?? tender._id) !== action.payload
        ),
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const TenderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tenderReducer, initialState);

  const setError = useCallback((e) => {
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      "Unexpected error";
    dispatch({ type: "SET_ERROR", payload: msg });
    return msg;
  }, []);

  const fetchTenders = useCallback(
    async (filters = {}) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Forward filters as query params; backend should handle unknown params gracefully
        const res = await tenderAPI.getAll(filters);
        const list = res?.data?.items ?? res?.data ?? [];
        dispatch({
          type: "SET_TENDERS",
          payload: Array.isArray(list) ? list : [],
        });
      } catch (e) {
        setError(e);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [setError]
  );

  const createTender = useCallback(
    async (tenderData, files = [], onUploadProgress) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Normalize files to an array (supports FileList, single File, or array)
        const arr = Array.isArray(files)
          ? files
          : files
          ? Array.from(files)
          : [];

        let res;
        if (arr.length > 0) {
          const formData = new FormData();
          // Append scalar fields, JSON-encode objects/arrays if present
          Object.entries(tenderData || {}).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            const v = typeof value === "object" ? JSON.stringify(value) : value;
            formData.append(key, v);
          });
          arr.forEach((file) => {
            if (file) formData.append("documents", file);
          });
          res = await api.post("/tenders", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress,
          });
        } else {
          res = await tenderAPI.create(tenderData);
        }

        const tender = res?.data?.tender ?? res?.data;
        if (tender) dispatch({ type: "ADD_TENDER", payload: tender });
        return { success: true, tender };
      } catch (e) {
        const msg = setError(e);
        return { success: false, error: msg };
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [setError]
  );

  const updateTender = useCallback(
    async (id, updates) => {
      if (!id) return { success: false, error: "Missing id" };
      try {
        const res = await tenderAPI.update(id, updates);
        const updated = res?.data?.tender ?? res?.data ?? { id, ...updates };
        dispatch({ type: "UPDATE_TENDER", payload: updated });
        return { success: true, tender: updated };
      } catch (e) {
        const msg = setError(e);
        return { success: false, error: msg };
      }
    },
    [setError]
  );

  const deleteTender = useCallback(
    async (id) => {
      if (!id) return { success: false, error: "Missing id" };
      try {
        await tenderAPI.delete(id);
        dispatch({ type: "DELETE_TENDER", payload: id });
        return { success: true };
      } catch (e) {
        const msg = setError(e);
        return { success: false, error: msg };
      }
    },
    [setError]
  );

  const setFilters = useCallback((filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    ...state,
    fetchTenders,
    createTender,
    updateTender,
    deleteTender,
    setFilters,
    clearError,
    setSelectedTender: (tender) =>
      dispatch({ type: "SET_SELECTED_TENDER", payload: tender }),
  };

  return (
    <TenderContext.Provider value={value}>{children}</TenderContext.Provider>
  );
};

export const useTender = () => {
  const context = useContext(TenderContext);
  if (!context) {
    throw new Error("useTender must be used within a TenderProvider");
  }
  return context;
};
