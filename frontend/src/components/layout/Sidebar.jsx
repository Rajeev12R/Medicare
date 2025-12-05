// components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  Bell, 
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Activity,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

const patientMenu = [
  { name: 'Dashboard', href: '/patient', icon: LayoutDashboard, color: 'text-primary-600' },
  { name: 'Find Doctors', href: '/patient/doctors', icon: Stethoscope, color: 'text-secondary-600' },
  { name: 'Appointments', href: '/patient/appointments', icon: Calendar, color: 'text-accent-600' },
  { name: 'Health Records', href: '/patient/records', icon: FileText, color: 'text-green-600' },
];

const doctorMenu = [
  { name: 'Dashboard', href: '/doctor', icon: LayoutDashboard, color: 'text-primary-600' },
  { name: 'Appointments', href: '/doctor/appointments', icon: Calendar, color: 'text-accent-600' },
  { name: 'Patients', href: '/doctor/patients', icon: Users, color: 'text-secondary-600' },
  { name: 'Schedule', href: '/doctor/schedule', icon: Activity, color: 'text-green-600' },
  { name: 'Profile', href: '/doctor/profile', icon: Settings, color: 'text-purple-600' },
];

const adminMenu = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'text-primary-600' },
  { name: 'Doctors', href: '/admin/doctors', icon: Stethoscope, color: 'text-secondary-600' },
  { name: 'Patients', href: '/admin/patients', icon: Users, color: 'text-accent-600' },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar, color: 'text-green-600' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getMenu = () => {
    switch (user?.role) {
      case 'patient': return patientMenu;
      case 'doctor': return doctorMenu;
      case 'admin': return adminMenu;
      default: return [];
    }
  };

  const menu = getMenu();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg text-neutral-900">MediCare+</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary-600" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative inset-y-0 left-0 z-40
        w-64 lg:w-72
        bg-white border-r border-neutral-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col h-screen lg:h-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-600 rounded-xl shadow-glow">
              <Stethoscope className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 font-display">
                Medi<span className="text-primary-600">Care</span>+
              </h1>
              <p className="text-xs text-neutral-500">Healthcare Portal</p>
            </div>
          </div>
        </div>


        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-100' : 'bg-neutral-100 group-hover:bg-primary-50'}`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start"
            icon={LogOut}
            iconPosition="left"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};