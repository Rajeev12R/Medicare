import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Edit, Plus, Download, Mail, Phone, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    isVerified: '',
    isActive: '',
    specialization: '',
    search: '',
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDoctors(filters);
      setDoctors(response.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await adminService.verifyDoctor(doctorId);
      toast.success('Doctor verified successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const onSubmitCreateDoctor = async (data) => {
    try {
      const doctorData = {
        userData: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        },
        doctorProfile: {
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
        },
      };

      await adminService.createDoctor(doctorData);
      toast.success('Doctor created successfully');
      setShowCreateModal(false);
      reset();
      fetchDoctors();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create doctor';
      toast.error(message);
    }
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
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Manage Doctors</h1>
          <p className="text-neutral-600 mt-2">View and manage registered healthcare professionals</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button
            variant="outline"
            icon={Download}
            iconPosition="left"
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Export
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={Plus}
            iconPosition="left"
          >
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Search size={14} className="mr-1" />
              Specialization
            </label>
            <input
              type="text"
              placeholder="Filter by specialization"
              value={filters.specialization}
              onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Verification Status
            </label>
            <select
              value={filters.isVerified}
              onChange={(e) => setFilters(prev => ({ ...prev, isVerified: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Active Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ isVerified: '', isActive: '', specialization: '', search: '' })}
              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        {doctor.user?.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {doctor.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {doctor.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {doctor.experienceYears} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {doctor.isVerified ? (
                        <CheckCircle className="text-green-600" size={16} />
                      ) : (
                        <XCircle className="text-red-600" size={16} />
                      )}
                      <span className={`text-sm ${
                        doctor.isVerified ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {doctor.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!doctor.isVerified && (
                        <Button
                          size="sm"
                          onClick={() => handleVerifyDoctor(doctor._id)}
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Verify
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(doctor)}
                        className="border-primary-600 text-primary-600 hover:bg-primary-50"
                      >
                        <Edit size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-2xl mb-4">
              <Search size={24} className="text-neutral-400" />
            </div>
            <p className="text-neutral-600 text-lg">No doctors found</p>
            <p className="text-neutral-500 mt-1">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Create Doctor Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          reset();
        }}
        title="Add New Doctor"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmitCreateDoctor)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email *
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password *
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Experience (Years) *
              </label>
              <input
                {...register('experienceYears', { required: 'Experience is required' })}
                type="number"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Consultation Fee *
              </label>
              <input
                {...register('consultationFee', { required: 'Fee is required' })}
                type="number"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Doctor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Doctor Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Doctor Details"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">
                    {selectedDoctor.user?.name?.charAt(0)}
                  </span>
                </div>
                {selectedDoctor.isVerified && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-900">
                  Dr. {selectedDoctor.user?.name}
                </h3>
                <p className="text-primary-600 font-semibold mt-1">
                  {selectedDoctor.specialization}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm border border-green-200">
                    <CheckCircle size={12} className="mr-1" />
                    {selectedDoctor.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
                    {selectedDoctor.experienceYears} years experience
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Contact Information</h4>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-neutral-400" />
                      <div>
                        <div className="text-xs text-neutral-500">Email</div>
                        <div className="font-medium text-neutral-900">{selectedDoctor.user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-neutral-400" />
                      <div>
                        <div className="text-xs text-neutral-500">Phone</div>
                        <div className="font-medium text-neutral-900">{selectedDoctor.user?.phone || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Clinic Information</h4>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-neutral-500">Clinic Name</div>
                      <div className="font-medium text-neutral-900">{selectedDoctor.clinicName}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-neutral-400" />
                      <div>
                        <div className="text-xs text-neutral-500">Location</div>
                        <div className="font-medium text-neutral-900">
                          {selectedDoctor.address?.city}, {selectedDoctor.address?.state}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Professional Details</h4>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-neutral-500">Qualification</div>
                      <div className="font-medium text-neutral-900">{selectedDoctor.qualification?.[0]}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">Consultation Fee</div>
                      <div className="font-medium text-neutral-900">₹{selectedDoctor.consultationFee}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
              <h4 className="text-sm font-medium text-primary-900 mb-3">Practice Statistics</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">150</div>
                  <div className="text-xs text-primary-700">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">94%</div>
                  <div className="text-xs text-primary-700">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">15</div>
                  <div className="text-xs text-primary-700">Avg Wait Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">₹75k</div>
                  <div className="text-xs text-primary-700">Monthly Revenue</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              {!selectedDoctor.isVerified && (
                <Button
                  onClick={() => {
                    handleVerifyDoctor(selectedDoctor._id);
                    setShowDetailsModal(false);
                  }}
                  variant="primary"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Verify Doctor
                </Button>
              )}
              <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                <Edit size={16} className="mr-1" />
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};