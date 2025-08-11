import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Edit, Trash2, AlertTriangle, ArrowLeft, Calendar, Mail, User,
  Target, Zap, Waves, ShieldCheck, Circle, Clock, MapPin, Activity, Star, Award, TrendingUp
} from 'lucide-react';

// --- Helper for Sport Icons ---
const sportIcons = {
  Football: <Circle size={16} className="inline mr-2 text-[#FF6B35]" />,
  Badminton: <Zap size={16} className="inline mr-2 text-[#FF6B35]" />,
  Swimming: <Waves size={16} className="inline mr-2 text-[#FF6B35]" />,
  Tennis: <Target size={16} className="inline mr-2 text-[#FF6B35]" />,
  Default: <ShieldCheck size={16} className="inline mr-2 text-[#FF6B35]" />
};

// --- MOCK DATA ---
const userProfileData = {
  name: 'Rohan Sharma',
  email: 'rohan.sharma@example.com',
  profilePhoto: 'https://images.unsplash.com/photo-1615109398623-88346a601842?w=500&q=80',
  joinedDate: '2023-05-12',
  totalBookings: 12,
  upcomingCount: 2,
  completedCount: 5,
  favoriteVenue: 'Champions Turf',
  preferredSport: 'Football'
};

const initialBookingsData = [
  { id: 1, venueName: 'Champions Turf', address: 'Bandra West, Mumbai', date: '2025-08-15', time: '6:00 PM - 7:00 PM', sport: 'Football', status: 'upcoming' },
  { id: 2, venueName: 'SportZone Arena', address: 'Downtown Mumbai', date: '2025-08-22', time: '10:00 AM - 12:00 PM', sport: 'Badminton', status: 'upcoming' },
  { id: 3, venueName: 'AquaFit Center', address: 'Powai, Mumbai', date: '2024-07-28', time: '8:00 AM - 9:00 AM', sport: 'Swimming', status: 'past' },
  { id: 4, venueName: 'Champions Turf', address: 'Bandra West, Mumbai', date: '2024-07-15', time: '7:00 PM - 8:00 PM', sport: 'Football', status: 'past' },
  { id: 5, venueName: 'Racket Club', address: 'Versova, Mumbai', date: '2024-06-20', time: '5:00 PM - 6:00 PM', sport: 'Tennis', status: 'past' },
];

