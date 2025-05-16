import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./reauth";

export const authServiceApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["User"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
        invalidateTags: ["User", "File"],
      }),
    }),
    // register: builder.mutation({
    //   query: (credentials) => ({
    //     url: "/auth/register",
    //     method: "POST",
    //     body: { ...credentials },
    //   }),
    // }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),

      onQueryStarted: async ({ queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          console.log("Başarılı yanıt:", response);
        } catch (error) {
          console.error("Hata:", error);
        }
      },
    }),

    activateEmail: builder.mutation({
      query: (credentials) => ({
        url: "/auth/activate-registration",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    ActivateLostPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/activate-lost-password",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/lost-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { ...data },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useActivateEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authServiceApi;
