import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import venue from "./venue/venueSlice"
import review from "./review/reviewSlice"
import booking from "./booking/bookingSlice"
import admin from "./admin/adminSlice"


const store = configureStore(
    {
        reducer : {auth , venue , review , booking , admin}
    }
)

export default store