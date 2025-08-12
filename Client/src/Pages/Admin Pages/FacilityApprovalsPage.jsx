import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all necessary thunks from your adminSlice
import { getVenues, approveVenue, deleteVenue, reset } from '../../features/admin/adminSlice';

// --- Sub-Components (No changes needed) ---
const StatusBadge = ({ isApproved }) => {
  const status = isApproved ? "Approved" : "Pending";
  const classes = isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${classes}`}>{status}</span>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, facilityName }) => {
  if (!isOpen) return null;

  const isDelete = action === 'delete';
  const config = {
    title: isDelete ? "Delete Facility?" : "Approve Facility?",
    message: isDelete ? `Are you sure you want to permanently delete "${facilityName}"? This action cannot be undone.` : `Are you sure you want to approve and list "${facilityName}" on the platform?`,
    buttonText: isDelete ? "Yes, Delete" : "Yes, Approve",
    buttonClass: isDelete ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
    icon: isDelete ? <XCircle className="h-8 w-8 text-red-600" /> : <CheckCircle className="h-8 w-8 text-green-600" />,
    iconBg: isDelete ? "bg-red-100" : "bg-green-100",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 text-center">
        <div className={`mx-auto ${config.iconBg} rounded-full h-16 w-16 flex items-center justify-center`}>{config.icon}</div>
        <h3 className="text-2xl font-bold text-gray-800 mt-4">{config.title}</h3>
        <p className="text-gray-600 mt-2">{config.message}</p>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={onClose} className="px-6 py-2 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Cancel</button>
          <button onClick={onConfirm} className={`px-6 py-2 rounded-lg font-semibold text-white transition ${config.buttonClass}`}>{config.buttonText}</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
const FacilityApprovalsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, action: null, facility: null });

  const dispatch = useDispatch();
  const { venues, isLoading, isSuccess, isError, message } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getVenues());
  }, [dispatch]);

  // Effect to handle success/error feedback from Redux
  useEffect(() => {
    if (isError) {
        toast.error(message || 'An error occurred.');
    }
    // Check for a success message to show toast
    if (isSuccess && message) {
        toast.success(message);
    }
    // Reset the status flags once handled
    if (isError || isSuccess) {
        dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  const filteredFacilities = useMemo(() => {
    return (venues || []).filter(facility => {
      const matchesTab = activeTab === 'All' || (activeTab === 'Pending' && !facility.isApproved) || (activeTab === 'Approved' && facility.isApproved);
      const matchesSearch = searchTerm === '' || 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (facility.ownerId && facility.ownerId.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [venues, activeTab, searchTerm]);

  const openModal = (action, facility) => setModalState({ isOpen: true, action, facility });
  const closeModal = () => setModalState({ isOpen: false, action: null, facility: null });

  const handleConfirm = () => {
    const { action, facility } = modalState;
    let actionToDispatch;

    if (action === 'approve') {
      actionToDispatch = approveVenue(facility._id);
    } else if (action === 'delete') {
      actionToDispatch = deleteVenue(facility._id);
    }

    if (actionToDispatch) {
      dispatch(actionToDispatch)
        .unwrap() // .unwrap() lets us use .then() and .catch() here
        .then(() => {
          toast.success(`Facility successfully ${action}d!`);
          // Re-fetch the list to ensure UI is up-to-date
          dispatch(getVenues()); 
        })
        .catch((error) => {
          toast.error(`Failed to ${action} facility: ${error}`);
        });
    }
    
    closeModal();
  };

  return (
    <>
      <ToastContainer position="bottom-right" theme="colored" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Facility Approvals</h1>
            <p className="mt-1 text-gray-600">Review, approve, or delete facility registration requests.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border">
            <div className="p-4 flex flex-col sm:flex-row gap-4 border-b">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search by name or owner ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex-shrink-0 flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                {['All', 'Pending', 'Approved'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Facility Name</th>
                    <th className="px-6 py-3">Owner ID</th>
                    <th className="px-6 py-3">Sport Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && venues.length === 0 ? (
                    [...Array(5)].map((_, i) => (
                        <tr key={i} className="bg-white border-b animate-pulse">
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                            <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                            <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div></td>
                        </tr>
                    ))
                  ) : (
                    filteredFacilities.map(facility => (
                      <tr key={facility._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{facility.name}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{facility.ownerId}</td>
                        <td className="px-6 py-4 text-gray-600">{facility.sportType}</td>
                        <td className="px-6 py-4"><StatusBadge isApproved={facility.isApproved} /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {!facility.isApproved && (
                              <>
                                <button onClick={() => openModal('approve', facility)} className="p-2 rounded-md hover:bg-green-100 text-green-600 transition-colors">
                                  <CheckCircle size={20} />
                                </button>
                                <button onClick={() => openModal('delete', facility)} className="p-2 rounded-md hover:bg-red-100 text-red-600 transition-colors">
                                  <XCircle size={20} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!isLoading && filteredFacilities.length === 0 && (
              <div className="text-center p-8 text-gray-500"><h4 className="font-semibold">No Facilities Found</h4><p>Try adjusting your search or filter.</p></div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          action={modalState.action}
          facilityName={modalState.facility?.name}
        />
      </AnimatePresence>
    </>
  );
};

export default FacilityApprovalsPage;
