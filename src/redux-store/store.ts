import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { apiSlice } from "./apiSlice";
import { createIdbStorage } from "./idbStorage";
import authReducer from "./Slices/authSlice";
import cartReducer from "./Slices/cartSlice";
import scheduleReducer from "./Slices/scheduleSlice";
import staffAuthReducer from "./Slices/staffAuthSlice";

// Create IndexedDB storage for redux-persist
const idbStorage = createIdbStorage("LocalMart-web-store");

// Configure persist options for our root reducer
const persistConfig = {
  key: "root",
  version: 1,
  storage: idbStorage,
  whitelist: ["auth", "cart", "staffAuth", "schedule"],
  blacklist: ["api"], // Don't persist API cache
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  schedule: scheduleReducer,
  staffAuth: staffAuthReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist middleware needs these actions to be ignored
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

// Create persistor for use with PersistGate
export const persistor = persistStore(store);

// Setup listeners for automatic refetching
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
