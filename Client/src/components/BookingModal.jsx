import React, { useState, useMemo, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { X, Loader2 } from 'lucide-react'; // Import Loader2 for a loading spinner
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks
import { postbooking } from '../features/booking/bookingSlice'; // Import your thunk
import { toast } from 'react-toastify'; // Or any other notification library you use

// Import the stylesheet for the calendar
import 'react-datepicker/dist/react-datepicker.css';

// Helper function to generate time slots (no changes needed here)
const generateTimeSlots = (startHour, endHour) => {
  const slots = [];
  for (let i = startHour; i <= endHour; i++) {
    slots.push(`${i}:00`);
  }
  return slots;
};

// --- MAIN MODAL COMPONENT ---
export const BookingModal = ({ venue, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(''); // Local state for API errors

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get booking state from Redux store to track loading status
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.booking);

  // This effect will run when the booking API call finishes
  useEffect(() => {
    if (isError) {
      setError(message); // Set local error state from Redux
      toast.error(message); // Show error notification
    }

    if (isSuccess && !isLoading) {
      toast.success("Booking successful! Redirecting...");
      onClose(); // Close the modal
      navigate("/myProfile"); // Navigate to user's bookings page
    }
  }, [isError, isSuccess, isLoading, message, navigate, onClose]);


  const handleBookingSubmit = () => {
    setError(''); // Clear previous errors
    const bookingData = {
      date: selectedDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      startTime,
      endTime,
      totalPrice,
    };
    
    // Dispatch the thunk with formData and venueId
    dispatch(postbooking({ formData: bookingData, venueId: venue._id }));
  };


  // --- All other functions (bookedSlots, timeSlots, handleStartTimeSelect, availableEndTimes, totalPrice) remain the same ---
  // Simulate already booked slots for the selected date
  const bookedSlots = useMemo(() => {
    const day = selectedDate.getDay();
    if (day % 3 === 0) return ["10:00", "11:00", "15:00"];
    if (day % 3 === 1) return ["9:00", "13:00", "14:00", "18:00"];
    return ["12:00", "17:00"];
  }, [selectedDate]);

  const timeSlots = generateTimeSlots(7, 22); // 7 AM to 10 PM

  const handleStartTimeSelect = (time) => {
    setStartTime(time);
    setEndTime(null); // Reset end time when start time changes
  };

  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];
    
    const startIndex = timeSlots.indexOf(startTime);
    let nextBookedIndex = -1;

    for (let i = startIndex + 1; i < timeSlots.length; i++) {
      if (bookedSlots.includes(timeSlots[i])) {
        nextBookedIndex = i;
        break;
      }
    }
    
    const endIndex = nextBookedIndex !== -1 ? nextBookedIndex : timeSlots.length;
    return timeSlots.slice(startIndex + 1, endIndex + 1);
  }, [startTime, timeSlots, bookedSlots]);
  
  const totalPrice = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const duration = end - start;
    return duration > 0 ? duration * venue.pricePerHour : 0;
  }, [startTime, endTime, venue.pricePerHour]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 transform transition-all duration-300">
        
        {/* Header (No changes) */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book a Slot at {venue.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body (No changes) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          {/* Left: Calendar & Price */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Select Date</h3>
            <div className="react-datepicker-wrapper">
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                inline
                className="w-full"
              />
            </div>
            
            <div className="mt-auto pt-8">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600">Total Price</p>
                <p className="text-4xl font-bold text-[#FF6B35]">₹{totalPrice}</p>
                {startTime && endTime && <p className="text-sm text-gray-500">{`For ${parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} hour(s)`}</p>}
              </div>
            </div>
          </div>
          
          {/* Right: Time Slots */}
          <div className="space-y-6">
            {/* Start Time Slot Selection (No Changes) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Select Start Time</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map(time => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = startTime === time;
                  return (
                    <button 
                      key={time}
                      disabled={isBooked}
                      onClick={() => handleStartTimeSelect(time)}
                      className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                        isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through' :
                        isSelected ? 'bg-[#FF6B35] text-white shadow-md' :
                        'bg-white border hover:bg-[#4ECDC4]/20'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* End Time Slot Selection (No Changes) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Select End Time</h3>
              {startTime ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableEndTimes.length > 0 ? availableEndTimes.map(time => {
                    const isSelected = endTime === time;
                    return (
                      <button 
                        key={time}
                        onClick={() => setEndTime(time)}
                        className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                          isSelected ? 'bg-[#FF6B35] text-white shadow-md' :
                          'bg-white border hover:bg-[#4ECDC4]/20'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  }) : <p className="text-sm text-gray-500 col-span-4">No available end times. Please select another start time.</p>}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Please select a start time first.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          {/* Display error message if it exists */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <button 
            onClick={handleBookingSubmit} // UPDATED: Call the submit handler
            disabled={!startTime || !endTime || isLoading} // UPDATED: Disable when loading
            className="w-full flex justify-center items-center bg-[#FF6B35] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Booking...
              </>
            ) : (
              'Continue to Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};