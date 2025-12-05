// pages/doctor/DoctorProfile.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Award,
  Calendar,
  Star,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';

export const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const { user, updateUser } = useAuth();

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();

  const timeSlots = watch('timeSlots') || [];

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await doctorService.getDoctors();
      const doctors = response.data;
      const doctorProfile = doctors.find(d => d.user?._id === user?._id);
      setDoctor(doctorProfile);
      
      if (doctorProfile) {
        reset({
          specialization: doctorProfile.specialization,
          experienceYears: doctorProfile.experienceYears,
          qualification: doctorProfile.qualification?.[0] || '',
          clinicName: doctorProfile.clinicName,
          consultationFee: doctorProfile.consultationFee,
          city: doctorProfile.address?.city || '',
          state: doctorProfile.address?.state || '',
          pincode: doctorProfile.address?.pincode || '',
          bio: doctorProfile.bio || '',
          availableDays: doctorProfile.availableDays || [],
          timeSlots: doctorProfile.timeSlots || [{ start: '09:00', end: '17:00' }],
        });
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    const currentTimeSlots = timeSlots;
    setValue('timeSlots', [...currentTimeSlots, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeSlot = (index) => {
    const currentTimeSlots = timeSlots;
    const updatedTimeSlots = currentTimeSlots.filter((_, i) => i !== index);
    setValue('timeSlots', updatedTimeSlots);
  };

  const updateTimeSlot = (index, field, value) => {
    const currentTimeSlots = timeSlots;
    const updatedTimeSlots = currentTimeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setValue('timeSlots', updatedTimeSlots);
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      const profileData = {
        specialization: data.specialization,
        experienceYears: parseInt(data.experienceYears),
        qualification: [data.qualification],
        clinicName: data.clinicName,
        consultationFee: parseFloat(data.consultationFee),
        address: {
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        bio: data.bio,
        availableDays: data.availableDays,
        timeSlots: data.timeSlots,
      };

      await doctorService.updateProfile(profileData);
      toast.success('Profile updated successfully');
      fetchDoctorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xs border-2 border-white/30">
                <User size={40} className="text-white" />
              </div>
              {doctor?.isVerified && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <Award size={18} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Dr. {user?.name}</h1>
              <p className="text-white/90 mt-2">{doctor?.specialization}</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-300 fill-current" />
                  <span>4.8/5.0</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase size={16} />
                  <span>{doctor?.experienceYears || 0} years experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{doctor?.address?.city || 'City'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0">
            <Button
              variant="outline"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white"
              icon={Edit2}
              iconPosition="left"
            >
              Edit Profile Picture
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                <User className="mr-2 text-primary-600" size={24} />
                Professional Information
              </h2>
              <div className="text-sm text-primary-600 font-medium">
                Last updated: Today
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <Briefcase className="mr-2 text-primary-600" size={20} />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Specialization *
                    </label>
                    <input
                      {...register('specialization', { required: 'Specialization is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Cardiology"
                    />
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-500">{errors.specialization.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      {...register('experienceYears', { 
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience cannot be negative' }
                      })}
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="5"
                    />
                    {errors.experienceYears && (
                      <p className="mt-1 text-sm text-red-500">{errors.experienceYears.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Qualification *
                    </label>
                    <input
                      {...register('qualification', { required: 'Qualification is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="MD, MBBS"
                    />
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-500">{errors.qualification.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Clinic Name *
                    </label>
                    <input
                      {...register('clinicName', { required: 'Clinic name is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City General Hospital"
                    />
                    {errors.clinicName && (
                      <p className="mt-1 text-sm text-red-500">{errors.clinicName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <MapPin className="mr-2 text-primary-600" size={20} />
                  Clinic Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State *
                    </label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      {...register('pincode', { required: 'Pincode is required' })}
                      type="text"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10001"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Fees & Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                  <DollarSign className="mr-2 text-primary-600" size={20} />
                  Practice Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Consultation Fee (₹) *
                    </label>
                    <input
                      {...register('consultationFee', { 
                        required: 'Consultation fee is required',
                        min: { value: 0, message: 'Fee cannot be negative' }
                      })}
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="500"
                    />
                    {errors.consultationFee && (
                      <p className="mt-1 text-sm text-red-500">{errors.consultationFee.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Available Days *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <label 
                          key={day.id} 
                          className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={day.id}
                            {...register('availableDays', { required: 'Select at least one day' })}
                            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-neutral-700 capitalize">{day.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.availableDays && (
                      <p className="mt-1 text-sm text-red-500">{errors.availableDays.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                    <Clock className="mr-2 text-primary-600" size={20} />
                    Working Hours
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTimeSlot}
                    icon={Plus}
                    iconPosition="left"
                  >
                    Add Time Slot
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Start Time
                          </label>
                          <select
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            End Time
                          </label>
                          <select
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {timeSlots.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="mt-6 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {timeSlots.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-neutral-300 rounded-xl">
                    <Clock className="mx-auto text-neutral-300 mb-2" size={24} />
                    <p className="text-neutral-500">No time slots added</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      Add your working hours for patient appointments
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-900">
                  Professional Bio
                </h3>
                <textarea
                  {...register('bio')}
                  rows={4}
                  placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-neutral-500">
                  This bio will be visible to patients on your profile
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-200">
                <Button
                  type="submit"
                  loading={updating}
                  variant="primary"
                  size="lg"
                  icon={Save}
                  iconPosition="left"
                  className="shadow-md hover:shadow-lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Profile Stats */}
        <div className="space-y-6">
          {/* Profile Stats Card */}
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">
              Profile Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">Profile Completion</div>
                    <div className="text-2xl font-bold text-neutral-900">95%</div>
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="3"
                      strokeDasharray="95, 100"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Profile Views', value: '1,245', change: '+12%' },
                  { label: 'Patient Reviews', value: '128', change: '+8%' },
                  { label: 'Appointment Rate', value: '94%', change: '+5%' },
                  { label: 'Response Time', value: '15min', change: '-2%' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-700">{stat.label}</div>
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold text-neutral-900">{stat.value}</div>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                        stat.change.startsWith('+') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Verification Status
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'Medical License', status: 'verified', icon: Award },
                { label: 'Identity Proof', status: 'verified', icon: User },
                { label: 'Address Proof', status: 'pending', icon: MapPin },
                { label: 'Qualifications', status: 'verified', icon: Briefcase },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        item.status === 'verified' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm text-blue-800">{item.label}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {doctor?.isVerified ? (
              <div className="mt-6 p-3 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Your profile is fully verified</span>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                className="w-full mt-6"
                size="sm"
              >
                Complete Verification
              </Button>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Links
            </h3>
            
            <div className="space-y-2">
              {[
                { label: 'View Public Profile', icon: User },
                { label: 'Schedule Settings', icon: Calendar },
                { label: 'Billing & Payments', icon: DollarSign },
                { label: 'Patient Reviews', icon: Star },
              ].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-primary-100 transition-colors">
                    <link.icon size={16} className="text-neutral-600 group-hover:text-primary-600" />
                  </div>
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
                    {link.label}
                  </span>
                  <div className="ml-auto text-neutral-400 group-hover:text-primary-600">
                    →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};