import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Heart,
  Activity,
  AlertCircle,
  FileText,
  Clipboard,
  ChevronRight
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const PatientDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const appointmentsRes = await patientService.getAppointments();

      const appointments = appointmentsRes.data || [];

      const now = new Date();
      const upcoming = appointments.filter(apt =>
        new Date(apt.date) > now && ['pending', 'approved'].includes(apt.status)
      ).slice(0, 3);

      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
        upcomingAppointments: upcoming.length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
      });

      setUpcomingAppointments(upcoming);
      setRecentActivities([]); // until you add activities API
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-primary-600',
      textColor: 'text-primary-700',
      bgColor: 'bg-primary-50',
      description: 'All time appointments',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'bg-accent-600',
      textColor: 'text-accent-700',
      bgColor: 'bg-accent-50',
      description: 'Awaiting confirmation',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: TrendingUp,
      color: 'bg-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Scheduled appointments',
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: Heart,
      color: 'bg-purple-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      description: 'Past consultations',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 max-w-md">
          <div className="text-red-700 text-lg font-medium mb-2">Error Loading Data</div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white shadow-hard">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">
              Welcome back, {user?.name || 'Patient'}!
            </h1>
            <p className="mt-2 opacity-90">
              Your health journey matters. Stay on top of your appointments and wellness.
            </p>
          </div>
          <Button
            href="/patient/doctors"
            variant="outline"
            className="mt-4 lg:mt-0 bg-white/20 hover:bg-white/30 border-white/30 text-white"
            icon={ChevronRight}
            iconPosition="right"
          >
            Book New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.bgColor} rounded-xl p-6 shadow-soft border border-${stat.color.split('-')[1]}-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} shadow-md`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-sm text-neutral-600 mt-1">{stat.description}</p>
              <div className={`h-1 w-full ${stat.color} rounded-full mt-4 opacity-30`}></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
              <Calendar className="mr-2 text-primary-600" size={24} />
              Upcoming Appointments
            </h2>
            <a
              href="/patient/appointments"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ChevronRight size={16} />
            </a>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-neutral-300 mb-4" size={48} />
              <p className="text-neutral-600">No upcoming appointments</p>
              <Button
                href="/patient/doctors"
                variant="outline"
                size="sm"
                className="mt-4 border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                Book Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 transition-colors group border border-neutral-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-neutral-200">
                      <Calendar className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        Dr. {appointment.doctor?.user?.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium">
                        {appointment.doctor?.specialization}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-sm">
                        <span className="text-neutral-600">
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-600">{appointment.slot}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'pending'
                      ? 'bg-accent-100 text-accent-800 border border-accent-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                      {appointment.status}
                    </span>
                    <ChevronRight className="text-neutral-400 group-hover:text-primary-600" size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-neutral-50 to-white rounded-xl shadow-soft p-6 border border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            href="/patient/doctors"
            variant="primary"
            className="justify-start h-auto py-4"
            icon={Users}
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Find Doctors</div>
              <div className="text-sm text-primary-700">Book appointments</div>
            </div>
          </Button>

          <Button
            href="/patient/appointments"
            variant="secondary"
            className="justify-start h-auto py-4"
            icon={Calendar}
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">My Appointments</div>
              <div className="text-sm text-secondary-700">View schedule</div>
            </div>
          </Button>

          <Button
            href="/patient/records"
            variant="accent"
            className="justify-start h-auto py-4"
            icon={FileText}
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Health Records</div>
              <div className="text-sm text-accent-700">Access history</div>
            </div>
          </Button>

          <Button
            href="/patient/prescriptions"
            variant="outline"
            className="justify-start h-auto py-4 border-primary-600 text-primary-600 hover:bg-primary-50"
            icon={Clipboard}
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Prescriptions</div>
              <div className="text-sm text-primary-700">View medications</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};