import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVenues } from '../features/venue/venueSlice';
import { useDispatch, useSelector } from 'react-redux';

const venuesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
    const {venues} = useSelector(state => state.venue)
    const dispatch = useDispatch()

  const navigate = useNavigate() 

  const handleNavigate = (venueId) => {
    navigate(`/venue/${venueId}`)
  }

  // Extended venue data (same as provided)
 

  const allSports = [...new Set(venues.flatMap(venue => venue.sports))].sort();

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venue.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSports = selectedSports.length === 0 || 
                            selectedSports.some(sport => venue.sports.includes(sport));
      const matchesPrice = venue.pricePerHour >= priceRange[0] && venue.pricePerHour <= priceRange[1];
      const matchesRating = venue.rating >= minRating;
      return matchesSearch && matchesSports && matchesPrice && matchesRating;
    });
  }, [searchTerm, selectedSports, priceRange, minRating, venues]);

  const handleSportToggle = (sport) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSports([]);
    setPriceRange([0, 5000]);
    setMinRating(0);
  };

  const SportTag = ({ sport }) => (
    <span className="inline-block bg-teal-400/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
      {sport}
    </span>
  );
  
  // --- NEW INNOVATIVE VENUE CARD ---
 const VenueCard = ({ venue }) => (
  <div className="relative group rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden aspect-[4/5]">
    {/* Background Image */}
    <img 
      src={venue.photos?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'} 
      alt={venue.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

    {/* Content */}
    <div className="relative p-4 flex flex-col justify-between h-full text-white">
      {/* Top Section: Tags and Rating */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {/* sportType is a string */}
          <SportTag sport={venue.sportType} />
        </div>
        <div className="flex items-center bg-black/30 backdrop-blur-sm p-1 rounded-full w-fit">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold ml-1">{venue.rating}</span>
        </div>
      </div>
      
      {/* Bottom Section: Details and actions */}
      <div className="transform transition-all duration-300">
        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg truncate">
          {venue.name}
        </h3>
        <div className="flex items-center text-gray-200 mb-3">
          <MapPin className="w-4 h-4 mr-1.5" />
          <span className="text-sm truncate">{venue.address}</span>
        </div>

        {/* Hidden content revealed on hover */}
        <div className="transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2">
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{venue.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-orange-400">₹{venue.pricePerHour}/hr</span>
          </div>
          <div className="flex gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
            
            <button onClick={() => handleNavigate(venue._id)} className="flex-1 border-2 border-white/80 text-white hover:bg-white hover:text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  useEffect(() =>{
 dispatch(fetchVenues())
  },[])

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-gray-50 rounded-xl shadow-md p-6 sticky top-8">
              {/* Mobile Filter Toggle */}
              <div className="flex items-center justify-between lg:hidden mb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  {showFilters ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Clear Filters */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 hidden lg:block">Filters</h2>
                  <button 
                    onClick={clearAllFilters}
                    className="text-teal-500 hover:text-teal-600 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Venues</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Name or location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sports Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sports Type</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {allSports.map(sport => (
                      <label key={sport} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                          checked={selectedSports.includes(sport)}
                          onChange={() => handleSportToggle(sport)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Max Price (₹/hour)
                  </label>
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>₹0</span>
                      <span className="font-bold text-teal-500">₹{priceRange[1]}</span>
                      <span>₹5000</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum Rating</label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          className="border-gray-300 text-teal-500 focus:ring-teal-500"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                        />
                        <div className="ml-2 flex items-center">
                          {rating > 0 ? (
                            <>
                              <span className="text-sm text-gray-700 mr-1">{rating}</span>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                              <span className="text-sm text-gray-700 ml-1.5">& up</span>
                            </>
                          ) : <span className="text-sm text-gray-700">All Ratings</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
              <div className="pb-4 mb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                      Showing <span className="font-bold text-gray-800">{filteredVenues.length}</span> of <span className="font-bold text-gray-800">{venues.length}</span> venues
                  </p>
              </div>
            {filteredVenues.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVenues.map(venue => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default venuesPage;