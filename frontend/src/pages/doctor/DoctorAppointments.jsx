// pages/doctor/DoctorAppointments.jsx - Fixed
import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { AppointmentCard } from '../../components/patient/AppointmentCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: '',
  });

  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAppointments(filters);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = (appointment, type) => {
    setSelectedAppointment(appointment);
    setActionType(type);
  };

  const onSubmitAction = async (data) => {
    try {
      switch (actionType) {
        case 'approve':
          await doctorService.approveAppointment(selectedAppointment._id);
          toast.success('Appointment approved');
          break;
        case 'reject':
          await doctorService.rejectAppointment(selectedAppointment._id, data.reason);
          toast.success('Appointment rejected');
          break;
        case 'complete':
          await doctorService.completeAppointment(selectedAppointment._id, data);
          toast.success('Appointment completed');
          break;
        default:
          break;
      }
      setSelectedAppointment(null);
      setActionType('');
      reset();
      fetchAppointments();
    } catch (error) {
      const message = error.response?.data?.message || 'Action failed';
      toast.error(message);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getModalTitle = () => {
    switch (actionType) {
      case 'approve': return 'Approve Appointment';
      case 'reject': return 'Reject Appointment';
      case 'complete': return 'Complete Appointment';
      default: return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Appointment Requests</h1>
          <p className="text-neutral-600 mt-2">Manage your appointment schedule</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Search size={16} className="mr-2 text-neutral-400" />
              Search Patient
            </label>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Filter size={16} className="mr-2 text-neutral-400" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-neutral-400" />
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ status: '', date: '', search: '' })}
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
            <Calendar className="mx-auto text-neutral-300 mb-4" size={48} />
            <p className="text-neutral-600 text-lg">No appointments found</p>
            <p className="text-neutral-500 mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
              <AppointmentCard
                appointment={appointment}
                onCancel={(apt) => handleAppointmentAction(apt, 'reject')}
                userRole={user.role}
              />
              
              {/* Action Buttons for Pending Appointments */}
              {appointment.status === 'pending' && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-neutral-200">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAppointmentAction(appointment, 'approve')}
                    icon={CheckCircle}
                    iconPosition="left"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAppointmentAction(appointment, 'reject')}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    icon={XCircle}
                    iconPosition="left"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {/* Complete Button for Approved Appointments */}
              {appointment.status === 'approved' && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-neutral-200">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAppointmentAction(appointment, 'complete')}
                    icon={CheckCircle}
                    iconPosition="left"
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={!!actionType}
        onClose={() => {
          setActionType('');
          reset();
        }}
        title={getModalTitle()}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitAction)} className="space-y-4">
          {actionType === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                {...register('reason', { required: 'Please provide a rejection reason' })}
                rows={4}
                placeholder="Why are you rejecting this appointment?"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          {actionType === 'complete' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Doctor's Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Add your clinical notes..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prescription
                </label>
                <textarea
                  {...register('prescription')}
                  rows={3}
                  placeholder="Add prescription details..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActionType('')}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};