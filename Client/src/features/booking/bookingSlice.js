import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingService from "./bookingService";


const bookingSlice = createSlice({
    name : "booking",
    initialState : {
     
        bookings :[],
        booking : {} ,
       
        
        isLoading : false ,
        isError : false ,
        isSuccess : false,
        message : ""
    },
    reducers : {},
    extraReducers : builder => {
        builder
        .addCase(fetchmyBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        })
        .addCase(fetchmyBooking.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.bookings = action.payload; 
        })
        .addCase(fetchmyBooking.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
            
            })
            .addCase(postbooking.pending, (state) => {
                state.isLoading = true; 
            })
            .addCase(postbooking.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookings = [action.payload];
            })
            .addCase(postbooking.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; 
            })
            .addCase(getBookingsOfOwner.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                    state.isSuccess = false;
              })
              .addCase(getBookingsOfOwner.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.isError = false
                    state.isSuccess = true
                    state.bookings = action.payload
              })
              .addCase(getBookingsOfOwner.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.isSuccess = false;
                    state.message = action.error.message;
              })
                    
       
       
       
     
    }
})

export default bookingSlice.reducer
// fetch user bookings
export const fetchmyBooking = createAsyncThunk("FETCH/Booking", async({userId},thunkAPI)=>{
        
    console.log(userId)
const token = thunkAPI.getState().auth.user.token;

    try{
 return await bookingService.getmyBookings(userId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })
 // fetch user bookings
export const fetchallBooking = createAsyncThunk("FETCH/allBooking", async(thunkAPI)=>{
        
 console.log(token)
const token = thunkAPI.getState().auth.user.token;

    try{
 return await bookingService.getmyBookings(token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })

  // add user booking
export const postbooking = createAsyncThunk("ADD/Booking", async({formData,venueId},thunkAPI)=>{
        
 console.log(venueId)
const token = thunkAPI.getState().auth.user.token;

    try{
 return await bookingService.addBooking(formData,venueId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })

 export const getBookingsOfOwner = createAsyncThunk(
  "booking/getAllBookingsOwner",
  async (_, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;

    try {
      return await bookingService.getBookingsOfOwner(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);