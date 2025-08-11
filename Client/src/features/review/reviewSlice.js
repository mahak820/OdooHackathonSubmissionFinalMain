import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "./reviewService";




const reviewSlice = createSlice({
    name : "review",
    initialState : {
     
        reviews :[],
       
        
        isLoading : false ,
        isError : false ,
        isSuccess : false,
        message : ""
    },
    reducers : {},
    extraReducers : builder => {
        builder
       .addCase(fetchReviews.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.reviews = action.payload
      })
      .addCase(fetchReviews.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
      })
        
        
       
       
       
     
    }
})
export default reviewSlice.reducer
 

// fetch all venues
export const fetchReviews = createAsyncThunk("FETCH/REVIEWS", async(venueId,thunkAPI)=>{
  
const token = thunkAPI.getState().auth.user.token;
console.log(token)
    try{
 return await reviewService.getreviews(venueId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })
//   fetch a single venue