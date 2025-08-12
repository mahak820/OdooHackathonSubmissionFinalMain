import React, { useEffect } from 'react';
import { DollarSign, BarChart2, Calendar as CalendarIcon, ShieldCheck, TrendingUp, Users, Clock, Star, Award, Activity } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVenuesOfOwner } from '../../features/venue/venueSlice';
import { getBookingsOfOwner } from '../../features/booking/bookingSlice';

const kpiData = { monthlyEarnings: 0 };

// Extra static data for enhanced features
const recentBookings = [
    { id: 1, user: 'Rohan S.', venue: 'Turf A', time: '6:00 PM', status: 'confirmed' },
    { id: 2, user: 'Priya M.', venue: 'Court 2', time: '4:00 PM', status: 'completed' },
    { id: 3, user: 'Anika S.', venue: 'Turf B', time: '8:00 PM', status: 'confirmed' },
];

const weeklyStats = [
    { day: 'Mon', bookings: 12 },
    { day: 'Tue', bookings: 15 },
    { day: 'Wed', bookings: 8 },
    { day: 'Thu', bookings: 18 },
    { day: 'Fri', bookings: 22 },
    { day: 'Sat', bookings: 25 },
    { day: 'Sun', bookings: 20 },
];

const topVenues = [
    { name: 'Champion\'s Turf A', bookings: 45, rating: 4.8 },
    { name: 'SportZone Court 1', bookings: 38, rating: 4.6 },
    { name: 'Elite Badminton Hall', bookings: 32, rating: 4.9 },
];

const KPI_Card = ({ title, value, icon: Icon, formatAsCurrency = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div>
            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1 group-hover:text-black transition-colors">
                {formatAsCurrency ? `₹${value.toLocaleString('en-IN')}` : value}
            </p>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-full group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
            <Icon className="w-6 h-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
        </div>
    </div>
);

const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col hover:shadow-xl transition-all duration-300 group">
        <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-black transition-colors">{title}</h3>
        <div className="flex-grow w-full h-full min-h-[250px]">{children}</div>
    </div>
);

const RecentBookingItem = ({ booking }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
        <div className="flex-1">
            <p className="font-medium text-gray-800 group-hover:text-black transition-colors">{booking.user}</p>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{booking.venue}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{booking.time}</p>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                booking.status === 'confirmed' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
            }`}>
                {booking.status}
            </span>
        </div>
    </div>
);

const WeeklyChart = () => (
    <div className="space-y-3">
        {weeklyStats.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{day.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                        style={{ width: `${(day.bookings / 25) * 100}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-gray-800 w-6">{day.bookings}</span>
            </div>
        ))}
    </div>
);

const TopVenueItem = ({ venue }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
        <div className="flex-1">
            <p className="font-medium text-gray-800 group-hover:text-black transition-colors">{venue.name}</p>
            <p className="text-sm text-gray-500">{venue.bookings} bookings</p>
        </div>
        <div className="flex items-center gap-1">
            <Star size={14} className="text-orange-500 fill-current" />
            <span className="text-sm font-bold text-gray-700">{venue.rating}</span>
        </div>
    </div>
);

const OwnerDashboard = () => {
    const { venues } = useSelector(state => state.venue);
    const { bookings } = useSelector(state => state.booking);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllVenuesOfOwner());
        dispatch(getBookingsOfOwner());
    }, [dispatch]);

    console.log('Venues:', venues);
    console.log('Bookings:', bookings);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-orange-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome back! Here's a comprehensive overview of your facility's performance.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KPI_Card title="Total Bookings (Month)" value={bookings?.length || 0} icon={BarChart2} />
                    <KPI_Card title="Active Venues" value={venues?.length || 0} icon={ShieldCheck} />
                    <KPI_Card title="Monthly Earnings" value={kpiData.monthlyEarnings} icon={DollarSign} formatAsCurrency />
                    <KPI_Card title="Average Rating" value="4.7" icon={Star} />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Weekly Bookings Chart */}
                    <div className="lg:col-span-8">
                        <ChartContainer title="Weekly Booking Trends">
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-gray-50 rounded-lg border border-orange-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-gray-900/5"></div>
                                <div className="relative z-10 w-full p-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gradient-to-r from-orange-500 to-gray-900 p-2 rounded-lg">
                                            <TrendingUp size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800">This Week's Performance</h4>
                                            <p className="text-sm text-gray-600">Daily booking statistics</p>
                                        </div>
                                    </div>
                                    <WeeklyChart />
                                </div>
                            </div>
                        </ChartContainer>
                    </div>

                    {/* Recent Bookings */}
                    <div className="lg:col-span-4">
                        <ChartContainer title="Recent Bookings">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity size={20} className="text-orange-500" />
                                    <span className="text-sm font-medium text-gray-600">Latest Activity</span>
                                </div>
                                {recentBookings.map((booking) => (
                                    <RecentBookingItem key={booking.id} booking={booking} />
                                ))}
                                <button className="w-full mt-4 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium">
                                    View All Bookings
                                </button>
                            </div>
                        </ChartContainer>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Performing Venues */}
                    <div>
                        <ChartContainer title="Top Performing Venues">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <Award size={20} className="text-orange-500" />
                                    <span className="text-sm font-medium text-gray-600">Best Performers</span>
                                </div>
                                {topVenues.map((venue) => (
                                    <TopVenueItem key={venue.name} venue={venue} />
                                ))}
                            </div>
                        </ChartContainer>
                    </div>

                    {/* Quick Stats */}
                    <div>
                        <ChartContainer title="Quick Stats">
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Today's Bookings</p>
                                            <p className="text-2xl font-bold text-orange-600">12</p>
                                        </div>
                                        <CalendarIcon className="text-orange-500" size={24} />
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Peak Hours</p>
                                            <p className="text-lg font-bold text-gray-700">6-8 PM</p>
                                        </div>
                                        <Clock className="text-gray-500" size={24} />
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Customers</p>
                                            <p className="text-2xl font-bold text-orange-600">248</p>
                                        </div>
                                        <Users className="text-orange-500" size={24} />
                                    </div>
                                </div>
                            </div>
                        </ChartContainer>
                    </div>

                    {/* Performance Insights */}
                    <div>
                        <ChartContainer title="Performance Insights">
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <TrendingUp size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Bookings Up</p>
                                            <p className="text-xs text-green-600">+15% this week</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <Star size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">High Ratings</p>
                                            <p className="text-xs text-blue-600">4.7/5 average</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-full">
                                            <Users size={16} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-orange-800">New Customers</p>
                                            <p className="text-xs text-orange-600">32 this month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ChartContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;