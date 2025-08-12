import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";

const initialState = {
    users: [],
    bookings: [],
    venues: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
};

// --- Existing Thunks ---
export const getUsers = createAsyncThunk("admin/getUsers", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getUsers(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getBookings = createAsyncThunk("admin/getBookings", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getBookings(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getVenues = createAsyncThunk("admin/getVenues", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getVenues(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- NEW Thunks for Venue Actions ---
export const approveVenue = createAsyncThunk("admin/approveVenue", async (venueId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.approveVenue(venueId, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteVenue = createAsyncThunk("admin/deleteVenue", async (venueId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.deleteVenue(venueId, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});


const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        }
    },
    extraReducers: builder => {
        builder
            // getUsers cases
            .addCase(getUsers.pending, (state) => { state.isLoading = true; })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // getBookings cases
            .addCase(getBookings.pending, (state) => { state.isLoading = true; })
            .addCase(getBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookings = action.payload;
            })
            .addCase(getBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // getVenues cases
            .addCase(getVenues.pending, (state) => { state.isLoading = true; })
            .addCase(getVenues.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.venues = action.payload;
            })
            .addCase(getVenues.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // --- NEW Cases for Venue Actions ---
            .addCase(approveVenue.fulfilled, (state, action) => {
                const updatedVenue = action.payload;
                state.venues = state.venues.map((venue) =>
                    venue._id === updatedVenue._id ? { ...venue, isApproved: true } : venue
                );
            })
            .addCase(deleteVenue.fulfilled, (state, action) => {
                const { venueId } = action.payload;
                state.venues = state.venues.filter((venue) => venue._id !== venueId);
            });
    }
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
