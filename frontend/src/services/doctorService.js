import api from './api';

export const doctorService = {
    getDoctors: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/doctors?${params}`);
        return response.data;
    },

    getDoctorById: async (id) => {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/doctors/me/profile', profileData);
        return response.data;
    },

    getAppointments: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/doctors/me/appointments?${params}`);
    return response.data;
  },


    approveAppointment: async (appointmentId) => {
        const response = await api.patch(`/appointments/${appointmentId}/approve`);
        return response.data;
    },

    rejectAppointment: async (appointmentId, reason) => {
        const response = await api.patch(`/appointments/${appointmentId}/reject`, { reason });
        return response.data;
    },

    completeAppointment: async (appointmentId, data) => {
        const response = await api.patch(`/appointments/${appointmentId}/complete`, data);
        return response.data;
    },
};