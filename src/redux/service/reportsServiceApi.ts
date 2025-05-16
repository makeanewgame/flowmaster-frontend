import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";


export const reportServiceApi = createApi({
    reducerPath: "reportServiceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Report'],
    endpoints: (builder) => ({
        createBot: builder.mutation({
            query: (payload) => ({
                url: "/chatHistory/",
                method: "POST",
                body: payload,
                FormData: true,
            }),
            invalidatesTags: ['Report'],
        }),
        delete: builder.mutation({
            query: (payload) => ({
                url: "/bot/delete",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ['Report'],
        }),
        chatHistoryList: builder.query({
            query: () => "/report/chatHistory/list",
            providesTags: ['Report'],
        }),
        chatHistoryDetails: builder.query({
            query: (id) => `/report/chatHistory/detail/${id}`,
            providesTags: ['Report'],
        }),
        userQuotaUsage: builder.query({
            query: () => `/report/user/usage`,
            providesTags: ['Report']
        }),
        geoLocations: builder.query({
            query: () => `/report/geoLocations`,
            providesTags: ['Report'],
            transformResponse: (response: any) => {
                const transformedData = response.map((item: any) => ({
                    id: item.id,
                    latitude: parseFloat(item.GeoLocation[0].latitude),
                    longitude: parseFloat(item.GeoLocation[0].longitude),
                    ip: item.GeoLocation[0].ip,
                    city: item.GeoLocation[0].city,
                    country: item.GeoLocation[0].country,
                    region: item.GeoLocation[0].region,
                }));
                return transformedData;
            },
        }),

    }),
});

export const { useCreateBotMutation, useDeleteMutation, useChatHistoryListQuery, useChatHistoryDetailsQuery, useUserQuotaUsageQuery, useGeoLocationsQuery } = reportServiceApi;