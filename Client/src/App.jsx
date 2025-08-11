import React from 'react'

import HomePage from './Pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import { NavbarDemo } from './components/Navbar'
import Page1 from './Pages/Page1'
import JellyCursor from './components/ui/JellyCursor'
import LoginPage from './Pages/LoginPage'
import AdminHome from './Pages/AdminHome'
import AllVenuesPage from './Pages/AllVenues'
import VenueDetailsPage from './Pages/VenueDetailsPage'
import RegisterPage from './Pages/RegisterPage'

const App = () => {
  return (
    <BrowserRouter>

        <NavbarDemo/>
        <JellyCursor/>

        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/allVenues' element={<AllVenuesPage/>}/>
          <Route path="/venue/:venueId" element={<VenueDetailsPage />} />
          <Route path='/page1' element={<Page1/>}/>
          <Route path='/admin' element={<AdminHome/>}/>
        </Routes>
    

    </BrowserRouter>
   
      

    
  )
}

export default App
