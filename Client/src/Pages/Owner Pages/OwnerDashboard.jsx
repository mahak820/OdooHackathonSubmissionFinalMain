import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// CSS for react-big-calendar is still needed.
// Import it in your main App.js or index.js
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DollarSign, BarChart2, Calendar as CalendarIcon, ShieldCheck, BarChart3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVenuesOfOwner } from '../../features/venue/venueSlice';

// Setup for the calendar component
const localizer = momentLocalizer(moment);

// --- MOCK DATA for KPIs & Calendar ---
const kpiData = {
  totalBookings: 124,
  activeCourts: 6,
  monthlyEarnings: 85500,
};

// Data for the calendar remains
const calendarEvents = [
    { title: 'Rohan S. - Turf A', start: new Date(2025, 7, 11, 18, 0), end: new Date(2025, 7, 11, 19, 0) },
    { title: 'Priya M. - Court 2', start: new Date(2025, 7, 12, 16, 0), end: new Date(2025, 7, 12, 17, 0) },
    { title: 'Anika S. - Turf B', start: new Date(2025, 7, 15, 19, 0), end: new Date(2025, 7, 15, 21, 0) },
    { title: 'Vikram R. - Nets', start: new Date(2025, 7, 16, 10, 0), end: new Date(2025, 7, 16, 11, 0) },
];


// --- Sub-Components ---
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

// This container provides the card styling for the chart placeholders
const ChartContainer = ({ title, children, toggle }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {toggle && toggle}
        </div>
        <div className="flex-grow w-full h-full min-h-[250px]">
            {children}
        </div>
    </div>
);

// --- Main Dashboard Component ---
const OwnerDashboard = () => {

    const {venues , isLoading , isError} = useSelector(state => state.venue)

    const dispatch = useDispatch() 

    const fetchData = async () => {
      dispatch(getAllVenuesOfOwner())
    }

    useEffect(() => {
        fetchData()
    } , [dispatch])

    console.log(venues)

    

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's a summary of your facility's performance.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPI_Card title="Total Bookings (Month)" value={kpiData.totalBookings} icon={BarChart2} />
          <KPI_Card title="Active Courts" value={venues?.length || 0} icon={ShieldCheck} />
          <KPI_Card title="Monthly Earnings" value={kpiData.monthlyEarnings} icon={DollarSign} formatAsCurrency />
        </div>

        {/* Chart Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <ChartContainer title="Booking Trends">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                    <div className="text-center">
                        <BarChart3 size={40} className="mx-auto" />
                        <p className="mt-2 text-sm font-semibold">Booking Trends Chart (Chart.js)</p>
                        <p className="text-xs">will be implemented here</p>
                    </div>
                </div>
             </ChartContainer>
          </div>
          <div>
            <ChartContainer title="Earnings Summary">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                    <div className="text-center">
                        <BarChart3 size={40} className="mx-auto" />
                        <p className="mt-2 text-sm font-semibold">Earnings Summary (Chart.js)</p>
                        <p className="text-xs">will be implemented here</p>
                    </div>
                </div>
            </ChartContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1">
             <ChartContainer title="Peak Booking Hours">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                    <div className="text-center">
                        <BarChart3 size={40} className="mx-auto" />
                        <p className="mt-2 text-sm font-semibold">Peak Hours Chart (Chart.js)</p>
                        <p className="text-xs">will be implemented here</p>
                    </div>
                </div>
             </ChartContainer>
        </div>

        {/* Booking Calendar */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarIcon size={20}/> Booking Calendar</h3>
            <div className="h-[500px] lg:h-[600px]">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;