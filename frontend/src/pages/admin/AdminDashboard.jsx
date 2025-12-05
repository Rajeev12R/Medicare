// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    recentAppointments: 0,
    revenue: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getDashboardStats({ timeRange });
      
      // Ensure all required fields exist
      const data = response.data || {};
      setStats({
        totalDoctors: data.totalDoctors || 0,
        totalPatients: data.totalPatients || 0,
        totalAppointments: data.totalAppointments || 0,
        pendingAppointments: data.pendingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        recentAppointments: data.recentAppointments || 0,
        revenue: data.revenue || 0,
        growthRate: data.growthRate || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 max-w-md">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Data</div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={fetchDashboardStats}
            variant="outline"
            className="w-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Format revenue with proper handling
  const formatRevenue = (amount) => {
    if (typeof amount !== 'number') return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const mainStats = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: formatRevenue(stats.revenue),
      icon: DollarSign,
      color: 'from-accent-500 to-accent-600',
      change: '+22%',
      trend: 'up',
    },
  ];

  const secondaryStats = [
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Awaiting confirmation',
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: Calendar,
      color: 'bg-green-100 text-green-800',
      description: 'This month',
    },
    {
      title: 'Recent (7 days)',
      value: stats.recentAppointments,
      icon: Activity,
      color: 'bg-blue-100 text-blue-800',
      description: 'New appointments',
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800',
      description: 'Monthly growth',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Admin Dashboard</h1>
          <p className="text-neutral-600 mt-2">System overview and analytics</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === range.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button variant="primary">
            <Activity size={18} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : (
                    <ArrowDown size={12} className="mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.title}</p>
              <div className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Secondary Stats */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Platform Metrics</h2>
            <div className="grid grid-cols-2 gap-6">
              {secondaryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="p-4 bg-neutral-50 rounded-lg hover:bg-white transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${stat.color.split(' ')[0]}`}>
                        <Icon className={`${stat.color.split(' ')[1]}`} size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        <p className="text-sm text-neutral-600">{stat.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">{stat.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <a
              href="/admin/doctors"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Stethoscope className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Manage Doctors</h3>
                  <p className="text-sm text-blue-700">View and verify doctor profiles</p>
                </div>
              </div>
              <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </a>
            
            <a
              href="/admin/patients"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">View Patients</h3>
                  <p className="text-sm text-green-700">Manage patient accounts</p>
                </div>
              </div>
              <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </a>
            
            <a
              href="/admin/appointments"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Monitor Appointments</h3>
                  <p className="text-sm text-purple-700">Track all appointments</p>
                </div>
              </div>
              <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </a>
            
            <a
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl hover:from-accent-100 hover:to-accent-200 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent-600 rounded-lg">
                  <Activity className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-accent-900">System Settings</h3>
                  <p className="text-sm text-accent-700">Configure platform settings</p>
                </div>
              </div>
              <div className="text-accent-600 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Recent System Activity</h2>
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'New doctor registration', user: 'Dr. Sarah Johnson', time: '10 min ago', type: 'success' },
            { action: 'Appointment cancelled', user: 'John Smith', time: '25 min ago', type: 'warning' },
            { action: 'Payment processed', user: 'Emma Wilson', time: '1 hour ago', type: 'success' },
            { action: 'Patient profile updated', user: 'Robert Brown', time: '2 hours ago', type: 'info' },
            { action: 'System backup completed', user: 'System', time: '3 hours ago', type: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-white transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}></div>
                <div>
                  <p className="font-medium text-neutral-900">{activity.action}</p>
                  <p className="text-sm text-neutral-600">{activity.user}</p>
                </div>
              </div>
              <div className="text-sm text-neutral-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};