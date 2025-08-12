import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, MapPin, ChevronDown, Sliders, X, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVenues } from '../features/venue/venueSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SportsLoader } from '../components/ui/SportsLoader'; // Assuming you have this loader component
import { motion } from 'framer-motion';

// --- Sub-Components ---
const AccordionItem = ({ title, children, isOpen, setIsOpen }) => (
    <div className="border-b border-gray-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pt-4' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
);

const SportTag = ({ sport }) => (
    <span className="inline-block bg-[#4ECDC4]/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
        {sport}
    </span>
);

const VenueCard = ({ venue, handleNavigate }) => (
    <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="relative group rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden aspect-[4/5]"
    >
        {venue.rating >= 4.8 && <div className="absolute top-3 left-3 z-10 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Award size={14}/> Top Rated</div>}
        <img 
            src={venue.photos?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
            alt={venue.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative p-4 flex flex-col justify-between h-full text-white">
            <div>
                <div className="flex flex-wrap gap-2 mb-2"><SportTag sport={venue.sportType} /></div>
                <div className="flex items-center bg-black/30 backdrop-blur-sm p-1 rounded-full w-fit">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold ml-1">{venue.rating || 'N/A'}</span>
                </div>
            </div>
            <div className="transform transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg truncate">{venue.name}</h3>
                <div className="flex items-center text-gray-200 mb-3">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span className="text-sm truncate">{venue.address}</span>
                </div>
                <div className="transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{venue.description}</p>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-[#FF6B35]">₹{venue.pricePerHour}/hr</span>
                    </div>
                    <div className="flex gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        <button onClick={() => handleNavigate(venue._id)} className="flex-1 border-2 border-white/80 text-white hover:bg-white hover:text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

// --- Main Page Component ---
const venuesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSports, setSelectedSports] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [sportsOpen, setSportsOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);
    const [ratingOpen, setRatingOpen] = useState(true);

    const { venues, isLoading } = useSelector(state => state.venue);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchVenues());
    }, [dispatch]);

    const handleNavigate = (venueId) => {
        if (user) {
            navigate(`/venue/${venueId}`);
        } else {
            navigate("/login");
        }
    };

    // Filter for approved venues first, then apply other filters
    const approvedVenues = useMemo(() => (venues || []).filter(venue => venue.isApproved), [venues]);

    const allSports = useMemo(() => {
        if (!approvedVenues || approvedVenues.length === 0) return [];
        return [...new Set(approvedVenues.map(venue => venue.sportType))].sort();
    }, [approvedVenues]);

    const filteredVenues = useMemo(() => {
        return approvedVenues.filter(venue => {
            const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                venue.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSports = selectedSports.length === 0 || selectedSports.includes(venue.sportType);
            const matchesPrice = venue.pricePerHour >= priceRange[0] && venue.pricePerHour <= priceRange[1];
            const matchesRating = (venue.rating || 0) >= minRating;
            return matchesSearch && matchesSports && matchesPrice && matchesRating;
        });
    }, [searchTerm, selectedSports, priceRange, minRating, approvedVenues]);

    const handleSportToggle = (sport) => {
        setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedSports([]);
        setPriceRange([0, 5000]);
        setMinRating(0);
    };

    if (isLoading && !venues) {
        return <SportsLoader />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white border-b pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Find Your Perfect <span className="text-[#FF6B35]">Court</span></h1>
                    <p className="mt-4 text-lg text-gray-600">Browse and book from the best sports venues in Gandhinagar.</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2"><Sliders className="w-6 h-6 text-gray-800" /><h2 className="text-xl font-bold text-gray-800">Filters</h2></div>
                                <button onClick={clearAllFilters} className="flex items-center gap-1 text-sm font-medium text-[#FF6B35] hover:opacity-80"><X size={16}/> Clear All</button>
                            </div>
                            <div className="mb-4">
                                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search by name or address..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#FF6B35]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                            </div>
                            <AccordionItem title="Sports Type" isOpen={sportsOpen} setIsOpen={setSportsOpen}>
                                <div className="flex flex-wrap gap-2">{allSports.map(sport => <button key={sport} onClick={() => handleSportToggle(sport)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedSports.includes(sport) ? 'bg-[#4ECDC4] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{sport}</button>)}</div>
                            </AccordionItem>
                            <AccordionItem title="Price Range (₹/hr)" isOpen={priceOpen} setIsOpen={setPriceOpen}>
                                <div className="flex items-center gap-3">
                                    <div className="w-1/2"><label htmlFor="min-price" className="text-xs font-medium text-gray-500">Min</label><input type="number" id="min-price" placeholder="0" min="0" step="100" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35]" /></div>
                                    <div className="w-1/2"><label htmlFor="max-price" className="text-xs font-medium text-gray-500">Max</label><input type="number" id="max-price" placeholder="5000" min="0" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B35]" /></div>
                                </div>
                            </AccordionItem>
                            <AccordionItem title="Minimum Rating" isOpen={ratingOpen} setIsOpen={setRatingOpen}>
                                <div className="space-y-2">{[4, 3, 2, 1, 0].map(rating => (<label key={rating} className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-gray-50"><input type="radio" name="rating" className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]" checked={minRating === rating} onChange={() => setMinRating(rating)} /><div className="ml-3 flex items-center">{rating > 0 ? (<>{[...Array(5)].map((_, i) => <Star key={i} size={20} className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}<span className="text-sm text-gray-600 ml-2">& up</span></>) : <span className="font-medium text-gray-700">All Ratings</span>}</div></label>))}</div>
                            </AccordionItem>
                        </div>
                    </aside>
                    <main className="flex-1">
                        <div className="pb-4 mb-4 border-b">
                            <p className="text-sm text-gray-600">Showing <span className="font-bold text-gray-800">{filteredVenues.length}</span> of <span className="font-bold text-gray-800">{approvedVenues.length}</span> approved venues</p>
                        </div>
                        {filteredVenues.length === 0 ? (
                            <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed"><h3 className="text-xl font-semibold text-gray-700">No Venues Found</h3><p className="text-gray-500 mt-2">Try adjusting your search filters.</p></div>
                        ) : (
                            <motion.div 
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {filteredVenues.map(venue => (<VenueCard key={venue._id} venue={venue} handleNavigate={handleNavigate} />))}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default venuesPage;
