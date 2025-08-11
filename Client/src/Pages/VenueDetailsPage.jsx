import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Clock, Home, ChevronLeft, ChevronRight, Wifi, ParkingCircle,
  ShowerHead, Lock, Trophy, Users, CalendarPlus, ArrowLeft
} from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { SportsLoader } from '../components/ui/SportsLoader'; // 1. Import the loader

// --- MOCK DATA (No changes) ---
const detailedVenuesData = [
    { 
      id: 1, 
      name: "SportZone Arena", 
      images: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1596207894237-c6171ad52147?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1579758629938-03607cc12921?w=800&h=500&fit=crop",
      ],
      rating: 4.8, 
      location: "Downtown Mumbai",
      fullAddress: "123 Sports Complex, MG Road, Downtown Mumbai, Maharashtra 400001",
      lat: 19.0760,
      lng: 72.8777,
      sports: ["Badminton", "Table Tennis", "Squash"], 
      pricePerHour: 800, 
      operatingHours: "7:00 AM - 11:00 PM",
      about: "SportZone Arena is a state-of-the-art indoor sports facility located in the heart of Mumbai. We offer premium, air-conditioned courts for a variety of racket sports, ensuring a comfortable and professional playing experience.",
      amenities: [
        { name: 'Free WiFi', icon: Wifi },
        { name: 'Parking', icon: ParkingCircle },
        { name: 'Showers', icon: ShowerHead },
        { name: 'Lockers', icon: Lock },
      ],
      reviews: [
        { user: 'Rohan Sharma', rating: 5, comment: 'Excellent courts and great ventilation. Best place for badminton in the city.'},
        { user: 'Priya Mehta', rating: 4, comment: 'Clean facilities and friendly staff. Can get a bit crowded on weekends.'},
      ]
    },
    { 
      id: 2, 
      name: "Champions Turf", 
      images: [
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1522778118038-66173624de08?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1599481238640-4c1278e9737a?w=800&h=500&fit=crop"
      ],
      rating: 4.6, 
      location: "Bandra West",
      fullAddress: "456 Turf Road, Bandra West, Mumbai, Maharashtra 400050",
      lat: 19.0562,
      lng: 72.8295,
      sports: ["Football", "Cricket"], 
      pricePerHour: 1200, 
      operatingHours: "24 Hours",
      about: "Champions Turf offers a professional-grade playing surface for football and cricket enthusiasts. Our facility is equipped with powerful floodlights for night games and provides spacious changing rooms.",
      amenities: [
        { name: 'Tournaments Held', icon: Trophy },
        { name: 'Changing Rooms', icon: Users },
        { name: 'Parking', icon: ParkingCircle },
        { name: 'Showers', icon: ShowerHead },
      ],
      reviews: [
        { user: 'Arjun Kapoor', rating: 5, comment: 'The turf quality is amazing, feels like playing on a professional ground.'},
        { user: 'Sameer Khan', rating: 4, comment: 'Great for 5-a-side football. Booking in advance is a must.'},
      ]
    },
];


const VenueDetailsPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true); // 2. Add loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const foundVenue = detailedVenuesData.find(v => v.id === parseInt(venueId));
      setVenue(foundVenue);
      setLoading(false); // Set loading to false after data is "fetched"
      window.scrollTo(0, 0);
    }, 1500); // 1.5 second delay for demonstration

    return () => clearTimeout(timer);
  }, [venueId]);

  // Autoplay carousel logic...
  const nextImage = () => {
    if (!venue) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % venue.images.length);
  };

  const prevImage = () => {
    if (!venue) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + venue.images.length) % venue.images.length);
  };
  
  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(nextImage, 4000);
  };

  useEffect(() => {
    if (venue) startAutoplay();
    return () => stopAutoplay();
  }, [venue]);

  // 3. Render the loader while loading
  if (loading) {
    return <SportsLoader />;
  }

  if (!venue) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Venue not found</h1>
          <Link to="/" className="mt-6 inline-block bg-[#FF6B35] text-white font-bold py-2 px-6 rounded-lg">
            Back to All Venues
          </Link>
        </div>
      </div>
    );
  }

  const mapSrc = `https://maps.google.com/maps?q=${venue.lat},${venue.lng}&z=15&output=embed`;

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
            >
              <ArrowLeft size={20} />
              Back to all venues
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div 
                className="relative w-full"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
              >
                <div className="overflow-hidden rounded-xl shadow-lg">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {venue.images.map((img, index) => (
                      <img key={index} src={img} alt={`${venue.name} facility ${index + 1}`} className="w-full flex-shrink-0 object-cover aspect-video" />
                    ))}
                  </div>
                </div>
                <button onClick={prevImage} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                  <ChevronLeft className="text-gray-800" />
                </button>
                <button onClick={nextImage} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition">
                  <ChevronRight className="text-gray-800" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col">
              <div className="bg-gray-50 rounded-xl border p-6 flex-grow flex flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{venue.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < Math.floor(venue.rating) ? 'text-[#4ECDC4] fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xl text-gray-800 font-bold ml-3">{venue.rating}</span>
                  <span className="text-gray-600 ml-2">({venue.reviews.length} reviews)</span>
                </div>
                <hr className="my-4" />
                <div className="space-y-3 text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Venue Info</h3>
                  <div className="flex items-start"><Clock className="w-5 h-5 mr-3 mt-1 text-[#FF6B35] flex-shrink-0" /><div><strong>Operating Hours:</strong><br/>{venue.operatingHours}</div></div>
                  <div className="flex items-start"><Home className="w-5 h-5 mr-3 mt-1 text-[#FF6B35] flex-shrink-0" /><div><strong>Address:</strong><br/>{venue.fullAddress}</div></div>
                </div>
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-3 bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-opacity-90 transition transform hover:-translate-y-1"
                  >
                    <CalendarPlus />
                    Book This Venue
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#4ECDC4] pb-2">About {venue.name}</h2>
                <p className="text-gray-700 leading-relaxed">{venue.about}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#4ECDC4] pb-2">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="w-6 h-6 text-[#4ECDC4]" />
                      <span className="text-gray-700 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <iframe
                title={`${venue.name} Location Map`}
                src={mapSrc}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl shadow-md w-full"
              ></iframe>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#4ECDC4] pb-2">Player Reviews</h2>
            <div className="space-y-6">
              {venue.reviews.map((review, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{review.user}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-[#4ECDC4] fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <BookingModal venue={venue} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default VenueDetailsPage;