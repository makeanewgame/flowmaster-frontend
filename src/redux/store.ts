import { configureStore } from "@reduxjs/toolkit";
import { authServiceApi } from "./service/authServiceApi";
import authReducer from "./features/authSlice";
import websocketReducer from "./features/websocketSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { websocketApi } from "./service/websocketApi";


const persistConfig = {
    key: "root",
    storage,
    blacklist: ["websocket"], // Do not persist websocket slice
};

const reducers = combineReducers({
    [authServiceApi.reducerPath]: authServiceApi.reducer,
    [websocketApi.reducerPath]: websocketApi.reducer,
    auth: authReducer,
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
            .concat(websocketApi.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;