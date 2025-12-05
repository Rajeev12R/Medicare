import api from './api';

export const patientService = {
  updateProfile: async (profileData) => {
    const response = await api.put('/patient/me', profileData);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getAppointments: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/appointments?${params}`);
    return response.data;
  },

  cancelAppointment: async (appointmentId, reason) => {
    const response = await api.patch(`/appointments/${appointmentId}/cancel`, { reason });
    return response.data;
  },
};