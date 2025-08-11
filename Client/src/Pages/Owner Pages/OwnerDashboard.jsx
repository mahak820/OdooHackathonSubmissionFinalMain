import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DollarSign, BarChart2, Calendar as CalendarIcon, ShieldCheck, BarChart3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVenuesOfOwner } from '../../features/venue/venueSlice';
import { getBookingsOfOwner } from '../../features/booking/bookingSlice';

const localizer = momentLocalizer(moment);

const kpiData = { monthlyEarnings: 85500 };
const calendarEvents = [
    { title: 'Rohan S. - Turf A', start: new Date(2025, 7, 11, 18, 0), end: new Date(2025, 7, 11, 19, 0) },
    { title: 'Priya M. - Court 2', start: new Date(2025, 7, 12, 16, 0), end: new Date(2025, 7, 12, 17, 0) },
    { title: 'Anika S. - Turf B', start: new Date(2025, 7, 15, 19, 0), end: new Date(2025, 7, 15, 21, 0) },
];

const KPI_Card = ({ title, value, icon: Icon, formatAsCurrency = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatAsCurrency ? `₹${value.toLocaleString('en-IN')}` : value}
            </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
            <Icon className="w-6 h-6 text-green-600" />
        </div>
    </div>
);

const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex-grow w-full h-full min-h-[250px]">{children}</div>
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

    console.log(venues)

    return (
        // The main container is now simpler, as the layout handles the background
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-gray-600">Welcome back! Here's a summary of your facility's performance.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KPI_Card title="Total Bookings (Month)" value={bookings?.length || 0} icon={BarChart2} />
                    <KPI_Card title="Active Courts" value={venues?.length || 0} icon={ShieldCheck} />
                    <KPI_Card title="Monthly Earnings" value={kpiData.monthlyEarnings} icon={DollarSign} formatAsCurrency />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ChartContainer title="Booking Trends">
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                                <div className="text-center">
                                    <BarChart3 size={40} className="mx-auto" />
                                    <p className="mt-2 text-sm font-semibold">Booking Trends Chart</p>
                                </div>
                            </div>
                        </ChartContainer>
                    </div>
                    <div>
                        <ChartContainer title="Earnings Summary">
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                                <div className="text-center">
                                    <BarChart3 size={40} className="mx-auto" />
                                    <p className="mt-2 text-sm font-semibold">Earnings Summary Chart</p>
                                </div>
                            </div>
                        </ChartContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarIcon size={20}/> Booking Calendar</h3>
                    <div className="h-[500px] lg:h-[600px]">
                        <Calendar localizer={localizer} events={calendarEvents} startAccessor="start" endAccessor="end" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;