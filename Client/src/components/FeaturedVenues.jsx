import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedVenues = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setCurrentSlide(0); // Reset to first slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sample venue data
  const venues = [
    {
      id: 1,
      name: "SportZone Arena",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=240&fit=crop",
      rating: 4.8,
      location: "Downtown Mumbai",
      sports: ["Badminton", "Table Tennis", "Squash"]
    },
    {
      id: 2,
      name: "Champions Turf",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=240&fit=crop",
      rating: 4.6,
      location: "Bandra West",
      sports: ["Football", "Cricket", "Turf"]
    },
    {
      id: 3,
      name: "AquaFit Center",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=240&fit=crop",
      rating: 4.9,
      location: "Powai",
      sports: ["Swimming", "Aqua Aerobics", "Diving"]
    },
    {
      id: 4,
      name: "Elite Fitness Hub",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop",
      rating: 4.7,
      location: "Andheri East",
      sports: ["Gym", "CrossFit", "Boxing"]
    },
    {
      id: 5,
      name: "Victory Courts",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=240&fit=crop",
      rating: 4.5,
      location: "Malad West",
      sports: ["Tennis", "Basketball", "Volleyball"]
    },
    {
      id: 6,
      name: "PlayZone Complex",
      image: "https://images.unsplash.com/photo-1593786481097-174b0c2c6a63?w=400&h=240&fit=crop",
      rating: 4.8,
      location: "Thane",
      sports: ["Badminton", "Snooker", "Carrom"]
    },
    {
      id: 7,
      name: "MetroSports Arena",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=240&fit=crop",
      rating: 4.6,
      location: "Goregaon",
      sports: ["Hockey", "Skating", "Cycling"]
    },
    {
      id: 8,
      name: "Urban Athletes",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=240&fit=crop",
      rating: 4.7,
      location: "Worli",
      sports: ["Rock Climbing", "Parkour", "Calisthenics"]
    }
  ];



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
      <div className="relative overflow-hidden">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-32 sm:h-36 md:h-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-3 sm:p-4 md:p-3">
        <h3 className="text-sm sm:text-lg md:text-base lg:text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors duration-200 truncate">
          {venue.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 ${i < Math.floor(venue.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-xs sm:text-sm md:text-xs text-gray-600 ml-1 font-semibold">{venue.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 mr-1 text-gray-400" />
          <span className="text-xs sm:text-sm md:text-xs truncate">{venue.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {venue.sports.slice(0, 2).map((sport, index) => (
            <SportTag key={index} sport={sport} />
          ))}
        </div>
        
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm">
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