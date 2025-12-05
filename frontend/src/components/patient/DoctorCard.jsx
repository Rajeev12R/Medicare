// components/patient/DoctorCard.jsx
import React from 'react';
import { MapPin, Star, Clock, DollarSign, Award, Users, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const DoctorCard = ({ doctor, onBookAppointment }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAvailability = () => {
    if (!doctor.availableDays || doctor.availableDays.length === 0) return 'Not Available';
    return doctor.availableDays.length >= 5 ? 'Available Today' : 'Limited Availability';
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 hover:shadow-hard transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Doctor Info */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">
                  {getInitials(doctor.user?.name || 'DR')}
                </span>
              </div>
              {doctor.isVerified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <Award size={14} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {doctor.user?.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mt-1">
                    {doctor.specialization}
                  </p>
                </div>
                
                <div className="mt-3 lg:mt-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    calculateAvailability() === 'Available Today' 
                      ? 'bg-green-100 text-green-800' 
                      : calculateAvailability() === 'Limited Availability'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculateAvailability()}
                  </span>
                </div>
              </div>

              {/* Doctor Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Experience</div>
                    <div className="font-semibold text-neutral-900">
                      {doctor.experienceYears} yrs
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star size={16} className="text-yellow-600 fill-current" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Rating</div>
                    <div className="font-semibold text-neutral-900">
                      {doctor.rating || '4.5'} ({doctor.totalReviews || '120'})
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Patients</div>
                    <div className="font-semibold text-neutral-900">
                      {doctor.patientCount || '2.5k+'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Fee</div>
                    <div className="font-semibold text-neutral-900">
                      ₹{doctor.consultationFee}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Bio */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">Clinic Address</div>
                    <div className="text-sm text-neutral-600">
                      {doctor.clinicName}, {doctor.address?.city}, {doctor.address?.state}
                    </div>
                  </div>
                </div>

                {doctor.bio && (
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-700 line-clamp-2">
                      {doctor.bio}
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Days */}
              <div className="mt-6">
                <div className="text-sm font-medium text-neutral-900 mb-2">Available Days</div>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableDays?.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium capitalize"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="lg:w-64 flex flex-col space-y-3">
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar size={18} className="text-primary-600" />
                <div className="font-medium text-primary-900">Next Available</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">
                Tomorrow
              </div>
              <div className="text-sm text-neutral-600 mt-1">
                10:00 AM - 12:00 PM
              </div>
            </div>
            
            {user?.role === 'patient' && (
              <div className="space-y-2">
                <Button
                  onClick={() => onBookAppointment(doctor)}
                  variant="primary"
                  size="lg"
                  className="w-full shadow-md hover:shadow-lg"
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  View Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Verified Badge */}
      {doctor.isVerified && (
        <div className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <Award size={16} />
              <span className="text-sm font-medium">Verified Medical Professional</span>
            </div>
            <div className="text-white/90 text-sm">
              License #: {doctor.licenseNumber || 'MED-12345'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};