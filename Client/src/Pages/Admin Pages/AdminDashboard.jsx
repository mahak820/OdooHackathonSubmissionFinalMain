import React, { useEffect } from 'react';
import { Users, Building2, Calendar, MapPin, TrendingUp, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../features/admin/adminSlice';

const AdminDashboard = () => {
    const {users} = useSelector(state => state.admin)
    
    
    
    const dispatch = useDispatch()
    
    const fetchData = async () => {
        dispatch(getUsers())
    }
    const facilityOwnersCount = users?.filter(user => user.role === "owner").length;

    
    useEffect(() => {
      fetchData();
    } , [dispatch])
    console.log(users)
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
        value: '12,495',
        change: '+23%',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        name: 'Active Courts',
        value: '384',
        change: '+15%',
        icon: MapPin,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
    ];

  console.log(users)

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
          <div 
            id="booking-activity-chart" 
            className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <p className="text-gray-500 text-sm">Chart.js Booking Activity Chart will be added here</p>
          </div>
        </div>

        {/* User Registration Trends Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trends</h3>
          <div 
            id="user-registration-chart" 
            className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <p className="text-gray-500 text-sm">Chart.js User Registration Chart will be added here</p>
          </div>
        </div>

        {/* Facility Approval Trend Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Approval Trend</h3>
          <div 
            id="facility-approval-chart" 
            className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <p className="text-gray-500 text-sm">Chart.js Facility Approval Chart will be added here</p>
          </div>
        </div>

        {/* Most Active Sports Container */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Sports</h3>
          <div 
            id="active-sports-chart" 
            className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <p className="text-gray-500 text-sm">Chart.js Sports Activity Chart will be added here</p>
          </div>
        </div>
      </div>

      {/* Earnings Simulation Chart Container */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Simulation Chart</h3>
        <div 
          id="earnings-simulation-chart" 
          className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
        >
          <p className="text-gray-500 text-sm">Chart.js Earnings Simulation Chart will be added here</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;