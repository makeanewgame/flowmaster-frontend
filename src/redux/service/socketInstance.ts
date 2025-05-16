import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
    return socket;
}

export function initSocket(url: string, options: any) {
    if (!socket) {
        socket = io(url, options);
    }
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
