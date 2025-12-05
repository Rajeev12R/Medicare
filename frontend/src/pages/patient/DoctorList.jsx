import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { DoctorCard } from '../../components/patient/DoctorCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useForm } from 'react-hook-form';
import { patientService } from '../../services/patientService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    minExperience: '',
    maxFee: '',
    search: '',
  });

  const { register, handleSubmit, reset } = useForm();
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getDoctors(filters);
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const onSubmitAppointment = async (data) => {
    try {
      await patientService.createAppointment({
        doctorId: selectedDoctor._id,
        date: data.date,
        slot: data.slot,
        reason: data.reason,
      });
      toast.success('Appointment requested successfully!');
      setShowBookingModal(false);
      reset();
      fetchDoctors();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateTimeSlots = () => {
    if (!selectedDoctor?.timeSlots || selectedDoctor.timeSlots.length === 0) {
      toast.error('Doctor has not set their working hours');
      return [];
    }

    const slots = [];
    selectedDoctor.timeSlots.forEach(timeSlot => {
      const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = timeSlot.end.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Add 30 minutes for slot duration
        let nextHour = currentHour;
        let nextMinute = currentMinute + 30;
        
        if (nextMinute >= 60) {
          nextHour += 1;
          nextMinute -= 60;
        }
        
        const endTime = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;
        
        // Check if this slot exceeds doctor's end time
        if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
          break;
        }
        
        slots.push(`${startTime}-${endTime}`);
        
        // Move to next slot
        currentHour = nextHour;
        currentMinute = nextMinute;
      }
    });
    
    return slots;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-600">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Find Doctors</h1>
          <p className="text-neutral-600 mt-2">Book appointments with verified healthcare professionals</p>
        </div>
        
        {user?.role === 'patient' && (
          <div className="mt-4 lg:mt-0">
            <p className="text-sm text-neutral-500">
              Showing {doctors.length} doctors
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Search size={16} className="mr-2 text-neutral-400" />
              Search Doctors
            </label>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              placeholder="Cardiology, Dermatology..."
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              City
            </label>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Min Experience
            </label>
            <input
              type="number"
              placeholder="Years"
              value={filters.minExperience}
              onChange={(e) => handleFilterChange('minExperience', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Max Fee (₹)
            </label>
            <input
              type="number"
              placeholder="Max fee"
              value={filters.maxFee}
              onChange={(e) => handleFilterChange('maxFee', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-neutral-500">
            Filter results by your preferences
          </div>
          <Button
            variant="outline"
            onClick={() => setFilters({ specialization: '', city: '', minExperience: '', maxFee: '', search: '' })}
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="space-y-6">
        {doctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-soft border border-neutral-200">
            <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-2xl mb-6">
              <Search size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No doctors found</h3>
            <p className="text-neutral-600 mb-4">Try adjusting your search filters or try a different search term</p>
            <Button
              onClick={() => setFilters({ specialization: '', city: '', minExperience: '', maxFee: '', search: '' })}
              variant="outline"
              className="border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onBookAppointment={handleBookAppointment}
            />
          ))
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          reset();
        }}
        title={`Book Appointment with Dr. ${selectedDoctor?.user?.name}`}
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* Doctor Info Summary */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-lg">
                    {selectedDoctor.user?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">Dr. {selectedDoctor.user?.name}</h3>
                  <p className="text-primary-700 font-medium">{selectedDoctor.specialization}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-primary-600">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {selectedDoctor.experienceYears} yrs exp
                    </div>
                    <div className="flex items-center">
                      <span>Fee: ₹{selectedDoctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitAppointment)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                    <Calendar size={16} className="mr-2 text-primary-600" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                    <Clock size={16} className="mr-2 text-primary-600" />
                    Time Slot
                  </label>
                  <select
                    {...register('slot', { required: 'Time slot is required' })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a time slot</option>
                    {generateTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  {...register('reason', { required: 'Reason is required' })}
                  rows={3}
                  placeholder="Describe your symptoms or reason for appointment..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Additional Information */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Please arrive 10 minutes before your scheduled time</li>
                  <li>• Bring any previous medical reports if applicable</li>
                  <li>• Consultation fee: ₹{selectedDoctor.consultationFee} (payable at clinic)</li>
                  <li>• 24-hour cancellation policy applies</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBookingModal(false)}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="shadow-md hover:shadow-lg"
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};