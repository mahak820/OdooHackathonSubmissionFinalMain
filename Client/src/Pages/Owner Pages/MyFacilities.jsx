import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Image as ImageIcon, X, Loader2, Plus, Trash2, MapPin, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createVenue, updateVenue } from '../../features/venue/venueSlice';
// import { getAllVenuesOfOwner, createVenue, updateVenue } from '../../features/venue/venueSlice';

// --- TIME CONVERSION HELPER FUNCTIONS ---
const convertTo24HourFormat = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return '';
  // Cleans up " 10 : 00 AM" into "10:00 AM"
  const cleanedTime = timeStr.replace(/\s/g, '').toUpperCase();
  const [time, modifier] = cleanedTime.split(/(AM|PM)/);
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0; // Midnight case
  }
  
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = (minutes || 0).toString().padStart(2, '0');
  
  return `${paddedHours}:${paddedMinutes}`;
};

const convertTo12HourFormat = (time24) => {
    if (!time24 || typeof time24 !== 'string') return '';
    let [hours, minutes] = time24.split(':').map(Number);
    const modifier = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hour to 12-hour format
    return `${hours} : ${minutes.toString().padStart(2, '0')} ${modifier}`;
};

// --- MOCK CONSTANTS ---
const ALL_AMENITIES = ["Changing Rooms", "Parking", "Air Conditioned", "Equipment Rental", "Showers", "Lockers"];
const ALL_SPORTS = ["Football", "Cricket", "Badminton", "Swimming", "Tennis", "Table Tennis"];

const initialFormState = {
    name: '',
    description: '',
    address: '',
    sportType: '',
    pricePerHour: '',
    shortLocation: '',
    amenities: [],
    photos: [], // Array of URL strings
    operatingHours_openingTime: '',
    operatingHours_closingTime: ''
};

// --- Sub-Components ---
const StatusBadge = ({ isApproved }) => {
    const status = isApproved ? "Approved" : "Pending";
    const statusClasses = isApproved ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800";
    return (
        <motion.span 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className={`text-xs font-bold px-3 py-1 rounded-full ${statusClasses} shadow-sm`}
        >
            {status}
        </motion.span>
    );
};

const FacilityCard = ({ facility, onEdit, index }) => (
  <motion.div 
    layout 
    initial={{ opacity: 0, y: 50, scale: 0.9 }} 
    animate={{ opacity: 1, y: 0, scale: 1 }} 
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
    }}
    whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
    }}
    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group"
  >
    <div className="relative overflow-hidden">
      <motion.img 
        src={facility.photos?.[0] || 'https://placehold.co/600x400/FF6B35/FFFFFF?text=No+Image'} 
        alt={facility.name} 
        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
        whileHover={{ scale: 1.05 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-3 right-3">
        <StatusBadge isApproved={facility.isApproved} />
      </div>
      <motion.div 
        className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Star className="w-4 h-4 text-orange-500" />
      </motion.div>
    </div>
    <div className="p-6">
      <motion.h3 
        className="text-xl font-bold text-gray-900 truncate group-hover:text-black transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {facility.name}
      </motion.h3>
      <motion.p 
        className="text-sm text-gray-600 mt-2 line-clamp-2 h-10 group-hover:text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        {facility.description}
      </motion.p>
      
      <motion.div 
        className="flex items-center gap-2 mt-3 text-xs text-gray-500"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.4 }}
      >
        <MapPin className="w-3 h-3 text-orange-500" />
        <span>{facility.shortLocation || 'Location not specified'}</span>
      </motion.div>

      <motion.div 
        className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.5 }}
      >
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Price per Hour</p>
          <motion.p 
            className="font-bold text-orange-600 text-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ₹{facility.pricePerHour}
          </motion.p>
        </div>
        <motion.button 
          onClick={onEdit} 
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 bg-gray-50 hover:bg-orange-50 px-4 py-2 rounded-lg transition-all duration-200 group/button"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.2)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit size={16} className="group-hover/button:rotate-12 transition-transform duration-200" /> 
          Edit
        </motion.button>
      </motion.div>
    </div>
  </motion.div>
);

