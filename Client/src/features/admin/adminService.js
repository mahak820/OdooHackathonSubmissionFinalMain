import axios from "axios";
import { api } from "../../../Api/api"; // Adjust path if needed

// --- Existing Services ---

// Get all non-admin users
const getUsers = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${api}/admin/users`, config);
    return response.data;
};

const getBookings = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${api}/admin/bookings`, config);
    return response.data;
};

const getVenues = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${api}/admin/venues`, config);
    return response.data;
};

// --- NEW Services for Venue Actions ---

// Approve a venue
const approveVenue = async (venueId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // The backend expects { "isApproved": true } in the body
    const response = await axios.put(`${api}/admin/venues/approve/${venueId}`, { isApproved: true }, config);
    return response.data;
};

// Delete a venue
const deleteVenue = async (venueId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${api}/admin/venues/delete/${venueId}`, config);
    // The backend returns a success message, but we need the ID to update the state
    return { venueId }; 
};

const adminService = {
    getUsers,
    getBookings,
    getVenues,
    approveVenue, // Add new service
    deleteVenue   // Add new service
};

export default adminService;