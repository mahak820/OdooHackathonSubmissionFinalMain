import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Star, X } from 'lucide-react';
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
const StatusBadge = ({ status }) => {
  const statusClasses = {
    Upcoming: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-green-100 text-green-800",
  };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"><X size={20}/></button>
        <h3 className="text-xl font-bold text-gray-800">Booking Review</h3>
        <div className="flex items-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
        </div>
        <p className="text-gray-600 mt-4 italic">"{review.comment}"</p>
      </motion.div>
    </div>
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-1 text-gray-600">View and manage all bookings for your facilities.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border">
            {/* Filter and Search Controls */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 border-b">
              <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search by user or venue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex-shrink-0 flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                  {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === tab ? 'bg-white shadow text-green-600' : 'text-gray-600 hover:bg-gray-200'}`}>
                          {tab}
                      </button>
                  ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">User</th>
                    <th scope="col" className="px-6 py-3">Venue & Court</th>
                    <th scope="col" className="px-6 py-3">Date & Time</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src={booking.user.avatar} alt={booking.user.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium text-gray-900">{booking.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{booking.venue.name}</div>
                        <div className="text-gray-500">{booking.venue.court}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{booking.date}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-6 py-4">
                        {booking.review ? (
                          <button onClick={() => setSelectedReview(booking.review)} className="flex items-center gap-1 font-semibold text-yellow-500 hover:text-yellow-600">
                            <Star size={16} className="fill-current"/> {booking.review.rating}.0
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">No Review</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBookings.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                    <h4 className="font-semibold">No Bookings Found</h4>
                    <p>Try adjusting your search or filter.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
      </AnimatePresence>
    </>
  );
};

export default OwnerBookingsPage;