// --- Sub-Components ---

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }} 
          exit={{ scale: 0.9, y: 20 }} 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 text-center"
        >
          <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-4">Cancel Booking?</h3>
          <p className="text-gray-600 mt-2">Are you sure you want to cancel this booking? This action cannot be undone.</p>
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={onClose} 
              className="px-6 py-2 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Keep It
            </button>
            <button 
              onClick={onConfirm} 
              className="px-6 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition"
            >
              Yes, Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BookingCard = ({ booking, onUpdate, onDelete }) => {
  const isUpcoming = booking.status === 'upcoming';
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      transition={{ duration: 0.3 }} 
      className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#4ECDC4] hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`h-1 ${isUpcoming ? 'bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35]' : 'bg-gray-300'}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {sportIcons[booking.sport] || sportIcons.Default}
              <span className="text-sm font-semibold text-[#FF6B35] uppercase tracking-wide">{booking.sport}</span>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">{booking.venueName}</h4>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin size={14} className="mr-2 text-[#4ECDC4]" />
              {booking.address}
            </p>
          </div>
          <div className={`text-xs font-bold px-3 py-2 rounded-full shadow-sm ${
            isUpcoming 
              ? 'bg-gradient-to-r from-[#4ECDC4] to-[#4ECDC4]/80 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isUpcoming ? '✨ Upcoming' : '✓ Completed'}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
              <Calendar size={14} className="mr-2 text-[#4ECDC4]" />
              <span className="font-medium">{booking.date}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
              <Clock size={14} className="mr-2 text-[#FF6B35]" />
              <span className="font-medium">{booking.time}</span>
            </div>
          </div>
          {isUpcoming && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button 
                onClick={onUpdate} 
                className="p-3 rounded-xl hover:bg-[#4ECDC4]/10 text-gray-500 hover:text-[#4ECDC4] transition-all hover:scale-110"
                title="Edit booking"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={onDelete} 
                className="p-3 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all hover:scale-110"
                title="Cancel booking"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Enhanced Profile Sidebar Component ---
const ProfileSidebar = ({ navigate }) => {
  return (
    <div className="space-y-6">
      
      {/* Back Button Card */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-4"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-3 text-gray-600 hover:text-[#4ECDC4] font-semibold transition-all group w-full"
        >
          <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-[#4ECDC4]/10 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Back to Dashboard</span>
        </button>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 text-center"
      >
        <div className="relative inline-block mb-4">
          <img 
            src={userProfileData.profilePhoto} 
            alt={userProfileData.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" 
          />
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] rounded-full p-2 shadow-lg">
            <User size={12} className="text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{userProfileData.name}</h2>
        <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mb-2">
          <Mail size={14} className="text-[#4ECDC4]" />
          <span>{userProfileData.email}</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
          <Calendar size={12} className="text-[#FF6B35]" />
          <span>Since {new Date(userProfileData.joinedDate).toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-[#4ECDC4]" size={20} />
          Your Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#4ECDC4]/10 to-[#4ECDC4]/5 rounded-xl">
            <span className="text-gray-700 text-sm font-medium">Total Bookings</span>
            <span className="text-[#4ECDC4] font-bold text-lg">{userProfileData.totalBookings}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 rounded-xl">
            <span className="text-gray-700 text-sm font-medium">Upcoming</span>
            <span className="text-[#FF6B35] font-bold text-lg">{userProfileData.upcomingCount}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-700 text-sm font-medium">Completed</span>
            <span className="text-gray-600 font-bold text-lg">{userProfileData.completedCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Favorites Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="text-[#FF6B35]" size={20} />
          Favorites
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Favorite Venue</p>
            <p className="text-gray-800 font-semibold">{userProfileData.favoriteVenue}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Preferred Sport</p>
            <p className="text-gray-800 font-semibold flex items-center">
              {sportIcons[userProfileData.preferredSport]}
              {userProfileData.preferredSport}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Button */}
      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Edit size={18} />
        Edit Profile
      </motion.button>

    </div>
  );
};

// --- Main Profile Page Component ---
const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState(initialBookingsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const navigate = useNavigate || (() => {});

  const upcomingBookings = useMemo(() => bookings.filter(b => b.status === 'upcoming'), [bookings]);
  const pastBookings = useMemo(() => bookings.filter(b => b.status === 'past'), [bookings]);

  const handleDeleteClick = (bookingId) => {
    setBookingToDelete(bookingId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setBookings(prev => prev.filter(b => b.id !== bookingToDelete));
    setIsModalOpen(false);
    setBookingToDelete(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Side by Side Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Profile (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ProfileSidebar navigate={navigate} />
              </div>
            </div>
            
            {/* Right Content - Bookings (2/3 width) */}
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] rounded-xl">
                        <Activity className="text-white" size={24} />
                      </div>
                      My Bookings
                    </h3>
                    <p className="text-gray-600 mt-2">Manage and track your venue reservations</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-xl">
                    <span className="text-sm text-gray-600">{bookings.length} total bookings</span>
                  </div>
                </div>
                
                {/* Enhanced Tabs */}
                <div className="bg-gray-50 rounded-2xl p-2 mb-8">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveTab('upcoming')} 
                      className={`px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                        activeTab === 'upcoming' 
                          ? 'bg-white text-[#4ECDC4] shadow-lg transform scale-105' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Clock size={18} />
                        <span>Upcoming ({upcomingBookings.length})</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('past')} 
                      className={`px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                        activeTab === 'past' 
                          ? 'bg-white text-[#4ECDC4] shadow-lg transform scale-105' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Award size={18} />
                        <span>Past ({pastBookings.length})</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Bookings List */}
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'upcoming' && (
                        upcomingBookings.length > 0 ? (
                          <div className="grid gap-6">
                            {upcomingBookings.map((booking, index) => 
                              <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <BookingCard 
                                  booking={booking} 
                                  onUpdate={() => alert(`Update booking ${booking.id}`)} 
                                  onDelete={() => handleDeleteClick(booking.id)} 
                                />
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-16">
                            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#FF6B35]/10 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                              <Calendar className="h-12 w-12 text-[#4ECDC4]" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">No upcoming bookings</h4>
                            <p className="text-gray-600">Ready to book your next adventure?</p>
                          </div>
                        )
                      )}
                      {activeTab === 'past' && (
                        pastBookings.length > 0 ? (
                          <div className="grid gap-6">
                            {pastBookings.map((booking, index) => 
                              <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <BookingCard booking={booking} />
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-16">
                            <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#FF6B35]/10 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                              <Award className="h-12 w-12 text-[#FF6B35]" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">No past bookings yet</h4>
                            <p className="text-gray-600">Your booking history will appear here.</p>
                          </div>
                        )
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
      
      <ConfirmDeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} />
    </>
  );
};

export default MyProfilePage;