import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { 
  Calendar, 
  Clock, 
  User, 
  Filter, 
  Search,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    patientId: '',
    from: '',
    to: '',
    search: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAppointments(filters);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-accent-100 text-accent-800 border border-accent-200',
    approved: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
    cancelled: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    completed: 'bg-blue-100 text-blue-800 border border-blue-200',
  };

  const statusIcons = {
    pending: AlertCircle,
    approved: CheckCircle,
    rejected: XCircle,
    cancelled: XCircle,
    completed: CheckCircle,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-600">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">All Appointments</h1>
          <p className="text-neutral-600 mt-2">Monitor and track all appointments</p>
        </div>
        <div className="text-sm text-neutral-500 mt-2 lg:mt-0">
          Total: {appointments.length} appointments
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ status: '', doctorId: '', patientId: '', from: '', to: '', search: '' })}
              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-soft border border-neutral-200">
            <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-2xl mb-4">
              <Calendar size={24} className="text-neutral-400" />
            </div>
            <p className="text-neutral-600 text-lg">No appointments found</p>
            <p className="text-neutral-500 mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const StatusIcon = statusIcons[appointment.status];
            return (
              <div key={appointment._id} className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">
                              {appointment.doctor?.user?.name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Dr. {appointment.doctor?.user?.name}
                          </h3>
                          <p className="text-primary-600 font-medium text-sm">
                            {appointment.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
                          {StatusIcon && <StatusIcon size={14} className="mr-1" />}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <Calendar size={16} className="text-primary-600" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <Clock size={16} className="text-primary-600" />
                        <span>{appointment.slot}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <User size={16} className="text-primary-600" />
                        <span>{appointment.patient?.name}</span>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-900 mb-1">Reason for Visit</div>
                        <div className="text-sm text-blue-700">{appointment.reason}</div>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-900 mb-1">Doctor's Notes</div>
                        <div className="text-sm text-green-700">{appointment.notes}</div>
                      </div>
                    )}

                    {appointment.prescription && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm font-medium text-purple-900 mb-1">Prescription</div>
                        <div className="text-sm text-purple-700">{appointment.prescription}</div>
                      </div>
                    )}

                    {appointment.cancellationReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-red-900 mb-1">Cancellation Reason</div>
                        <div className="text-sm text-red-700">{appointment.cancellationReason}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-between items-center">
                  <div className="text-sm text-neutral-500">
                    Appointment ID: #{appointment._id.slice(-8)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary-600 text-primary-600 hover:bg-primary-50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};