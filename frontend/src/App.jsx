// App.jsx - Updated with consistent styling
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { DoctorList } from './pages/patient/DoctorList';
import { PatientAppointments } from './pages/patient/PatientAppointments';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';
import { DoctorProfile } from './pages/doctor/DoctorProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminPatients } from './pages/admin/AdminPatients';
import { AdminAppointments } from './pages/admin/AdminAppointments';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} />;
  }

  return children;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="bg-white rounded-2xl shadow-soft p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Patient Routes */}
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/doctors" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/appointments" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointments />
            </ProtectedRoute>
          } 
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/appointments" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorAppointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/profile" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorProfile />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/doctors" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctors />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/patients" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPatients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/appointments" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAppointments />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect based on role */}
        <Route 
          path="*" 
          element={<Navigate to={`/${user.role}`} />} 
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative">
          {/* Background Elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-30"></div>
          </div>
          
          <AppRoutes />
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: '#333',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#4caf50',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;