import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// --- Your Page Imports ---
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import Page1 from './Pages/Page1';
import LoginPage from './Pages/LoginPage';
import AllVenuesPage from './Pages/AllVenues';
import VenueDetailsPage from './Pages/VenueDetailsPage';
import RegisterPage from './Pages/RegisterPage';
import MyProfilePage from './Pages/MyProfile';

// --- Owner Page Imports ---
import OwnerDashboard from './Pages/Owner Pages/ownerDashboard';
import MyFacilitiesPage from './Pages/Owner Pages/MyFacilities';
import OwnerBookingsPage from './Pages/Owner Pages/OwnerBookingPage';

// --- Admin Page Imports ---
// import AdminDashboard from './pages/admin/AdminDashboard'; // Assuming you created this file

// --- Your Layout Imports ---
import Layout from './Layout';
import OwnerLayout from './components/OwnerLayout';
// import AdminLayout from './components/admin/AdminLayout'; // Import the new AdminLayout
import AdminDashboard from './Pages/Admin Pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import FacilityApprovalsPage from './Pages/Admin Pages/FacilityApprovalsPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes are now children of the main Layout */}
        <Route element={<Layout />}>

          {/* User-facing pages */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/allVenues' element={<AllVenuesPage />} />
          <Route path="/venue/:venueId" element={<VenueDetailsPage />} />
          <Route path="/myProfile" element={<MyProfilePage />} />
          <Route path='/page1' element={<Page1 />} />

          {/* Owner pages routes */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="facilities" element={<MyFacilitiesPage />} />
            <Route path="bookings" element={<OwnerBookingsPage />} />
          </Route>

          {/* --- UPDATED: Admin Routes --- */}
          {/* All admin pages are now nested inside the AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="approvals" element={<FacilityApprovalsPage />} />
            
            {/* Add other admin routes here as you build them */}
            {/* e.g., <Route path="approvals" element={<FacilityApprovalsPage />} /> */}
            {/* e.g., <Route path="users" element={<UserManagementPage />} /> */}
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;