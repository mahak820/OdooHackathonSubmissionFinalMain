import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import venueService from "./venueService";




const venueSlice = createSlice({
    name : "venue",
    initialState : {
     
        venues :[],
        
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
    console.log(venueId) 
     
const token = thunkAPI.getState().auth.user.token;
    console.log(token) 
    try{
 return await venueService.getvenue(venueId,token)
    }catch(error){
       const message = error.response.data.message
       return thunkAPI.rejectWithValue(message) 
    }
 })




// // get a single user projects 
//  export const getProjects = createAsyncThunk("GET/PROJECTS",async (uid, thunkAPI) => {
//   console.log(uid)
//     const token = thunkAPI.getState().auth.user.token;
 
//     try {
//       return await projectService.getUserProjects(uid,token);
//     } catch (error) {
//       const message = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
// delete a single user projects