const FacilityModal = ({
  isOpen, onClose, onSubmit, mode, formData, setFormData, isSubmitting,
  handleChange, handleAmenityChange, handleAddImageUrl, handleRemoveImageUrl, handleImageUrlChange
}) => {
  if (!isOpen) return null;

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl m-4 overflow-hidden"
        >
          <form onSubmit={onSubmit}>
            <motion.div 
              className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-gray-900 bg-clip-text text-transparent">
                {mode === 'create' ? 'Create New Facility' : 'Edit Facility'}
              </h2>
              <motion.button 
                type="button" 
                onClick={onClose} 
                className="p-3 rounded-full hover:bg-gray-100 hover:rotate-90 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700">Facility Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700">Sport Type</label>
                  <select 
                    name="sportType" 
                    value={formData.sportType || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                    required
                  >
                    <option value="" disabled>Select a sport</option>
                    {ALL_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700">Short Location</label>
                  <input 
                    type="text" 
                    name="shortLocation" 
                    value={formData.shortLocation || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                    placeholder="e.g., Bandra West" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700">Price per Hour (₹)</label>
                  <input 
                    type="number" 
                    name="pricePerHour" 
                    value={formData.pricePerHour || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                    required 
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="font-semibold text-sm text-gray-700">Full Address</label>
                <textarea 
                  name="address" 
                  value={formData.address || ''} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="font-semibold text-sm text-gray-700">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description || ''} 
                  onChange={handleChange} 
                  rows="4" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                  required
                />
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    Opening Time
                  </label>
                  <input 
                    type="time" 
                    name="operatingHours_openingTime" 
                    value={formData.operatingHours_openingTime || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    Closing Time
                  </label>
                  <input 
                    type="time" 
                    name="operatingHours_closingTime" 
                    value={formData.operatingHours_closingTime || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" 
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="font-semibold text-sm text-gray-700 mb-3 block">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_AMENITIES.map((amenity, index) => (
                    <motion.label 
                      key={amenity} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border border-gray-200 hover:border-orange-200 transition-all duration-200 cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <input 
                        type="checkbox" 
                        checked={(formData.amenities || []).includes(amenity)} 
                        onChange={() => handleAmenityChange(amenity)} 
                        className="rounded text-orange-600 focus:ring-orange-500 group-hover:scale-110 transition-transform" 
                      />
                      <span className="text-sm group-hover:text-orange-600 transition-colors">{amenity}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="font-semibold text-sm text-gray-700">Facility Photos (URLs)</label>
                  <motion.button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} /> Add Image URL
                  </motion.button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {(formData.photos || []).map((url, index) => (
                      <motion.div 
                        key={index} 
                        className="flex gap-3 items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                          className="flex-1 p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        />
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {(!formData.photos || formData.photos.length === 0) && (
                    <motion.p 
                      className="text-sm text-gray-500 italic text-center py-8 border-2 border-dashed border-gray-200 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No images added yet. Click "Add Image URL" to add photos.
                    </motion.p>
                  )}
                </div>
                {formData.photos && formData.photos.length > 0 && (
                  <motion.div 
                    className="grid grid-cols-6 gap-3 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {formData.photos.map((url, index) => (
                      url && (
                        <motion.img 
                          key={index} 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-20 object-cover rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-200"
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x100/FF6B35/FFFFFF?text=Invalid+URL';
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        />
                      )
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <motion.div 
              className="p-8 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full flex items-center justify-center bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={20} />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    {mode === 'create' ? 'Add Facility' : 'Save Changes'}
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Page Component ---
const MyFacilitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState();
  
  // Using mock state for now, but wired up for Redux
  const { venues, isLoading } = useSelector(state => state.venue);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getAllVenuesOfOwner());
  // }, [dispatch]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
        const currentAmenities = prev.amenities || [];
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter(a => a !== amenity)
            : [...currentAmenities, amenity];
        return { ...prev, amenities: newAmenities };
    });
  };

  const handleAddImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), '']
    }));
  };

  const handleRemoveImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((url, i) => i === index ? value : url)
    }));
  };

  const handleOpenCreateModal = () => {
    setFormData(initialFormState);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (facility) => {
    // Convert backend 12hr strings to 24hr format for the <input type="time">
    const editableFacility = {
      ...facility,
      operatingHours_openingTime: convertTo24HourFormat(facility.operatingHours_openingTime),
      operatingHours_closingTime: convertTo24HourFormat(facility.operatingHours_closingTime),
      photos: facility.photos || [] // Ensure photos is an array of strings
    };
    setFormData(editableFacility);
    setModalMode('edit');
    setIsModalOpen(true);
    setSelectedVenue(facility);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert 24hr time from form back to 12hr AM/PM strings for the backend
    // Filter out empty URL strings from photos array
    const dataToSend = {
      ...formData,
      operatingHours_openingTime: convertTo12HourFormat(formData.operatingHours_openingTime),
      operatingHours_closingTime: convertTo12HourFormat(formData.operatingHours_closingTime),
      photos: (formData.photos || []).filter(url => url.trim() !== '') // Remove empty URLs
    };

    console.log("Submitting converted data to backend:", dataToSend);
    
    // In a real app, dispatch Redux action here
    if (modalMode === 'create') {
      dispatch(createVenue(dataToSend));
    } 
    else {
      const venueid = selectedVenue._id;
      dispatch(updateVenue({formData : dataToSend , venueid : venueid}));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 1000);
  };
  
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
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                My Facilities
              </motion.h1>
              <motion.p 
                className="mt-2 text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Manage, add, and edit your sports facilities with ease.
              </motion.p>
            </div>
            <motion.button 
              onClick={handleOpenCreateModal} 
              className="mt-6 sm:mt-0 flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-700 hover:to-orange-600 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle size={20} /> Create New Facility
            </motion.button>
          </motion.div>
          
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {venues?.map((facility, index) => (
                <FacilityCard 
                  key={facility._id} 
                  facility={facility} 
                  onEdit={() => handleOpenEditModal(facility)}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {(!venues || venues.length === 0) && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div 
                className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6"
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
                <PlusCircle className="w-12 h-12 text-orange-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No facilities yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first sports facility!</p>
              <motion.button
                onClick={handleOpenCreateModal}
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Facility
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <FacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleAmenityChange={handleAmenityChange}
        handleAddImageUrl={handleAddImageUrl}
        handleRemoveImageUrl={handleRemoveImageUrl}
        handleImageUrlChange={handleImageUrlChange}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default MyFacilitiesPage;