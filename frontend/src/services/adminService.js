import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getDoctors: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/admin/doctors?${params}`);
    return response.data;
  },

  getPatients: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/admin/patients?${params}`);
    return response.data;
  },

  getAppointments: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/admin/appointments?${params}`);
    return response.data;
  },

  createDoctor: async (doctorData) => {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/admin/doctors/${id}`, doctorData);
    return response.data;
  },

  verifyDoctor: async (id) => {
    const response = await api.patch(`/admin/doctors/${id}/verify`);
    return response.data;
  },
};