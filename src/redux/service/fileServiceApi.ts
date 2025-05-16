import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";


export const fileServiceApi = createApi({
    reducerPath: "fileServiceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['File', 'FileCollection'],
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (payload) => ({
                url: "/file/upload",
                method: "POST",
                body: payload,
                FormData: true,
            }),
            invalidatesTags: ['File'],
        }),
        deleteFile: builder.mutation({
            query: (payload) => ({
                url: "/file/delete",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['File'],
        }),
        getFiles: builder.query({
            query: ({ userID, botId }) => "/file/getfiles?user=" + userID + "&botId=" + botId,
            providesTags: ['File'],
        }),
        ingestDocuments: builder.mutation({
            query: (payload) => ({
                url: "/file/ingest",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['File'],
        }),
        getCollection: builder.query({
            query: ({ botId }) => ({
                url: "/file/getCollection",
                method: "POST",
                body: { botId },
            }),
            providesTags: ['FileCollection'],
        }),
    }),
});

export const { useUploadFileMutation, useDeleteFileMutation, useGetFilesQuery, useIngestDocumentsMutation, useGetCollectionQuery } = fileServiceApi;