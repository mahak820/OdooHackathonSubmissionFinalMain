import axios from "axios";
import { api } from "../../../Api/api";

const getvenues = async () => {
    // console.log("object")
  const response = await axios.get(`${api}/venue`);
//   console.log(response.data)
  return response.data;
};

const getvenue = async (venueId, token) => {
//   console.log("Service ID:", venueId);
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${api}/venue/${venueId}`, options);
//   console.log("Response data:", response.data);
  return response.data;  // <-- return yaha zaroori hai
};

//Gett all venues of owner 
const getAllVenuesOfOwnerService = async (userId, token) => {
  
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${api}/venue/owner/${userId}`, options);
//   console.log("Response data:", response.data);
  return response.data;  // <-- return yaha zaroori hai
};



// const deteleProjects = async(_pid , token) =>{
// console.log(_pid)
//    const options = {
//     headers: {
//       Authorization: Bearer ${token},
//     },
//   };
//   const response = await axios.delete(/api/project/${_pid}, options);
// //  console.log(response.data)
//   return response.data;
// }


const venueService = {getvenues,getvenue , getAllVenuesOfOwnerService}
export default venueService