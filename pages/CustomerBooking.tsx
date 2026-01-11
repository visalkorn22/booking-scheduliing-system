
import React, { useState, useMemo } from 'react';
import { MOCK_STAFF } from '../constants';
import { Service, Staff, BookingStatus, PaymentStatus, PaymentMethod, RecurrencePattern, Booking, User as UserType, Location } from '../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  RefreshCcw, 
  MapPin,
  Building,
  CalendarDays,
  AlertTriangle,
  CreditCard,
  Wallet,
  Store,
  Printer,
  Download,
  CheckCircle,
  QrCode,
  Scan,
  Maximize,
  Image as ImageIcon
} from 'lucide-react';
import { formatInTimezone } from '../utils/dateUtils';
import { useLanguage } from '../contexts/LanguageContext';

const Receipt = ({ booking, service, location, staff }: { booking: Booking, service: Service, location: Location, staff: Staff }) => {
  const { t } = useLanguage();
  
  // Generate a unique data string for the QR code
  const qrData = encodeURIComponent(JSON.stringify({
    id: booking.id,
    loc: location.name,
    svc: service.name,
    time: booking.startTime,
    cust: booking.customerId
  }));
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&bgcolor=ffffff&color=0f172a&margin=10`;

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-slate-900 text-white p-8 text-center relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={60} />
        </div>
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl mx-auto mb-4 border-2 border-slate-800">D</div>
        <h2 className="text-xl font-black uppercase tracking-[0.2em]">Transaction Receipt</h2>
        <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Authorized Official Protocol</p>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt Number</p>
            <p className="font-mono text-sm font-bold text-slate-900">#DB-{booking.id.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
            <p className="text-sm font-bold text-slate-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* QR Verification Section */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500/20 animate-[scan_2s_ease-in-out_infinite]" />
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-500">
            <img 
              src={qrUrl} 
              alt="Verification QR" 
              className="w-32 h-32"
            />
          </div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
            <Scan size={12} /> Scan to Verify Session
          </p>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scan {
              0% { top: 0; opacity: 0; }
              50% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-xs font-bold text-slate-500">Institutional Branch</span>
            <span className="text-xs font-black text-slate-900">{location.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-bold text-slate-500">Professional Lead</span>
            <span className="text-xs font-black text-slate-900">{staff.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-bold text-slate-500">Service Protocol</span>
            <span className="text-xs font-black text-indigo-600">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-bold text-slate-500">Timing Slot</span>
            <span className="text-xs font-black text-slate-900">
              {new Date(booking.startTime).toLocaleDateString()} @ {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="py-6 px-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Rate</span>
            <span className="text-sm font-bold text-slate-700">${service.price}</span>
          </div>
          <div className="h-px bg-slate-200 mb-4" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total Settlement</span>
            <span className="text-2xl font-black text-indigo-600">${service.price}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 flex-1">
            <CheckCircle size={12} /> Paid via {booking.paymentMethod}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 flex gap-3">
        <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
          <Printer size={14} /> Print
        </button>
        <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
          <Download size={14} /> Download
        </button>
      </div>
      
      <div className="p-4 text-center">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">DataBook Secure Transaction v4.2</p>
      </div>
    </div>
  );
};

interface BookingWizardProps {
  customer: UserType;
  onBookingComplete: (booking: Booking) => void;
  existingBookings: Booking[];
  services: Service[];
  locations: Location[];
}

const BookingWizard: React.FC<BookingWizardProps> = ({ customer, onBookingComplete, existingBookings, services, locations }) => {
  const [step, setStep] = useState(0); 
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.ABA_PAY);
  const [recurrence, setRecurrence] = useState<RecurrencePattern>(RecurrencePattern.NONE);
  const [notes, setNotes] = useState('');
  const [finalBooking, setFinalBooking] = useState<Booking | null>(null);
  const { t } = useLanguage();

  const handleLocationSelect = (loc: Location) => {
    setSelectedLocation(loc);
    setStep(1);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setStep(3);
  };

  const handleBookingComplete = () => {
    const start = `${selectedDate}T${selectedTime}:00Z`;
    const end = new Date(new Date(start).getTime() + (selectedService?.durationMinutes || 60) * 60000).toISOString();

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      locationId: selectedLocation?.id || '',
      serviceId: selectedService?.id || '',
      staffId: selectedStaff?.id || '',
      customerId: customer.id,
      startTime: start,
      endTime: end, 
      status: BookingStatus.CONFIRMED,
      paymentStatus: selectedPaymentMethod === PaymentMethod.PAY_LATER ? PaymentStatus.UNPAID : PaymentStatus.PAID,
      paymentMethod: selectedPaymentMethod,
      totalPrice: selectedService?.price || 0,
      paidAmount: selectedPaymentMethod === PaymentMethod.PAY_LATER ? 0 : (selectedService?.price || 0),
      notes,
      recurrencePattern: recurrence,
      createdAt: new Date().toISOString()
    };
    setFinalBooking(newBooking);
    onBookingComplete(newBooking);
    setStep(7);
  };

  const filteredServices = services.filter(s => s.locationIds.includes(selectedLocation?.id || ''));
  const filteredStaff = MOCK_STAFF.filter(s => 
    s.locationIds.includes(selectedLocation?.id || '') && 
    s.assignedServices.includes(selectedService?.id || '')
  );

  return (
    <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-50 px-10 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-500 ${step >= i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
                {step > i ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < 6 && <div className={`w-8 md:w-12 h-0.5 mx-1 md:mx-2 transition-all duration-500 ${step > i ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-10">
        {step === 0 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select Preferred Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => handleLocationSelect(loc)}
                  className="p-8 text-left rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-indigo-600 border border-slate-100 group-hover:scale-110 transition-transform">
                    <Building size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{loc.name}</h4>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{loc.address}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <MapPin size={14} /> View Map
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(0)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Services at {selectedLocation?.name}</h3>
                <p className="text-sm text-slate-500">Precision protocols authorized for this branch.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="p-0 text-left rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group overflow-hidden flex flex-col"
                >
                  <div className="h-40 relative shrink-0">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600 border border-white/50">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-slate-900">{service.name}</h4>
                      <span className="text-2xl font-black text-indigo-600">${service.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Clock size={16} className="text-indigo-600" /> {service.durationMinutes}m duration</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(1)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select Your Specialist</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredStaff.map(staff => (
                <button
                  key={staff.id}
                  onClick={() => handleStaffSelect(staff)}
                  className="p-8 text-center rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-50 rounded-[2rem] flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:scale-110 transition-transform">
                    <User size={48} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">{staff.fullName}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Verified Professional</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
             <div className="flex items-center gap-4">
              <button onClick={() => setStep(2)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Synchronize Schedule</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Date Selection</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-slate-50 border-0 font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                {selectedDate && (
                  <div className="animate-in fade-in slide-in-from-top-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Available Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedTime === t ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 flex flex-col justify-end">
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(4)}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-20"
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(3)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verify Specification</h3>
            </div>
            
            <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                  <p className="font-bold text-slate-900">{selectedLocation?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Timing</p>
                  <p className="font-bold text-slate-900">{selectedDate} @ {selectedTime}</p>
                </div>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service</p>
                  <p className="font-bold text-slate-900">{selectedService?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expert</p>
                  <p className="font-bold text-slate-900">{selectedStaff?.fullName}</p>
                </div>
              </div>

              <textarea 
                rows={3}
                placeholder="Internal notes or requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-6 rounded-[2rem] bg-white border-0 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700"
              />
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200"
            >
              Choose Payment Method
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(4)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Settlement Authorization</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: PaymentMethod.ABA_PAY, label: 'ABA PAYWAY', icon: Wallet, desc: 'Instant local bank settlement' },
                { id: PaymentMethod.STRIPE, label: 'STRIPE GLOBAL', icon: CreditCard, desc: 'Visa, Mastercard & AMEX' },
                { id: PaymentMethod.CREDIT_CARD, label: 'CREDIT CARD', icon: CreditCard, desc: 'Direct processing gateway' },
                { id: PaymentMethod.PAY_LATER, label: 'PAY AT COUNTER', icon: Store, desc: 'Settlement upon arrival' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all ${selectedPaymentMethod === method.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className={`p-3 rounded-xl mb-4 w-fit ${selectedPaymentMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <method.icon size={20} />
                  </div>
                  <p className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-1">{method.label}</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{method.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(6)}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200"
            >
              Authorize {selectedPaymentMethod}
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 text-center py-20 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-200">
              <Sparkles size={48} />
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Synchronizing Ledger</h3>
            <p className="text-slate-400 font-bold">Processing {selectedPaymentMethod} for {selectedLocation?.name}...</p>
            <button 
              onClick={handleBookingComplete}
              className="mt-12 px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all"
            >
              Confirm Transaction Finality
            </button>
          </div>
        )}

        {step === 7 && finalBooking && selectedLocation && selectedService && selectedStaff && (
          <div className="py-10 animate-in zoom-in duration-500 space-y-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white ring-8 ring-emerald-50">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Protocol Locked</h3>
              <p className="text-slate-500 font-medium">Session verified and synced with {selectedLocation.name}.</p>
            </div>
            
            <Receipt booking={finalBooking} location={selectedLocation} service={selectedService} staff={selectedStaff} />
            
            <div className="flex justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all"
              >
                Return to Control Center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;