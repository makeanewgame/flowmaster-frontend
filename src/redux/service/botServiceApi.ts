import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";


export const botServiceApi = createApi({
    reducerPath: "botServiceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Bot'],
    endpoints: (builder) => ({
        createBot: builder.mutation({
            query: (payload) => ({
                url: "/bot/create",
                method: "POST",
                body: payload,
                FormData: true,
            }),
            invalidatesTags: ['Bot'],
        }),
        delete: builder.mutation({
            query: (payload) => ({
                url: "/bot/delete",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Bot'],
        }),
        rename: builder.mutation({
            query: (payload) => ({
                url: "/bot/rename",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Bot'],
        }),
        changeStatus: builder.mutation({
            query: (payload) => ({
                url: "/bot/changeStatus",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Bot'],
        }),
        listBots: builder.query({
            query: () => "/bot/list",
            providesTags: ['Bot'],
        }),
        chat: builder.mutation({
            query: (payload) => ({
                url: "/bot/chat",
                method: "POST",
                body: payload,
            }),
        }),
        saveAppearance: builder.mutation({
            query: (payload) => ({
                url: "/bot/saveAppearance",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Bot'],
        }),
        getAppearance: builder.query({
            query: (payload) => ({
                url: "/bot/getAppearance",
                method: "POST",
                body: payload,
            }),
            providesTags: ['Bot'],
        })
    }),
});

export const { useCreateBotMutation, useDeleteMutation, useListBotsQuery, useRenameMutation, useChangeStatusMutation, useChatMutation, useSaveAppearanceMutation, useGetAppearanceQuery } = botServiceApi;