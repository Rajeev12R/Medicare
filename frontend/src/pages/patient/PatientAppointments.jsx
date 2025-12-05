// pages/patient/PatientAppointments.jsx - Fixed
import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { AppointmentCard } from '../../components/patient/AppointmentCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Filter, 
  Search,
  ChevronRight
} from 'lucide-react';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    from: '',
    to: '',
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
      const response = await patientService.getAppointments(filters);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const onSubmitCancel = async (data) => {
    try {
      await patientService.cancelAppointment(selectedAppointment._id, data.reason);
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      reset();
      fetchAppointments();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel appointment';
      toast.error(message);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">My Appointments</h1>
          <p className="text-neutral-600 mt-2">Manage your healthcare appointments</p>
        </div>
        <Button
          href="/patient/doctors"
          variant="primary"
          icon={ChevronRight}
          iconPosition="right"
        >
          Book New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Search size={16} className="mr-2 text-neutral-400" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by doctor or reason..."
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
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-2 text-neutral-400" />
              To Date
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => setFilters({ status: '', from: '', to: '', search: '' })}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-soft border border-neutral-200">
            <Calendar className="mx-auto text-neutral-300 mb-4" size={48} />
            <p className="text-neutral-600 text-lg">No appointments found</p>
            <p className="text-neutral-500 mt-1">Try booking your first appointment</p>
            <Button
              href="/patient/doctors"
              variant="primary"
              className="mt-4"
            >
              Find Doctors
            </Button>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={handleCancelAppointment}
              userRole={user.role}
            />
          ))
        )}
      </div>

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          reset();
        }}
        title="Cancel Appointment"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitCancel)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cancellation Reason
            </label>
            <textarea
              {...register('reason', { required: 'Please provide a reason for cancellation' })}
              rows={4}
              placeholder="Why are you cancelling this appointment?"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Keep Appointment
            </Button>
            <Button 
              type="submit" 
              variant="danger"
              className="border-red-600 bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { PatientAppointments };