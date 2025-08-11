import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenues } from '../features/venue/venueSlice';

const FeaturedVenues = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {venues} = useSelector(state => state.venue)
    const dispatch = useDispatch()

  console.log(venues)

  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate("/allVenues")
  }
  
  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4; // lg and above
      if (window.innerWidth >= 768) return 3;  // md
      if (window.innerWidth >= 640) return 2;  // sm
      return 1; // mobile
    }
    return 4; // default
  };

  const [cardsPerView, setCardsPerView] = React.useState(getCardsPerView);

  React.useEffect(() => {
   
    dispatch(fetchVenues())
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setCurrentSlide(0); // Reset to first slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
 



  const totalSlides = Math.ceil(venues.length / cardsPerView);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const getCurrentVenues = () => {
    const startIndex = currentSlide * cardsPerView;
    return venues.slice(startIndex, startIndex + cardsPerView);
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
      <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
        {venue.name}
      </h3>
      
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(venue.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-gray-600 font-semibold">{venue.rating}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 truncate">{venue.address}</p>
      
      <div className="mb-4">
        <SportTag sport={venue.sportType} />
      </div>
      
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
        Book Now
      </button>
    </div>
  </div>
);


  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Venues
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover top-rated sports venues in your city. Book your perfect game today!
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Venues Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {[...Array(totalSlides)].map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-4 ${
                    cardsPerView === 1 ? 'grid-cols-1' :
                    cardsPerView === 2 ? 'grid-cols-2' :
                    cardsPerView === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  }`}>
                    {venues.slice(slideIndex * cardsPerView, slideIndex * cardsPerView + cardsPerView).map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-orange-500 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
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