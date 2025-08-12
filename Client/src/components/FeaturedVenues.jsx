import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenues } from '../features/venue/venueSlice';

const FeaturedVenues = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { venues } = useSelector(state => state.venue);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- FILTERING LOGIC ---
  // Create a new memoized list that only contains approved venues.
  const approvedVenues = useMemo(() => {
    // Add null check and fallback to empty array
    if (!venues) return [];
    // Filter the venues to only include those that are approved
    return venues.filter(venue => venue.isApproved);
  }, [venues]);

  const handleNavigates = (venueId) => {
    if (user) {
      navigate(`/venue/${venueId}`);
    } else {
      navigate("/login");
    }
  };

  const handleNavigate = () => {
    navigate("/allVenues");
  };
  
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 4;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView);

  useEffect(() => {
    dispatch(fetchVenues());
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setCurrentSlide(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
  
  // Use the new 'approvedVenues' list for all calculations and rendering
  const totalSlides = Math.max(1, Math.ceil(approvedVenues.length / cardsPerView));
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const SportTag = ({ sport }) => (
    <span className="inline-block bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
      {sport}
    </span>
  );

  const VenueCard = ({ venue }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer">
      <div className="overflow-hidden rounded-t-xl h-40">
        <img 
          src={venue.photos?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'} 
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{venue.name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(venue.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-gray-600 font-semibold">{venue.rating || 0}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3 truncate">{venue.address}</p>
        <div className="mb-4">
          <SportTag sport={venue.sportType || 'Sport'} />
        </div>
        <button onClick={() => handleNavigates(venue._id)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
          Book Now
        </button>
      </div>
    </div>
  );

  if (!venues) {
    return (
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Featured Venues</h2>
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (approvedVenues.length === 0) {
    return (
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Featured Venues</h2>
          <p className="text-lg text-gray-600">No approved venues available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">Featured Venues</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Discover top-rated sports venues in your city. Book your perfect game today!</p>
        </div>
        <div className="relative">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50"
            disabled={totalSlides <= 1}
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50"
            disabled={totalSlides <= 1}
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {[...Array(totalSlides)].map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-4 ${
                    cardsPerView === 1 ? 'grid-cols-1' :
                    cardsPerView === 2 ? 'grid-cols-2' :
                    cardsPerView === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  }`}>
                    {approvedVenues.slice(slideIndex * cardsPerView, slideIndex * cardsPerView + cardsPerView).map((venue, index) => (
                      <VenueCard key={venue._id || index} venue={venue} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-orange-500 scale-110' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
        <div className="text-center mt-8 md:mt-12">
          <button onClick={handleNavigate} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm sm:text-base">
            View All Venues
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVenues;
