import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";

const adminSlice = createSlice({
    name : "admin",
    initialState : {
     
        users :[],
        bookings : [] ,
       
        
        isLoading : false ,
        isError : false ,
        isSuccess : false,
        message : ""
    },
    reducers : {},
    extraReducers : builder => {
        builder
        .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.users = [];
            });

       
       
     
    }
})
export default adminSlice.reducer

// Get all users (Admin only)
export const getUsers = createAsyncThunk(
    "admin/getUsers",
    async (_, thunkAPI) => {
        try {
            // const token = thunkAPI.getState().auth.user.token; // auth slice se token
            return await adminService.getUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getBookings = createAsyncThunk(
    "admin/getBookings",
    async (_, thunkAPI) => {
        try {
            // const token = thunkAPI.getState().auth.user.token; // auth slice se token
            return await adminService.getUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);