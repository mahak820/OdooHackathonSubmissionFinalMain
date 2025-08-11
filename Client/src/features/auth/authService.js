import axios from "axios"
import { api } from "../../../Api/api"

const register = async (formData) => {

    const response = await axios.post(`${api}/auth/register` , formData)
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
    // console.log(response.data)

}

const login = async (formData) => {

    const response = await axios.post(`${api}/auth/login` , formData)
    localStorage.setItem('user' , JSON.stringify(response.data))
    return response.data
    // console.log(response.data)

}

const logout = async () => {

    localStorage.removeItem("user")

}

const authService = {register , logout , login}

export default authService