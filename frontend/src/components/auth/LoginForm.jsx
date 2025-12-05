// components/auth/LoginForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { 
  Heart,
  Shield,
  Stethoscope,
  Activity,
  Eye,
  EyeOff 
} from 'lucide-react';

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block animate-slide-down">
          <div className="bg-white rounded-3xl p-10 shadow-hard border border-neutral-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-primary-500 rounded-2xl shadow-glow">
                <Heart className="h-12 w-12 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 font-display">
                  Medi<span className="text-primary-600">Care</span>+
                </h1>
                <p className="text-neutral-600 mt-2">Your Health, Our Priority</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Secure & Private</h3>
                  <p className="text-neutral-600 text-sm">End-to-end encrypted for your privacy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-secondary-100 rounded-xl">
                  <Stethoscope className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Expert Doctors</h3>
                  <p className="text-neutral-600 text-sm">Verified healthcare professionals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent-100 rounded-xl">
                  <Activity className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Instant Booking</h3>
                  <p className="text-neutral-600 text-sm">Book appointments in minutes</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl">
              <h3 className="text-white font-bold text-lg mb-2">Join Our Community</h3>
              <p className="text-white/90 text-sm">
                50,000+ patients trust us for their healthcare needs
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-slide-up">
          <div className="bg-white rounded-3xl p-8 shadow-hard border border-neutral-100">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-primary-500 rounded-2xl shadow-glow mb-6">
                <Heart className="h-10 w-10 text-white" fill="white" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 font-display">
                Welcome Back
              </h2>
              <p className="text-neutral-600 mt-2">
                Sign in to access your healthcare dashboard
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full px-4 py-3 pl-12 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 animate-pulse">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 animate-pulse">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-4 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                variant="primary"
                size="lg"
              >
                Sign in to Dashboard
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">New to MediCare+?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-primary-200 text-primary-600 rounded-xl font-medium hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                >
                  Create your healthcare account
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-neutral-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline">Terms</a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};