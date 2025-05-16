import { configureStore } from "@reduxjs/toolkit";
import { authServiceApi } from "./service/authServiceApi";
import authReducer from "./features/authSlice";
import botReducer from "./features/botSlice";
import websocketReducer from "./features/websocketSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { fileServiceApi } from "./service/fileServiceApi";
import { botServiceApi } from "./service/botServiceApi";
import { quotaServiceApi } from "./service/quotaServiceApi";
import { reportServiceApi } from "./service/reportsServiceApi";
import { websocketApi } from "./service/websocketApi";
import { contentServiceApi } from "./service/contentServiceApi";

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["websocket"], // Do not persist websocket slice
};

const reducers = combineReducers({
    [authServiceApi.reducerPath]: authServiceApi.reducer,
    [fileServiceApi.reducerPath]: fileServiceApi.reducer,
    [botServiceApi.reducerPath]: botServiceApi.reducer,
    [quotaServiceApi.reducerPath]: quotaServiceApi.reducer,
    [reportServiceApi.reducerPath]: reportServiceApi.reducer,
    [websocketApi.reducerPath]: websocketApi.reducer,
    [contentServiceApi.reducerPath]: contentServiceApi.reducer,
    auth: authReducer,
    bot: botReducer,
    websocket: websocketReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "websocket/setSocket",
                    "websocket/clearSocket"
                ],
                ignoredPaths: ["websocket.socket"],
            },
            immutableCheck: true,
        })
            .concat(authServiceApi.middleware)
            .concat(fileServiceApi.middleware)
            .concat(botServiceApi.middleware)
            .concat(quotaServiceApi.middleware)
            .concat(reportServiceApi.middleware)
            .concat(websocketApi.middleware)
            .concat(contentServiceApi.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;