import React, { useEffect, useMemo } from 'react';
import { Users, Building2, Calendar, MapPin, TrendingUp, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings, getUsers, getVenues } from '../../features/admin/adminSlice';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import IncomeSimulationChart from '../../components/Charts/IncomeSimulationChart';


const AdminDashboard = () => {
    const {users , bookings , venues} = useSelector(state => state.admin)
    
    const year = 2025;
  const month = 7; // Augus
    
    
    const dispatch = useDispatch()
    
    const fetchData = async () => {
        dispatch(getUsers())
        dispatch(getBookings())
        dispatch(getVenues())
    }
    const facilityOwnersCount = users?.filter(user => user.role === "owner").length;

    
    useEffect(() => {
      fetchData();
    } , [dispatch])
    
    console.log(venues)
    const stats = [
      {
        name: 'Total Users',
        value: users?.length,
        change: '+12%',
        icon: Users,
        color: 'text-[#4ECDC4]',
        bgColor: 'bg-[#4ECDC4]/10',
      },
      {
        name: 'Facility Owners',
        value: facilityOwnersCount,
        change: '+8%',
        icon: Building2,
        color: 'text-[#FF6B35]',
        bgColor: 'bg-[#FF6B35]/10',
      },
      {
        name: 'Total Bookings',
        value: bookings?.length,
        change: '+23%',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        name: 'Active Courts',
        value: venues?.length,
        change: '+15%',
        icon: MapPin,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
    ];

    //Chart filtering 
    const { labels, data } = useMemo(() => {
    // Filter bookings in the specified month and year
    const filteredBookings = bookings.filter((booking) => {
      const date = new Date(booking.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    // Find number of days in that month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize count array with zeros for each day
    const dailyCounts = Array(daysInMonth).fill(0);

    // Count bookings per day
    filteredBookings.forEach((booking) => {
      const day = new Date(booking.createdAt).getDate(); // 1 to daysInMonth
      dailyCounts[day - 1] += 1; // array index is day-1
    });

    // Labels for days "01", "02", ..., "31"
    const labels = dailyCounts.map((_, i) =>
      (i + 1).toString().padStart(2, "0")
    );

    return { labels, data: dailyCounts };
  }, [bookings, year, month]);

  const { labels: userLabels, data: userData } = useMemo(() => {
  if (!users) return { labels: [], data: [] };

  // Filter users by the specified year and month
  const filteredUsers = users.filter(user => {
    const date = new Date(user.createdAt);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Initialize daily count array
  const dailyCounts = Array(daysInMonth).fill(0);

  filteredUsers.forEach(user => {
    const day = new Date(user.createdAt).getDate();
    dailyCounts[day - 1]++;
  });

  // Labels like "01", "02", ..., "31"
  const labels = dailyCounts.map((_, i) => (i + 1).toString().padStart(2, '0'));

  return { labels, data: dailyCounts };
}, [users, year, month]);


const { labels: topSportsLabels, data: topSportsData } = useMemo(() => {
  if (!venues || !Array.isArray(venues)) return { labels: [], data: [] };

  const sportCounts = {};

  venues.forEach(venue => {
    // venue.sportType is a string like "Cricket"
    const sport = venue.sportType;
    if (sport) {
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    }
  });

  const sortedSports = Object.entries(sportCounts).sort((a, b) => b[1] - a[1]);

  const top3 = sortedSports.slice(0, 3);

  return {
    labels: top3.map(item => item[0]),
    data: top3.map(item => item[1]),
  };
}, [venues]);

const { labels: incomeLabels, dailyIncome, movingAvgIncome } = useMemo(() => {
  if (!bookings || bookings.length === 0) return { labels: [], dailyIncome: [], movingAvgIncome: [] };

  const filtered = bookings.filter(b => {
    const d = new Date(b.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyIncome = Array(daysInMonth).fill(0);
  filtered.forEach(b => {
    const day = new Date(b.createdAt).getDate();
    dailyIncome[day - 1] += b.totalPrice || 0;
  });

  // Calculate 7-day moving average
  const movingAvgIncome = dailyIncome.map((_, idx, arr) => {
    const start = Math.max(0, idx - 6);
    const window = arr.slice(start, idx + 1);
    const sum = window.reduce((a, c) => a + c, 0);
    return sum / window.length;
  });

  const labels = dailyIncome.map((_, i) => (i + 1).toString().padStart(2, "0"));

  return { labels, dailyIncome, movingAvgIncome };
}, [bookings, year, month]);

  

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Here's what's happening with your sports facility platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="h-8 w-8 text-[#FF6B35]" />
          <TrendingUp className="h-8 w-8 text-[#4ECDC4]" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Activity Chart Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Activity Over Time</h3>
                <LineChart labels={labels} data={data} label="Bookings" />

        </div>

        {/* User Registration Trends Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trends</h3>
          {userLabels.length > 0 ? (
                <BarChart labels={userLabels} data={userData} label="Registrations" />
            ) : (
                <p className="text-gray-500 text-sm">No user registration data for selected month.</p>
            )}
        </div>

        {/* Facility Approval Trend Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Trend</h3>
          {incomeLabels.length ? (
    <IncomeSimulationChart
      labels={incomeLabels}
      dailyIncome={dailyIncome}
      movingAvgIncome={movingAvgIncome}
    />
  ) : (
    <p className="text-gray-500">No income data available for this month.</p>
  )}
        </div>

        {/* Most Active Sports Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Sports</h3>
          {topSportsLabels.length > 0 ? (
                <PieChart labels={topSportsLabels} data={topSportsData} />
            ) : (
                <p className="text-gray-500">No sports data available.</p>
            )}
        </div>
      </div>

      {/* Earnings Simulation Chart Container */}
      {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Simulation Chart</h3>
        <div 
          id="earnings-simulation-chart" 
          className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <p className="text-gray-500 text-sm">Chart.js Earnings Simulation Chart will be added here</p>
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;