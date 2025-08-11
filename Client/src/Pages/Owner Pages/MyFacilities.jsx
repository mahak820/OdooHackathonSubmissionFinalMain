import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Image as ImageIcon, X, Loader2, Plus, Trash2 } from 'lucide-react';
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
    const statusClasses = isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
    return <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClasses}`}>{status}</span>;
};

const FacilityCard = ({ facility, onEdit }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300">
    <div className="relative">
      <img src={facility.photos?.[0] || 'https://placehold.co/600x400/cccccc/333333?text=No+Image'} alt={facility.name} className="w-full h-40 object-cover" />
      <div className="absolute top-2 right-2"><StatusBadge isApproved={facility.isApproved} /></div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-gray-900 truncate">{facility.name}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-10">{facility.description}</p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-bold text-green-600">₹{facility.pricePerHour}/hr</p>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors">
          <Edit size={16} /> Edit
        </button>
      </div>
    </div>
  </motion.div>
);

const FacilityModal = ({
  isOpen, onClose, onSubmit, mode, formData, setFormData, isSubmitting,
  handleChange, handleAmenityChange, handleAddImageUrl, handleRemoveImageUrl, handleImageUrlChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4">
        <form onSubmit={onSubmit}>
          <div className="flex items-center justify-between p-6 border-b"><h2 className="text-2xl font-bold text-gray-800">{mode === 'create' ? 'Create New Facility' : 'Edit Facility'}</h2><button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X /></button></div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="font-semibold text-sm">Facility Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                <div><label className="font-semibold text-sm">Sport Type</label><select name="sportType" value={formData.sportType || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-white" required><option value="" disabled>Select a sport</option>{ALL_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="font-semibold text-sm">Short Location</label><input type="text" name="shortLocation" value={formData.shortLocation || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" placeholder="e.g., Bandra West" required /></div>
                <div><label className="font-semibold text-sm">Price per Hour (₹)</label><input type="number" name="pricePerHour" value={formData.pricePerHour || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
            </div>
            <div><label className="font-semibold text-sm">Full Address</label><textarea name="address" value={formData.address || ''} onChange={handleChange} rows="2" className="w-full mt-1 p-2 border rounded-lg" required></textarea></div>
            <div><label className="font-semibold text-sm">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="w-full mt-1 p-2 border rounded-lg" required></textarea></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="font-semibold text-sm">Opening Time</label><input type="time" name="operatingHours_openingTime" value={formData.operatingHours_openingTime || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                <div><label className="font-semibold text-sm">Closing Time</label><input type="time" name="operatingHours_closingTime" value={formData.operatingHours_closingTime || ''} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
            </div>
            <div>
              <label className="font-semibold text-sm">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {ALL_AMENITIES.map(amenity => <label key={amenity} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"><input type="checkbox" checked={(formData.amenities || []).includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="rounded text-green-600 focus:ring-green-500" />{amenity}</label>)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-sm">Facility Photos (URLs)</label>
                <button 
                  type="button" 
                  onClick={handleAddImageUrl}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Plus size={16} /> Add Image URL
                </button>
              </div>
              <div className="space-y-3">
                {(formData.photos || []).map((url, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="flex-1 p-2 border rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!formData.photos || formData.photos.length === 0) && (
                  <p className="text-sm text-gray-500 italic">No images added yet. Click "Add Image URL" to add photos.</p>
                )}
              </div>
              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {formData.photos.map((url, index) => (
                    url && (
                      <img 
                        key={index} 
                        src={url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/cccccc/333333?text=Invalid+URL';
                        }}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl"><button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400">{isSubmitting ? <Loader2 className="animate-spin" /> : (mode === 'create' ? 'Add Facility' : 'Save Changes')}</button></div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
const MyFacilitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVenue , setSelectedVenue] = useState()
  
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
    setSelectedVenue(facility)
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
      const venueid = selectedVenue._id
      dispatch(updateVenue({formData : dataToSend , venueid : venueid}));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 1000);
  };
  
  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Facilities</h1>
              <p className="mt-1 text-gray-600">Manage, add, and edit your sports facilities.</p>
            </div>
            <button onClick={handleOpenCreateModal} className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition">
              <PlusCircle size={18} /> Create New Facility
            </button>
          </div>
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues?.map(facility => (<FacilityCard key={facility._id} facility={facility} onEdit={() => handleOpenEditModal(facility)} />))}
            </div>
          </AnimatePresence>
        </div>
      </div>
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