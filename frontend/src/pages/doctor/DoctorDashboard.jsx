// pages/doctor/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    monthlyRevenue: 0,
    patientSatisfaction: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [allAppointmentsRes, todayAppointmentsRes] = await Promise.all([
        doctorService.getAppointments(),
        doctorService.getAppointments({ date: today }),
      ]);

      const allAppointments = allAppointmentsRes.data;
      const todayApps = todayAppointmentsRes.data;
      
      // Filter upcoming appointments (next 7 days)
      const upcoming = allAppointments.filter(apt => {
        const appointmentDate = new Date(apt.date);
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return appointmentDate > today && 
               appointmentDate <= nextWeek && 
               ['pending', 'approved'].includes(apt.status);
      }).slice(0, 3);

      setStats({
        totalAppointments: allAppointments.length,
        pendingAppointments: allAppointments.filter(apt => apt.status === 'pending').length,
        todayAppointments: todayApps.length,
        completedAppointments: allAppointments.filter(apt => apt.status === 'completed').length,
        monthlyRevenue: allAppointments
          .filter(apt => apt.status === 'completed')
          .reduce((sum, apt) => sum + (apt.doctor?.consultationFee || 0), 0),
        patientSatisfaction: 4.8,
      });

      setTodayAppointments(todayApps);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-500">Loading your dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      description: 'All time appointments',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Awaiting confirmation',
    },
    {
      title: "Today's",
      value: stats.todayAppointments,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      description: 'Scheduled for today',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-accent-500 to-accent-600',
      description: 'This month',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-hard">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs">
                <Star size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display">
                  Welcome, Dr. {user?.name}!
                </h1>
                <p className="mt-2 opacity-90">
                  Manage your appointments and provide quality care to your patients.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Available for consultations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={16} className="text-yellow-300 fill-current" />
                <span className="text-sm">Rating: {stats.patientSatisfaction}/5</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 flex space-x-3">
            <Button
              href="/doctor/appointments"
              variant="outline"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              icon={Calendar}
              iconPosition="left"
            >
              View Schedule
            </Button>
            <Button
              href="/doctor/patients"
              variant="outline"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              icon={Users}
              iconPosition="left"
            >
              My Patients
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="text-white" size={24} />
                </div>
                {stat.title === "Today's" && stats.todayAppointments > 0 && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {stats.todayAppointments} Today
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{stat.title}</p>
              <p className="text-xs text-neutral-400 mt-2">{stat.description}</p>
              <div className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
              <Calendar className="mr-2 text-primary-600" size={24} />
              Today's Appointments
            </h2>
            <a 
              href="/doctor/appointments?date=today" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ChevronRight size={16} />
            </a>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-neutral-300 mb-4" size={48} />
              <p className="text-neutral-500">No appointments for today</p>
              <p className="text-sm text-neutral-400 mt-1">Enjoy your day off!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">
                          {appointment.patient?.name?.charAt(0)}
                        </span>
                      </div>
                      {appointment.status === 'approved' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {appointment.patient?.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm">
                        <span className="text-neutral-600">{appointment.slot}</span>
                        <span className="text-neutral-400">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      {appointment.reason && (
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                    </Button>
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="primary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
              <Clock className="mr-2 text-secondary-600" size={24} />
              Upcoming (Next 7 Days)
            </h2>
            <a 
              href="/doctor/appointments" 
              className="text-sm text-secondary-600 hover:text-secondary-700 flex items-center"
            >
              View all
              <ChevronRight size={16} />
            </a>
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto text-neutral-300 mb-4" size={48} />
              <p className="text-neutral-500">No upcoming appointments</p>
              <p className="text-sm text-neutral-400 mt-1">Schedule is clear for the week</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">
                        {appointment.patient?.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm">
                        <span className="text-blue-700">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-blue-400">•</span>
                        <span className="text-blue-700">{appointment.slot}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-900">
                        {appointment.reason ? appointment.reason.split(' ').slice(0, 3).join(' ') + '...' : 'Consultation'}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {appointment.patient?.age} years
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              href="/doctor/appointments"
              variant="primary"
              className="justify-start h-auto py-4"
              icon={Calendar}
              iconPosition="left"
            >
              <div className="text-left">
                <div className="font-medium">Appointments</div>
                <div className="text-sm opacity-75">Manage schedule</div>
              </div>
            </Button>
            
            <Button
              href="/doctor/profile"
              variant="secondary"
              className="justify-start h-auto py-4"
              icon={Users}
              iconPosition="left"
            >
              <div className="text-left">
                <div className="font-medium">Profile</div>
                <div className="text-sm opacity-75">Update information</div>
              </div>
            </Button>
            
            <Button
              href="/doctor/patients"
              variant="accent"
              className="justify-start h-auto py-4"
              icon={Users}
              iconPosition="left"
            >
              <div className="text-left">
                <div className="font-medium">Patients</div>
                <div className="text-sm opacity-75">View patient list</div>
              </div>
            </Button>
            
            <Button
              href="/doctor/schedule"
              variant="outline"
              className="justify-start h-auto py-4"
              icon={Clock}
              iconPosition="left"
            >
              <div className="text-left">
                <div className="font-medium">Schedule</div>
                <div className="text-sm opacity-75">Set availability</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Satisfaction Stats */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-hard p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Patient Satisfaction</h2>
            <Star size={24} className="text-yellow-300 fill-current" />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{stats.patientSatisfaction}</div>
            <div className="text-green-100">out of 5.0</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Professionalism</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`ml-1 ${
                      i < 5 ? 'text-yellow-300 fill-current' : 'text-green-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Communication</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`ml-1 ${
                      i < 5 ? 'text-yellow-300 fill-current' : 'text-green-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Wait Time</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`ml-1 ${
                      i < 4 ? 'text-yellow-300 fill-current' : 'text-green-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-green-400">
            <p className="text-sm text-green-100 text-center">
              Based on {stats.completedAppointments * 5 || 125} reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};