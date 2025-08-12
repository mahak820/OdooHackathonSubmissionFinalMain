import axios from "axios";
import { api } from "../../../Api/api";
// get all bookings
const getAllBookings = async ( token) => {
  console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${api}/booking`, config);
   
    return response.data;
};


// add booking 
const addBooking = async (bookingData, venueId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Make the POST request to create the booking
  const response = await axios.post(`${api}/venueId`, bookingData, config);
  
  return response.data;
};

const getBookingsOfOwner = async (token) => {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const response = await axios.get(`${api}/booking/allbookingsowner`, options);

  return response.data;  // <-- return yaha zaroori hai
};

const getmyBookings = async (uid, token) => {
   

    const options = {
        headers: {
          
            Authorization: `Bearer ${token}`, 
        },
    };

    try {
        const response = await axios.get(`${api}/booking/${uid}`, options);
        console.log("API Response Data:", response.data); 
        return response.data;
    } catch (error) {
       
        console.error("Error in getmyBookings service:", error.response?.data || error.message);
        throw error;
    }
};







const bookingService = {getBookingsOfOwner,getmyBookings,getAllBookings,addBooking}

export default bookingService