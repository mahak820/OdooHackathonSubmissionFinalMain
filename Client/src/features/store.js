import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import venue from "./venue/venueSlice"


const store = configureStore(
    {
        reducer : {auth , venue}
    }
)

export default store