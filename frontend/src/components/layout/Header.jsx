// components/layout/Header.jsx
import React, { useState } from 'react';
import { Bell, Search, User, Settings, HelpCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const Header = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="bg-white border-b border-neutral-200 px-4 lg:px-8 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="hidden lg:block">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="text-neutral-500">
                    Dashboard
                  </div>
                </li>
                <li>
                  <svg className="h-4 w-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <div className="font-medium text-neutral-900 capitalize">
                    {user?.role}
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, appointments, or reports..."
                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} className="text-neutral-600" /> : <Moon size={20} className="text-neutral-600" />}
            </button>
            
            <button
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
              title="Help"
            >
              <HelpCircle size={20} className="text-neutral-600" />
            </button>
            
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
              title="Notifications"
            >
              <Bell size={20} className="text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User size={18} className="text-primary-600" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                </div>
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hard border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <User size={16} />
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <div className="border-t border-neutral-200 my-1"></div>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                    <HelpCircle size={16} />
                    <span>Help & Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={48} className="text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">No notifications</p>
                <p className="text-sm text-neutral-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-xl border ${
                      notification.isRead
                        ? 'bg-neutral-50 border-neutral-200'
                        : 'bg-primary-50 border-primary-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          notification.isRead ? 'text-neutral-700' : 'text-primary-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="ml-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-neutral-400">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        notification.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : notification.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};