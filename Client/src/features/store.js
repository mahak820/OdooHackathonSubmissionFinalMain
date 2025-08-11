import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/authSlice"
import venue from "./auth/authSlice"


const store = configureStore(
    {
        reducer : {auth , venue}
    }
)

export default store