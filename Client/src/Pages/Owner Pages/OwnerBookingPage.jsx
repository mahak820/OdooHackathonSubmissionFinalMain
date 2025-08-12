import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Star, X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// In a real app, you would have a thunk to fetch this data
// import { getBookingsOfOwner } from '../../features/booking/bookingSlice';

// --- MOCK DATA ---
const bookingsData = [
  { id: 1, user: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?w=100&q=80' }, venue: { name: "Champion's Turf", court: 'Turf A (5v5)' }, date: '2025-08-15', time: '6:00 PM', status: 'Upcoming' },
  { id: 2, user: { name: 'Priya Mehta', avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&q=80' }, venue: { name: 'SportZone Arena', court: 'Badminton Court 2' }, date: '2025-08-12', time: '4:00 PM', status: 'Completed', review: { rating: 5, comment: "Fantastic court, very well maintained. Will visit again!" } },
  { id: 3, user: { name: 'Anika Singh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }, venue: { name: "Champion's Turf", court: 'Turf B (7v7)' }, date: '2025-08-10', time: '8:00 PM', status: 'Cancelled' },
  { id: 4, user: { name: 'Sameer Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }, venue: { name: "Champion's Turf", court: 'Turf A (5v5)' }, date: '2025-08-10', time: '5:00 PM', status: 'Completed', review: { rating: 4, comment: "Great game, but the booking was a bit pricey." } },
  { id: 5, user: { name: 'Vikram Reddy', avatar: 'https://images.unsplash.com/photo-1595997239194-44b317e0881f?w=100&q=80' }, venue: { name: 'City Cricket Nets', court: 'Net 3' }, date: '2025-08-16', time: '11:00 AM', status: 'Upcoming' },
];

// --- Sub-Components ---
const StatusBadge = ({ status, index }) => {
  const statusClasses = {
    Upcoming: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200",
    Cancelled: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
    Completed: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-200",
  };
  
  return (
    <motion.span 
      className={`text-xs font-semibold px-3 py-2 rounded-full ${statusClasses[status]} shadow-sm`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: index * 0.1 + 0.5,
        type: "spring",
        stiffness: 300 
      }}
      whileHover={{ scale: 1.1 }}
    >
      {status}
    </motion.span>
  );
};

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md m-4 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          <motion.button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 hover:rotate-90 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20}/>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent mb-6">
              Customer Review
            </h3>
            
            <div className="flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2 + i * 0.1,
                    type: "spring",
                    stiffness: 300 
                  }}
                >
                  <Star 
                    className={`w-8 h-8 ${i < review.rating ? 'text-orange-400 fill-current' : 'text-gray-300'} transition-colors`} 
                  />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-orange-50 to-gray-50 p-4 rounded-xl border border-orange-100"
            >
              <p className="text-gray-700 italic leading-relaxed">"{review.comment}"</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Bookings Page Component ---
const OwnerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  
  // In a real app, you would use this
  // const { bookings, isLoading } = useSelector(state => state.booking);
  // const dispatch = useDispatch();
  // useEffect(() => { dispatch(getBookingsOfOwner()); }, [dispatch]);
  const bookings = bookingsData; // Using mock data for now

  const filteredBookings = useMemo(() => {
    return (bookings || [])
      .filter(booking => {
        if (activeTab !== 'All' && booking.status !== activeTab) {
          return false;
        }
        if (searchTerm && !booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !booking.venue.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [bookings, activeTab, searchTerm]);

  return (
    <>
      <motion.div 
        className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-orange-50 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Bookings Management
            </motion.h1>
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              View and manage all bookings for your facilities with advanced insights.
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Filter and Search Controls */}
            <motion.div 
              className="p-6 flex flex-col sm:flex-row gap-6 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex-grow relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                </motion.div>
                <motion.input 
                  type="text" 
                  placeholder="Search by user or venue..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                />
              </div>
              
              <motion.div 
                className="flex-shrink-0 flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab, index) => (
                  <motion.button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white transform scale-105' 
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: activeTab === tab ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Bookings Table */}
            <motion.div 
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <motion.thead 
                    className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-orange-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-orange-500" />
                          User
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-orange-500" />
                          Venue & Court
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-orange-500" />
                          Date & Time
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 font-bold">Status</th>
                      <th scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-orange-500" />
                          Review
                        </div>
                      </th>
                    </tr>
                  </motion.thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredBookings.map((booking, index) => (
                        <motion.tr 
                          key={booking.id} 
                          className="bg-white border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent transition-all duration-200 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ 
                            delay: 1.1 + index * 0.1,
                            duration: 0.3 
                          }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <td className="px-6 py-5">
                            <motion.div 
                              className="flex items-center gap-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2 + index * 0.1 }}
                            >
                              <motion.img 
                                src={booking.user.avatar} 
                                alt={booking.user.name} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 shadow-sm"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              />
                              <span className="font-medium text-gray-900 group-hover:text-black transition-colors">
                                {booking.user.name}
                              </span>
                            </motion.div>
                          </td>
                          <td className="px-6 py-5">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.3 + index * 0.1 }}
                            >
                              <div className="font-medium text-gray-800 group-hover:text-black transition-colors">
                                {booking.venue.name}
                              </div>
                              <div className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors">
                                {booking.venue.court}
                              </div>
                            </motion.div>
                          </td>
                          <td className="px-6 py-5">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.4 + index * 0.1 }}
                            >
                              <div className="font-medium text-gray-800 flex items-center gap-2 group-hover:text-black transition-colors">
                                <Calendar size={14} className="text-orange-500" />
                                {booking.date}
                              </div>
                              <div className="text-gray-500 text-sm flex items-center gap-2 group-hover:text-gray-600 transition-colors">
                                <Clock size={14} className="text-orange-400" />
                                {booking.time}
                              </div>
                            </motion.div>
                          </td>
                          <td className="px-6 py-5">
                            <StatusBadge status={booking.status} index={index} />
                          </td>
                          <td className="px-6 py-5">
                            {booking.review ? (
                              <motion.button 
                                onClick={() => setSelectedReview(booking.review)} 
                                className="flex items-center gap-2 font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-all duration-200 group/review"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Star size={16} className="fill-current group-hover/review:animate-pulse"/> 
                                {booking.review.rating}.0
                              </motion.button>
                            ) : (
                              <motion.span 
                                className="text-gray-400 text-xs bg-gray-50 px-3 py-2 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 + index * 0.1 }}
                              >
                                No Review
                              </motion.span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {filteredBookings.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.div 
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Search className="w-10 h-10 text-orange-600" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h4>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
      </AnimatePresence>
    </>
  );
};

export default OwnerBookingsPage;