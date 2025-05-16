import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";


export const contentServiceApi = createApi({
    reducerPath: "contentServiceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ContentCollection'],
    endpoints: (builder) => ({
        createContent: builder.mutation({
            query: (payload) => ({
                url: "/content/create",
                method: "POST",
                body: payload,
                FormData: true,
            }),
            invalidatesTags: ['ContentCollection'],
        }),
        deleteContent: builder.mutation({
            query: (payload) => ({
                url: "/content/delete",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['ContentCollection'],
        }),
        getContents: builder.query({
            query: (body) => ({
                url: "/content/getContents",
                method: "POST",
                body: body,
            }),
            providesTags: ['ContentCollection'],
        }),


    }),
});

export const { useCreateContentMutation, useDeleteContentMutation, useGetContentsQuery } = contentServiceApi;