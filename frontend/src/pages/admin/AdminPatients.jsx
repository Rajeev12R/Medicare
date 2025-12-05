import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar, Filter, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';

export const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    isActive: '',
    search: '',
  });

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPatients(filters);
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-neutral-600">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">Manage Patients</h1>
          <p className="text-neutral-600 mt-2">View and manage patient accounts</p>
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
              <Search size={14} className="mr-1" />
              Search Patients
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
              onClick={() => setFilters({ isActive: '', search: '' })}
              className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-soft border border-neutral-200">
            <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-2xl mb-4">
              <User size={24} className="text-neutral-400" />
            </div>
            <p className="text-neutral-600 text-lg">No patients found</p>
            <p className="text-neutral-500 mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-glow">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{patient.name}</h3>
                  <p className="text-neutral-600 text-sm">{patient.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-neutral-700">
                  <Phone size={16} className="text-neutral-400" />
                  <span>{patient.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-700">
                  <Mail size={16} className="text-neutral-400" />
                  <span>{patient.email}</span>
                </div>
                {patient.age && (
                  <div className="text-neutral-700">
                    Age: {patient.age}
                  </div>
                )}
                {patient.gender && (
                  <div className="text-neutral-700 capitalize">
                    Gender: {patient.gender}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                  patient.isActive 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {patient.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};