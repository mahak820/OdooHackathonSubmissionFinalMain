import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import venueService from "./venueService";




const venueSlice = createSlice({
    name : "venue",
    initialState : {
     
        venues :[],
        venue : {} ,
        
        isLoading : false ,
        isError : false ,
        isSuccess : false,
        message : ""
    },
    reducers : {},
    extraReducers : builder => {
        builder
       .addCase(fetchVenues.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.venues = action.payload
      })
      .addCase(fetchVenues.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
      })
      //Fetch single venue 
      .addCase(fetchVenue.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(fetchVenue.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.venue = action.payload; // Corrected state to handle a single venue
        })
        .addCase(fetchVenue.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
        })
      //Get all venues of owner 
      .addCase(getAllVenuesOfOwner.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
      })
      .addCase(getAllVenuesOfOwner.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.venues = action.payload
      })
      .addCase(getAllVenuesOfOwner.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error.message;
      })
         // GET topics
        // .addCase(getStudentProjects.pending ,(state,action)=>{
        //         state.isLoading = true
        //         state.isError = false
        //         state.isSuccess = false
        //          // state.message =
        // })
        // .addCase(getStudentProjects.fulfilled ,(state,action)=>{
        //     state.isLoading = false
        //     state.isError = false
        //     state.isSuccess = true
        //     state.projects = action.payload
        // })
        // .addCase(getStudentProjects.rejected ,(state,action)=>{
        //     state.isLoading = false
        //     state.isError = true
        //     state.isSuccess = false
        //     state.message = action.message
        // })
        
       
       
       
     
    }
})
export default venueSlice.reducer
 

// fetch all venues
export const fetchVenues = createAsyncThunk("FETCH/VENUES", async(_,thunkAPI)=>{
        
    console.log("Hellooo")

    try{
 return await venueService.getvenues()
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })
//   fetch a single venue
export const fetchVenue = createAsyncThunk("FETCH/VENUE", async(venueId,thunkAPI)=>{
    // console.log("Venue ID " , venueId) 
     
const token = thunkAPI.getState().auth.user.token;
    console.log(token) 
    try{
 return await venueService.getvenue(venueId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })


//GET ALL FACILITIES OF OWNER 

export const getAllVenuesOfOwner = createAsyncThunk("FETCH/All_Venues_Owner", async(_ ,thunkAPI)=>{
    // console.log(venueId) 
    console.log("Hellooo")
    // const userData = thunkAPI.getState().auth.user
    // console.log(userData)
     const userId = thunkAPI.getState().auth.user.id

    const token = thunkAPI.getState().auth.user.token
    // console.log(token) 
    console.log(userId)
    try{
 return await venueService.getAllVenuesOfOwnerService(userId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })
