import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCreadentials, logOut } from "../features/authSlice";
import { jwtDecode } from "jwt-decode";
import { addToast } from "@heroui/toast";

const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: "include",
  headers: {
    "Allow-Credentials": "true",
    // "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Accept-Charset": "latin-1",
  },
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth?.token?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("language", localStorage.getItem("i18nextLng") || "en");
    return headers;
  },
});

export const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.log(result.error);

    const toastIgnoredErrors = [409, 503]

    if (result.error) {
      console.log("status", result.error.status);

      if (toastIgnoredErrors.includes((result.error.status as any))) {
        return result;
      }
      else {
        addToast({
          title: "Error",
          description: result.error?.data ? (result.error.data as any).message : "An error occured",
          color: "danger",
        })
      }
    }

  }

  if (result.error?.status === 401) {
    console.log("____REFRESH TOKEN____");
    interface RefreshResultData {
      accessToken: string;
    }

    const refreshResult = (await baseQuery(
      { url: "/auth/refresh" },
      api,
      extraOptions
    )) as { data: RefreshResultData };
    if (refreshResult?.data) {
      console.log(refreshResult?.data);

      const openToken: any = jwtDecode(refreshResult?.data?.accessToken);
      api.dispatch(
        setCreadentials({
          email: openToken.email,
          role: openToken.role,
          token: refreshResult?.data?.accessToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};
