import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";

export const quotaServiceApi = createApi({
    reducerPath: "quotaServiceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Quota'],
    endpoints: (builder) => ({
        quotaList: builder.query({
            query: (userID) => "/quota/list?user=" + userID,
            providesTags: ['Quota'],
        }),

    }),
});

export const { useQuotaListQuery, } = quotaServiceApi;