import { createApi } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";

// WebSocket baseQuery is a dummy, as we manage the connection manually
const websocketBaseQuery = async () => ({ data: undefined });

export const websocketApi = createApi({
    reducerPath: "websocketApi",
    baseQuery: websocketBaseQuery,
    endpoints: () => ({}),
});

export const initializeWebSocket = (
    url: string,
    onMessage: (msg: any) => void,
    options?: Record<string, any>
): Socket => {
    const socket = io(url, options);
    socket.on("connect", () => {
        // Optionally handle connect
    });
    socket.on("message", onMessage);
    socket.on("disconnect", () => {
        // Optionally handle disconnect
    });
    socket.on("error", () => {
        // Optionally handle error
    });
    return socket;
};
