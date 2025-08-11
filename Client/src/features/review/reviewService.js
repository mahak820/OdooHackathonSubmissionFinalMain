import axios from "axios";
import { api } from "../../../Api/api";



const getreviews = async ( venueId,token) => {
 console.log(token)
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(token)

  const response = await axios.get(`${api}/review/venue/${venueId}`, options);
  console.log("Response data:", response.data);
  return response.data;  // <-- return yaha zaroori hai
};





const reviewService = {getreviews}
export default reviewService