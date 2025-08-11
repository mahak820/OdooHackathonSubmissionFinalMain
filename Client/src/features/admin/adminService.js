import axios from "axios";
import { api } from "../../../Api/api";


// Get all non-admin users
const getUsers = async () => {


    const response = await axios.get(`${api}/admin/users`);
    return response.data;
    // console.log(response.data)
};

const adminService = {
    getUsers,
};

export default adminService;
