// components/auth/SignupForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { 
  UserPlus, 
  Stethoscope, 
  User, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  MapPin,
  DollarSign
} from 'lucide-react';

export const SignupForm = () => {
  const { signup, loading } = useAuth();
  const [role, setRole] = useState('patient');
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userData = {
        ...data,
        role,
        ...(role === 'doctor' && {
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
        }),
      };

      if (role === 'doctor') {
        delete userData.specialization;
        delete userData.experienceYears;
        delete userData.qualification;
        delete userData.clinicName;
        delete userData.consultationFee;
        delete userData.city;
        delete userData.state;
        delete userData.pincode;
      }

      await signup(userData);
    } catch (error) {
      // Error handled in context
    }
  };

  const password = watch('password');

  const steps = [
    { number: 1, title: 'Account Type' },
    { number: 2, title: 'Basic Info' },
    { number: 3, title: role === 'doctor' ? 'Professional Info' : 'Health Info' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-6xl">
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-3
                  ${step >= s.number 
                    ? 'bg-primary-600 text-white shadow-glow' 
                    : 'bg-white text-neutral-400 border-2 border-neutral-200'
                  }
                `}>
                  {step > s.number ? (
                    <CheckCircle size={24} />
                  ) : (
                    <span className="font-bold">{s.number}</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  step >= s.number ? 'text-primary-600' : 'text-neutral-400'
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className={`
                  w-4 h-4 rounded-full border-2 ${step > s.number 
                    ? 'bg-primary-600 border-primary-600' 
                    : step === s.number
                    ? 'bg-white border-primary-600'
                    : 'bg-white border-neutral-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-hard overflow-hidden border border-neutral-100">
          <div className="md:grid md:grid-cols-2">
            {/* Left Side - Info */}
            <div className="hidden md:block bg-gradient-to-br from-primary-500 to-secondary-500 p-10">
              <div className="h-full flex flex-col justify-center">
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-white font-display mb-4">
                    Join Our Healthcare Community
                  </h1>
                  <p className="text-white/90">
                    Register today to access quality healthcare services from trusted professionals.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Secure Registration</h3>
                      <p className="text-white/80 text-sm">Your data is encrypted and protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Verified Doctors</h3>
                      <p className="text-white/80 text-sm">All healthcare providers are validated</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xs">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Personalized Care</h3>
                      <p className="text-white/80 text-sm">Tailored healthcare experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-primary-600 rounded-2xl shadow-glow mb-6">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 font-display">
                  Create Your Account
                </h2>
                <p className="text-neutral-600 mt-2">
                  Choose your role and fill in the details
                </p>
              </div>

              {/* Role Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {['patient', 'doctor'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setStep(2);
                        }}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-200
                          ${role === r
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-400 hover:bg-neutral-50'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center">
                          <div className={`p-3 rounded-lg mb-3 ${
                            role === r ? 'bg-primary-600' : 'bg-neutral-100'
                          }`}>
                            {r === 'patient' ? (
                              <User className="h-6 w-6 text-white" />
                            ) : (
                              <Stethoscope className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <h3 className="font-semibold text-neutral-900 capitalize mb-1">
                            {r}
                          </h3>
                          <p className="text-sm text-neutral-500 text-center">
                            {r === 'patient' 
                              ? 'Book appointments and manage health records'
                              : 'Manage appointments and patient consultations'
                            }
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-neutral-500 text-sm">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              {step === 2 && (
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Age
                      </label>
                      <input
                        {...register('age', { min: 0, max: 120 })}
                        type="number"
                        placeholder="30"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Gender
                    </label>
                    <select
                      {...register('gender')}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="flex justify-between space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setStep(3)}
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              )}

              {/* Professional/Password Info */}
              {step === 3 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {role === 'doctor' && (
                    <>
                      <div className="p-4 bg-primary-50 rounded-xl border border-primary-200 mb-4">
                        <h3 className="font-semibold text-primary-900 flex items-center mb-2">
                          <Stethoscope className="mr-2" size={20} />
                          Professional Information
                        </h3>
                        <p className="text-sm text-primary-700">
                          This information helps patients find and trust your expertise.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                            <GraduationCap size={16} className="mr-1" />
                            Specialization *
                          </label>
                          <input
                            {...register('specialization', { required: role === 'doctor' })}
                            type="text"
                            placeholder="Cardiology"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Years of Experience *
                          </label>
                          <input
                            {...register('experienceYears', { required: role === 'doctor' })}
                            type="number"
                            placeholder="5"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Qualification *
                          </label>
                          <input
                            {...register('qualification', { required: role === 'doctor' })}
                            type="text"
                            placeholder="MD, MBBS"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                            <Building size={16} className="mr-1" />
                            Clinic Name *
                          </label>
                          <input
                            {...register('clinicName', { required: role === 'doctor' })}
                            type="text"
                            placeholder="City General Hospital"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                            <DollarSign size={16} className="mr-1" />
                            Consultation Fee *
                          </label>
                          <input
                            {...register('consultationFee', { required: role === 'doctor' })}
                            type="number"
                            placeholder="500"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                            <MapPin size={16} className="mr-1" />
                            City *
                          </label>
                          <input
                            {...register('city', { required: role === 'doctor' })}
                            type="text"
                            placeholder="New York"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            State *
                          </label>
                          <input
                            {...register('state', { required: role === 'doctor' })}
                            type="text"
                            placeholder="NY"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Pincode *
                          </label>
                          <input
                            {...register('pincode', { required: role === 'doctor' })}
                            type="text"
                            placeholder="10001"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password *
                    </label>
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type="password"
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-neutral-500">
                      Must be at least 6 characters with uppercase, lowercase, and numbers
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match',
                      })}
                      type="password"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms and conditions' })}
                      className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-neutral-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex justify-between space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex-1"
                      size="lg"
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};