import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,

    },
    reducers: {
        setCreadentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        }
    }

});

export const { setCreadentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;

export const selectCurrentToken = (state: any) => state.auth.token;

export const selectCurrentUserRoles = (state: any) => state.auth.roles;