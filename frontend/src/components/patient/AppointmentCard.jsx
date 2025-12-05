// components/patient/AppointmentCard.jsx
import React from 'react';
import { Calendar, Clock, User, MapPin, Star, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../common/Button';

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
  },
  approved: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600',
  },
  cancelled: {
    color: 'bg-neutral-100 text-neutral-800',
    icon: XCircle,
    iconColor: 'text-neutral-600',
  },
  completed: {
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    iconColor: 'text-blue-600',
  },
};

export const AppointmentCard = ({ appointment, onCancel, userRole }) => {
  const isPatient = userRole === 'patient';
  const targetUser = isPatient ? appointment.doctor : appointment.patient;
  const status = statusConfig[appointment.status];
  const StatusIcon = status?.icon;

  const canCancel = ['pending', 'approved'].includes(appointment.status) && 
    (isPatient || userRole === 'doctor');

  const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Doctor/Patient Info */}
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                <User size={24} className="text-white" />
              </div>
              {appointment.status === 'approved' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {isPatient ? 'Dr. ' : ''}{targetUser?.user?.name || targetUser?.name}
                  </h3>
                  {isPatient && appointment.doctor?.specialization && (
                    <p className="text-primary-600 font-medium mt-1">
                      {appointment.doctor.specialization}
                    </p>
                  )}
                </div>
                
                <div className="mt-2 lg:mt-0 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {StatusIcon && <StatusIcon size={12} className={`mr-1 ${status.iconColor}`} />}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  {isPatient && appointment.doctor?.rating && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      <Star size={10} className="mr-1 fill-current" />
                      {appointment.doctor.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Calendar size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Date</div>
                    <div>{getFormattedDate(appointment.date)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Clock size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Time</div>
                    <div>{appointment.slot}</div>
                  </div>
                </div>

                {isPatient && appointment.doctor?.address?.city && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                      <MapPin size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">Location</div>
                      <div>{appointment.doctor.address.city}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-3">
                {appointment.reason && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText size={16} className="text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-900">Reason for Visit</div>
                        <div className="text-sm text-blue-700 mt-1">{appointment.reason}</div>
                      </div>
                    </div>
                  </div>
                )}

                {appointment.notes && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText size={16} className="text-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-green-900">Doctor's Notes</div>
                        <div className="text-sm text-green-700 mt-1">{appointment.notes}</div>
                      </div>
                    </div>
                  </div>
                )}

                {appointment.prescription && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText size={16} className="text-purple-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-purple-900">Prescription</div>
                        <div className="text-sm text-purple-700 mt-1">{appointment.prescription}</div>
                      </div>
                    </div>
                  </div>
                )}

                {appointment.cancellationReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle size={16} className="text-red-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-red-900">Cancellation Reason</div>
                        <div className="text-sm text-red-700 mt-1">{appointment.cancellationReason}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="lg:w-48 flex flex-col space-y-2">
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="w-full"
              >
                Cancel Appointment
              </Button>
            )}
            
            {appointment.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                View Prescription
              </Button>
            )}
            
            {appointment.status === 'approved' && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Join Consultation
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center space-x-4">
            <span>Appointment ID: #{appointment._id.slice(-8)}</span>
            <span>•</span>
            <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-primary-600 font-medium">
            {isPatient && appointment.doctor?.consultationFee && (
              <>Fee: ₹{appointment.doctor.consultationFee}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};