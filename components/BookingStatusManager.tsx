
import React from 'react';
import { Booking, BookingStatus } from '../types';
import { Check, X, CheckCircle, RotateCcw } from 'lucide-react';

interface BookingStatusManagerProps {
  booking: Booking;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
}

export const BookingStatusManager: React.FC<BookingStatusManagerProps> = ({ booking, onUpdateStatus }) => {
  // We only hide actions for COMPLETED bookings as they are the final state.
  // CANCELLED bookings can now be RESTORED.
  if (booking.status === BookingStatus.COMPLETED) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {booking.status === BookingStatus.PENDING && (
        <button
          onClick={() => onUpdateStatus(booking.id, BookingStatus.CONFIRMED)}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all shadow-sm"
          title="Confirm Booking"
        >
          <Check size={16} />
        </button>
      )}
      
      {booking.status === BookingStatus.CONFIRMED && (
        <button
          onClick={() => onUpdateStatus(booking.id, BookingStatus.COMPLETED)}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all shadow-sm"
          title="Mark as Completed"
        >
          <CheckCircle size={16} />
        </button>
      )}

      {booking.status === BookingStatus.CANCELLED ? (
        <button
          onClick={() => onUpdateStatus(booking.id, BookingStatus.PENDING)}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all shadow-sm flex items-center gap-2 group"
          title="Restore Booking"
        >
          <RotateCcw size={16} className="group-hover:-rotate-45 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest pr-1">Restore</span>
        </button>
      ) : (
        <button
          onClick={() => onUpdateStatus(booking.id, BookingStatus.CANCELLED)}
          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all shadow-sm"
          title="Cancel Booking"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
