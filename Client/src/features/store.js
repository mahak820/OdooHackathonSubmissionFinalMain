import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import venue from "./venue/venueSlice"
import review from "./review/reviewSlice"


const store = configureStore(
    {
        reducer : {auth , venue , review}
    }
)

export default store