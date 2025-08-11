import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Star, MapPin, Clock, Home, ChevronLeft, ChevronRight, Wifi, ParkingCircle,
    ShowerHead, Lock, Trophy, Users, CalendarPlus, ArrowLeft,
} from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { SportsLoader } from '../components/ui/SportsLoader';
import { fetchVenue } from '../features/venue/venueSlice';
import { fetchReviews } from '../features/review/reviewSlice';

// A mapping to get the correct icon for each amenity name
const amenityIcons = {
    'Free Wi-Fi': Wifi,
    'Parking': ParkingCircle,
    'Showers': ShowerHead,
    'Lockers': Lock,
    'Tournaments Held': Trophy,
    'Changing Rooms': Users,
    'Indoor Court': Home,
    'Air Conditioning': Home,
    'Drinking Water': Home,
    'Spectator Seating': Home,
};

const VenueDetailsPage = () => {
    const { venueId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { reviews, isLoading: isReviewsLoading } = useSelector(state => state.review);
    const { venue, isLoading: isVenueLoading } = useSelector(state => state.venue);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        dispatch(fetchVenue(venueId));
        dispatch(fetchReviews(venueId));
        window.scrollTo(0, 0);
    }, [venueId, dispatch]);

    const nextImage = () => {
        if (!venue || !venue.photos) return;
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % venue.photos.length);
    };

    const prevImage = () => {
        if (!venue || !venue.photos) return;
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + venue.photos.length) % venue.photos.length);
    };

    const stopAutoplay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const startAutoplay = () => {
        stopAutoplay();
        intervalRef.current = setInterval(nextImage, 4000);
    };

    useEffect(() => {
        if (venue && venue?.photos) startAutoplay();
        return () => stopAutoplay();
    }, [venue]);

    // Show loader if either venue or reviews are loading
    if (isVenueLoading || isReviewsLoading) {
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

    const amenitiesArray = venue?.amenities?.[0]?.split(',').map(amenity => amenity.trim()) || [];
    const operatingHours = `${venue?.operatingHours_openingTime} - ${venue?.operatingHours_closingTime}`;
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
                                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%) `}}>
                                        {venue?.photos?.map((img, index) => (
                                            <img key={index} src={img} alt={`${venue?.name} facility ${index + 1}`} className="w-full flex-shrink-0 object-cover aspect-video" />
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
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{venue?.name}</h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                                    <span>{venue?.address}</span>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-6 h-6 ${i < Math.floor(venue?.rating) ? 'text-[#4ECDC4] fill-current' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="text-xl text-gray-800 font-bold ml-3">{venue?.rating}</span>
                                </div>
                                <hr className="my-4" />
                                <div className="space-y-3 text-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Venue Info</h3>
                                    <div className="flex items-start"><Clock className="w-5 h-5 mr-3 mt-1 text-[#FF6B35] flex-shrink-0" /><div><strong>Operating Hours:</strong><br />{operatingHours}</div></div>
                                    <div className="flex items-start"><Home className="w-5 h-5 mr-3 mt-1 text-[#FF6B35] flex-shrink-0" /><div><strong>Address:</strong><br />{venue?.address}</div></div>
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#4ECDC4] pb-2">About {venue?.name}</h2>
                                <p className="text-gray-700 leading-relaxed">{venue?.description}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#4ECDC4] pb-2">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {amenitiesArray.map((amenityName, index) => {
                                        const Icon = amenityIcons[amenityName] || Home;
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Icon className="w-6 h-6 text-[#4ECDC4]" />
                                                <span className="text-gray-700 font-medium">{amenityName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            {/* The map iframe is commented out as the API data does not provide lat/lng */}
                            {/* <iframe
                                title={${venue?.name} Location Map}
                                src={mapSrc}
                                width="100%"
                                height="350"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-xl shadow-md w-full"
                            ></iframe> */}
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-[#4ECDC4] pb-2">Player Reviews</h2>
                        <div className="space-y-6">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-extrabold text-xl text-gray-800">{review?.userId?.name}</h4>
                                                <span className="text-sm text-gray-500">
                                                    {review?.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center flex-shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-[#4ECDC4] fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mt-4">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No reviews yet for this venue.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && <BookingModal venue={venue} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default VenueDetailsPage;