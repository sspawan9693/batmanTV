import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    authLoading: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authLoading = false;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.authLoading = false;
        },

        finishAuthCheck: (state) => {
            state.authLoading = false;
        },
    },
});

export const {
    login,
    logout,
    finishAuthCheck,
} = authSlice.actions;

export default authSlice.reducer;