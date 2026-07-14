import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer, {
  login,
  logout,
  type AuthState,
} from "@/pages/auth/features/authSlice";

const persistedAuthReducer = persistReducer<AuthState>(
  { key: "auth", storage },
  authReducer,
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["auth.token"],
      },
    }),
});

export const persistor = persistStore(store);

export { login, logout };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
