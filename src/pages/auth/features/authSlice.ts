import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import type { ILoginCredentials } from "../types/authTypes";
import { sendLogin } from "../services/authServices";
import { ROUTE_PRIVILEGES } from "@/auth/accessControl";

export type AuthUser = {
  name?: string;
  lastname?: string;
  email?: string;
  privileges?: string[];
  [key: string]: unknown;
};

type DecodedToken = {
  privileges?: string[];
  [key: string]: unknown;
};

type AuthLoginPayload = {
  token: string;
  refreshToken?: string;
  user: AuthUser;
};

export interface AuthState {
  authenticated: boolean;
  token: string;
  refreshToken: string;
  user: AuthUser;
  sessionExpireModalVisible: boolean;
  decodedToken: DecodedToken;
  timerSession: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  authenticated: true,
  token: "",
  refreshToken: "",
  user: {
    name: "Portal",
    lastname: "CLI España",
    email: "portal-cli@energyasset.cl",
    privileges: Object.values(ROUTE_PRIVILEGES),
  },
  sessionExpireModalVisible: false,
  decodedToken: {
    privileges: Object.values(ROUTE_PRIVILEGES),
  },
  timerSession: null,
  loading: false,
  error: null,
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null) {
    const maybeResponse = "response" in err ? err.response : undefined;
    if (typeof maybeResponse === "object" && maybeResponse !== null) {
      const maybeData = "data" in maybeResponse ? maybeResponse.data : undefined;
      if (typeof maybeData === "object" && maybeData !== null) {
        const maybeMessage = "message" in maybeData ? maybeData.message : undefined;
        if (typeof maybeMessage === "string") return maybeMessage;
      }
    }

    const maybeMessage = "message" in err ? err.message : undefined;
    if (typeof maybeMessage === "string") return maybeMessage;
  }

  return fallback;
};

export const loginAsync = createAsyncThunk<
  AuthLoginPayload,
  ILoginCredentials,
  { rejectValue: string }
>(
  "auth/loginAsync",
  async (credentials: ILoginCredentials, { rejectWithValue }) => {
    try {
      const data = await sendLogin(credentials);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Error desconocido al iniciar sesión",
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
        user: AuthUser;
      }>
    ) => {
      state.authenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || "";
      state.user = action.payload.user;
      state.error = null;

      try {
        state.decodedToken = jwtDecode(action.payload.token);
      } catch {
        state.decodedToken = {};
      }
    },

    logout: (state) => {
      state.authenticated = false;
      state.decodedToken = {};
      state.token = "";
      state.refreshToken = "";
      state.user = {};
      state.error = null;
      state.loading = false;

      if (state.timerSession) {
        clearInterval(state.timerSession);
      }
      state.timerSession = null;
    },

    setAuthenticate: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },

    setTimerSession: (state, action: PayloadAction<number>) => {
      state.timerSession = action.payload;
    },

    showSessionExpireModal: (state) => {
      state.sessionExpireModalVisible = true;
    },

    hideSessionExpireModal: (state) => {
      state.sessionExpireModalVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      loginAsync.fulfilled,
      (state, action: PayloadAction<AuthLoginPayload>) => {
        state.loading = false;
        state.authenticated = true;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || "";
        state.user = action.payload.user;
        state.error = null;

        try {
          state.decodedToken = jwtDecode(action.payload.token);
        } catch {
          state.decodedToken = {};
        }

        toast.success("Inicio de sesión exitoso!");
      }
    );

    builder.addCase(loginAsync.rejected, (state, action) => {
      state.loading = false;
      state.authenticated = false;
      state.token = "";
      state.refreshToken = "";
      state.user = {};
      state.decodedToken = {};
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Error al iniciar sesión";
    });
  },
});

export const {
  login,
  logout,
  showSessionExpireModal,
  hideSessionExpireModal,
  setTimerSession,
  setAuthenticate,
} = authSlice.actions;

export default authSlice.reducer;

export const selectAuthenticated = (state: { auth: AuthState }) =>
  state.auth.authenticated;

export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export const selectAuthOptions = (state: { auth: AuthState }) => state.auth;
