import { createSlice } from "@reduxjs/toolkit";

const botSlice = createSlice({
    name: "bot",
    initialState: {
        botList: [],
        currentBot: null,
        chatId: null,
        messages: [],
    },
    reducers: {
        setBots: (state, action) => {
            state.botList = action.payload;
        },
        setCurrentBot: (state, action) => {
            state.currentBot = action.payload;
        },
        cleanBotState: (state) => {
            state.currentBot = null;
            state.botList = [];
        },
        updateChatId: (state, action) => {
            state.chatId = action.payload;
        },
        updateChatMessages: (state, action) => {
            state.messages = action.payload;
        },
        clearChatMessages: (state) => {
            state.messages = [];
        },
        clearChatId: (state) => {
            state.chatId = null
        }
    },
});

export const { setBots, setCurrentBot, cleanBotState, updateChatId, updateChatMessages, clearChatMessages, clearChatId } =
    botSlice.actions;

export default botSlice.reducer;

export const selectCurrentUserBot = (state: any) => state.bot.currentBot;

export const selectCurrentChatId = (state: any) => state.bot.chatId;

export const selectCurrentChat = (state: any) => state.bot.messages;
