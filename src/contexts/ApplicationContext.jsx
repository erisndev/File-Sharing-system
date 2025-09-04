/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";
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
  _req: { mine: 0, byTender: {}, current: 0 },
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
          ? arr.map((a) =>
              a?.id === id ? { ...a, status, ...(payload || {}) } : a
            )
          : arr;

      // update mine
      const mine = updateArray(state.mine);

      // update all byTender lists
      const byTender = Object.keys(state.byTender).reduce((acc, key) => {
        acc[key] = updateArray(state.byTender[key]);
        return acc;
      }, {});

      // update current
      const current =
        state.current && state.current.id === id
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

  // Request guards to avoid stale updates
  const mineReqRef = useRef(0);
  const byTenderReqRef = useRef({});
  const currentReqRef = useRef(0);

  // Normalize entities to have a stable id and nested tender id
  const normalize = useCallback((item) => {
    if (!item || typeof item !== "object") return item;
    const id = item.id ?? item._id;
    const tender =
      item.tender && typeof item.tender === "object"
        ? { ...item.tender, id: item.tender.id ?? item.tender._id }
        : item.tender;
    return { ...item, id, tender };
  }, []);

  const setError = (e) => {
    const message =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      "Unexpected error";
    dispatch({ type: "SET_ERROR", payload: message });
    return message;
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  const fetchMine = useCallback(
    async (params) => {
      const reqId = ++mineReqRef.current;
      dispatch({ type: "SET_LOADING_MINE", payload: true });
      try {
        const res = await applicationAPI.getMine(params);
        const listRaw = res?.data?.applications ?? res?.data ?? [];
        const list = Array.isArray(listRaw) ? listRaw.map(normalize) : [];
        if (mineReqRef.current !== reqId) return;
        dispatch({ type: "SET_MINE", payload: list });
      } catch (e) {
        if (mineReqRef.current !== reqId) return;
        setError(e);
      } finally {
        if (mineReqRef.current === reqId)
          dispatch({ type: "SET_LOADING_MINE", payload: false });
      }
    },
    [normalize]
  );

  const fetchByTender = useCallback(
    async (tenderId, params) => {
      if (!tenderId) return;
      const key = String(tenderId);
      byTenderReqRef.current[key] = (byTenderReqRef.current[key] || 0) + 1;
      const reqId = byTenderReqRef.current[key];
      dispatch({
        type: "SET_LOADING_BY_TENDER",
        payload: { tenderId, loading: true },
      });
      try {
        const res = await applicationAPI.getByTender(tenderId, params);
        const listRaw = res?.data?.applications ?? res?.data ?? [];
        const list = Array.isArray(listRaw) ? listRaw.map(normalize) : [];
        if (byTenderReqRef.current[key] !== reqId) return;
        dispatch({
          type: "SET_BY_TENDER",
          payload: { tenderId, applications: list },
        });
      } catch (e) {
        if (byTenderReqRef.current[key] !== reqId) return;
        setError(e);
      } finally {
        if (byTenderReqRef.current[key] === reqId) {
          dispatch({
            type: "SET_LOADING_BY_TENDER",
            payload: { tenderId, loading: false },
          });
        }
      }
    },
    [normalize]
  );

  const fetchById = useCallback(
    async (id) => {
      if (!id) return;
      const reqId = ++currentReqRef.current;
      dispatch({ type: "SET_LOADING_CURRENT", payload: true });
      try {
        const res = await applicationAPI.getById(id);
        const itemRaw = res?.data?.application ?? res?.data ?? null;
        const item = itemRaw ? normalize(itemRaw) : null;
        if (currentReqRef.current !== reqId) return;
        dispatch({ type: "SET_CURRENT", payload: item });
      } catch (e) {
        if (currentReqRef.current !== reqId) return;
        setError(e);
      } finally {
        if (currentReqRef.current === reqId)
          dispatch({ type: "SET_LOADING_CURRENT", payload: false });
      }
    },
    [normalize]
  );

  const updateStatus = useCallback(
    async (id, status) => {
      if (!id || !status)
        return { success: false, error: "Missing id or status" };
      dispatch({ type: "SET_UPDATING", payload: true });
      try {
        const res = await applicationAPI.updateStatus(id, status);
        const itemRaw = res?.data?.application ?? res?.data ?? { id, status };
        const item = normalize(itemRaw);
        dispatch({
          type: "UPDATE_STATUS",
          payload: { id: item.id, status: item.status, payload: item },
        });
        return { success: true, data: item };
      } catch (e) {
        const msg = setError(e);
        return { success: false, error: msg };
      } finally {
        dispatch({ type: "SET_UPDATING", payload: false });
      }
    },
    [normalize]
  );

  const value = {
    ...state,
    clearError,
    fetchMine,
    fetchByTender,
    fetchById,
    updateStatus,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx)
    throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
};
