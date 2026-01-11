
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import { MOCK_USERS, MOCK_SERVICES, INITIAL_BOOKINGS, INITIAL_REVIEWS, MOCK_STAFF, MOCK_LOCATIONS } from './constants';
import { UserRole, Booking, BookingStatus, PaymentStatus, Review, Staff, Service, User, RecurrencePattern, Notification, Location } from './types';
import { StatCard, SectionTitle } from './components/DashboardWidgets';
// Fix: Added Image as ImageIcon to lucide-react imports
import { Calendar, DollarSign, Clock, Plus, Filter, MoreVertical, Star, Briefcase, Shield, RefreshCcw, Edit3, Trash2, Mail as MailIcon, Smartphone, MapPin, Globe, Zap, TrendingUp, Camera, Lock, Bell, CheckCircle, Save, LogOut, User as UserIcon, Users, Image as ImageIcon } from 'lucide-react';
import BookingWizard from './pages/CustomerBooking';
import { RatingStars } from './components/RatingStars';
import { BookingStatusManager } from './components/BookingStatusManager';
import { AvailabilityManager } from './components/AvailabilityManager';
import { formatInTimezone } from './utils/dateUtils';
import { SearchIntelligence } from './components/SearchIntelligence';
import { ServiceModal } from './components/ServiceManager';
import { FinancialManager } from './components/FinancialManager';
import { CalendarGrid } from './components/CalendarGrid';
import { useLanguage, Language } from './contexts/LanguageContext';
import { AuthPortal } from './components/AuthPortal';
import { AnalyticsChart } from './components/AnalyticsChart';

// Persistence Helper
const getStoredServices = () => {
  const saved = localStorage.getItem('databook_services');
  return saved ? JSON.parse(saved) : null;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('databook_auth');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('ALL');
  
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [services, setServices] = useState<Service[]>(getStoredServices() || MOCK_SERVICES);
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [customers, setCustomers] = useState<User[]>(MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER));

  // Persist services whenever they change
  useEffect(() => {
    localStorage.setItem('databook_services', JSON.stringify(services));
  }, [services]);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { language, setLanguage, t } = useLanguage();

  const displayBookings = useMemo(() => {
    if (selectedLocationId === 'ALL') return bookings;
    return bookings.filter(b => b.locationId === selectedLocationId);
  }, [bookings, selectedLocationId]);

  const login = (role: UserRole) => {
    const userTemplate = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    const user: User = { ...userTemplate, createdAt: new Date().toISOString() };
    setCurrentUser(user);
    localStorage.setItem('databook_auth', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('databook_auth');
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'INFO') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id || 'sys',
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedData };
    setCurrentUser(newUser);
    localStorage.setItem('databook_auth', JSON.stringify(newUser));
    addNotification('Profile Synchronized', 'Identity parameters updated successfully.', 'SUCCESS');
  };

  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...serviceData } as Service : s));
      addNotification('Service Updated', `${serviceData.name} has been modified.`, 'SUCCESS');
    } else {
      const newService: Service = {
        ...serviceData,
        id: Math.random().toString(36).substr(2, 9),
        isActive: true,
        locationIds: [selectedLocationId === 'ALL' ? locations[0].id : selectedLocationId],
      } as Service;
      setServices([newService, ...services]);
      addNotification('New Service Protocol', `${serviceData.name} initialized in the system.`, 'SUCCESS');
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    const serviceName = services.find(s => s.id === id)?.name;
    setServices(services.filter(s => s.id !== id));
    addNotification('Service Terminated', `${serviceName} removed from protocol roster.`, 'WARNING');
  };

  const getStatusClasses = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-amber-50 text-amber-700 border-amber-100';
      case BookingStatus.CONFIRMED: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case BookingStatus.COMPLETED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case BookingStatus.CANCELLED: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const revenueData = [
    { day: 'MON', value: 1200 },
    { day: 'TUE', value: 1900 },
    { day: 'WED', value: 1500 },
    { day: 'THU', value: 2100 },
    { day: 'FRI', value: 2400 },
    { day: 'SAT', value: 1800 },
    { day: 'SUN', value: 1300 },
  ];

  if (!currentUser) {
    return <AuthPortal onLogin={login} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">{t('operational_overview')}</p>
                <SectionTitle title={`${t('welcome')}, ${currentUser.fullName.split(' ')[0]}`} subtitle={`Managing site: ${selectedLocationId === 'ALL' ? 'Global Portfolio' : locations.find(l => l.id === selectedLocationId)?.name}`} />
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('services')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                >
                  <Plus size={16} /> {t('new_booking')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label={t('live_bookings')} value={displayBookings.length.toString()} trend="+12.5%" icon={Calendar} color="bg-indigo-600" />
              <StatCard label={t('action_required')} value={displayBookings.filter(b => b.status === BookingStatus.PENDING).length.toString()} icon={Clock} color="bg-amber-500" />
              <StatCard label={t('monthly_rev')} value={`$${displayBookings.reduce((acc, b) => acc + b.paidAmount, 0).toLocaleString()}`} trend="+8.2%" icon={DollarSign} color="bg-emerald-500" />
              <StatCard label={t('client_rating')} value="4.92" trend="+0.1" icon={Star} color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                <AnalyticsChart data={revenueData} />

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{t('priority_schedule')}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-4">Specialist / Service</th>
                          <th className="px-8 py-4">Location</th>
                          <th className="px-8 py-4">Timing</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayBookings.map(b => {
                          const service = services.find(s => s.id === b.serviceId);
                          const location = locations.find(l => l.id === b.locationId);
                          return (
                            <tr key={b.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl overflow-hidden flex items-center justify-center font-bold">
                                    {service?.imageUrl ? (
                                      <img src={service.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                      service?.name?.[0] || '?'
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{service?.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">REF: {b.id.toUpperCase()}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                                  <MapPin size={12} className="text-indigo-500" /> {location?.name}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-sm font-bold text-slate-700">{formatInTimezone(b.startTime, currentUser.timezone, { month: 'short', day: 'numeric' })}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{formatInTimezone(b.startTime, currentUser.timezone, { hour: '2-digit', minute: '2-digit' })}</p>
                              </td>
                              <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${getStatusClasses(b.status)}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                    Live Feedback 
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                  </h4>
                  <div className="space-y-6">
                    {reviews.slice(0, 2).map(r => (
                      <div key={r.id} className="space-y-3">
                        <RatingStars rating={r.rating} size={12} />
                        <p className="text-xs text-slate-600 italic leading-relaxed">"{r.comment}"</p>
                        <div className="h-px bg-slate-100"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="animate-in fade-in duration-500 space-y-10">
            {currentUser.role === UserRole.CUSTOMER ? (
              <BookingWizard 
                customer={currentUser} 
                existingBookings={bookings}
                services={services}
                locations={locations}
                onBookingComplete={(b) => {
                  setBookings([b, ...bookings]);
                  addNotification('Success', `Booking confirmed at ${locations.find(l => l.id === b.locationId)?.name}`, 'SUCCESS');
                }} 
              />
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <SectionTitle title="Inventory of Services" subtitle="Configure offerings across your physical locations." />
                  {currentUser.role === UserRole.ADMIN && (
                    <button 
                      onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                    >
                      <Plus size={16} /> New Service Protocol
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {services.map(service => (
                    <div key={service.id} className="bg-white p-0 rounded-[2.5rem] border border-slate-200 group hover:border-indigo-600/30 transition-all shadow-sm relative overflow-hidden flex flex-col">
                      <div className="h-48 relative overflow-hidden shrink-0">
                         {service.imageUrl ? (
                           <img src={service.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         ) : (
                           <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                             <ImageIcon size={48} />
                           </div>
                         )}
                         <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white/50">
                           {service.category}
                         </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-xl font-bold text-slate-900">{service.name}</h4>
                          <div className="text-right">
                            <span className="text-2xl font-black text-slate-900 block">${service.price}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">{service.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                          <span className="flex items-center gap-2"><Clock size={16} className="text-indigo-600" /> {service.durationMinutes}m duration</span>
                          <span className="flex items-center gap-2"><Users size={16} className="text-indigo-600" /> Max Cap: {service.maxCapacity}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                          {service.locationIds.map(lid => (
                            <span key={lid} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 flex items-center gap-1">
                              <MapPin size={10} /> {locations.find(l => l.id === lid)?.name}
                            </span>
                          ))}
                        </div>

                        {currentUser.role === UserRole.ADMIN && (
                          <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                            <button 
                              onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }}
                              className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                            >
                              <Edit3 size={14} /> Edit Specs
                            </button>
                            <button 
                              onClick={() => handleDeleteService(service.id)}
                              className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isServiceModalOpen && (
                  <ServiceModal 
                    service={editingService} 
                    onClose={() => setIsServiceModalOpen(false)} 
                    onSave={handleSaveService} 
                  />
                )}
              </div>
            )}
          </div>
        );
      case 'locations':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SectionTitle title="Physical Sites" subtitle="Manage your global business footprint and localized timezone settings." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map(loc => (
                <div key={loc.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><MapPin size={80} /></div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{loc.name}</h4>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{loc.address}</p>
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600"><Smartphone size={14} className="text-indigo-600" /> {loc.phone}</div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600"><Globe size={14} className="text-indigo-600" /> {loc.timezone}</div>
                  </div>
                  <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Edit Site Specs</button>
                </div>
              ))}
              <button className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all group">
                <div className="p-6 bg-slate-50 rounded-full group-hover:bg-indigo-50 mb-4 transition-all"><Plus size={32} /></div>
                <p className="font-black text-xs uppercase tracking-[0.2em]">Deploy New Branch</p>
              </button>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <SectionTitle title="Specialist Roster" subtitle="Team members assigned across your locations." />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staffList.map(staff => (
                  <div key={staff.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl">{staff.fullName[0]}</div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">{staff.fullName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {staff.locationIds.map(lid => (
                            <span key={lid} className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{locations.find(l => l.id === lid)?.name.split(' ')[0]}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</p>
                       <div className="flex flex-wrap gap-2">
                         {staff.specialties.map(spec => (
                           <span key={spec} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-100">{spec}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-10">
            <CalendarGrid bookings={displayBookings} services={services} currentUser={currentUser} />
            <AvailabilityManager bookings={displayBookings} services={services} />
          </div>
        );
      case 'profile':
        return <ProfileSettings user={currentUser} onUpdate={handleUpdateProfile} onLogout={logout} language={language} setLanguage={setLanguage} />;
      case 'payments':
        return <FinancialManager bookings={displayBookings} />;
      case 'customers':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SectionTitle title="Customer Directory" subtitle="Manage high-value clients and their session history." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-600/30 transition-all shadow-sm group">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black text-2xl text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {customer.fullName[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{customer.fullName}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {customer.id.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center font-bold text-slate-400">Module synchronized but inactive.</div>;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      notifications={notifications}
      locations={locations}
      selectedLocationId={selectedLocationId}
      onLocationChange={setSelectedLocationId}
      onLogout={logout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onMarkNotifRead={(id) => {}}
      onClearNotifs={() => {}}
    >
      {renderContent()}
    </Layout>
  );
};

// --- ProfileSettings Sub-Component ---

const ProfileSettings: React.FC<{ 
  user: User, 
  onUpdate: (data: Partial<User>) => void, 
  onLogout: () => void,
  language: Language,
  setLanguage: (lang: Language) => void
}> = ({ user, onUpdate, onLogout, language, setLanguage }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    timezone: user.timezone
  });

  const { t } = useLanguage();

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <SectionTitle title="Institutional Profile" subtitle="Manage your identity credentials and system synchronization." />
        <button 
          onClick={onLogout}
          className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
        >
          <LogOut size={16} /> {t('logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-32 bg-indigo-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12"><Zap size={100} /></div>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 bg-white rounded-[2rem] border-8 border-white shadow-2xl flex items-center justify-center font-black text-5xl text-indigo-600 uppercase group cursor-pointer relative overflow-hidden">
                  {user.fullName[0]}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <h4 className="text-xl font-bold text-slate-900">{user.fullName}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-6 flex items-center gap-2">
                <Shield size={12} className="text-indigo-600" /> Authorized {user.role}
              </p>
              
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">#{user.id.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commissioned</span>
                  <span className="text-xs font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700"><Shield size={80} /></div>
            <h5 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={16} className="text-indigo-400" /> Security Health
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">Your account is secured with 2FA and multi-factor hardware encryption.</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Audit Security Logs</button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Identification</h4>
              <Save size={18} className="text-slate-300" />
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
                <div className="relative">
                  <MailIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Signal (Phone)</label>
                <div className="relative">
                  <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role Permission</label>
                <div className="relative">
                  <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    disabled
                    value={user.role}
                    className="w-full pl-12 pr-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-bold text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => onUpdate(formData)}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
              >
                <CheckCircle size={16} /> Update Identity Specs
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Environment & Synchronization</h4>
             </div>
             <div className="p-10 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Globe size={14} className="text-indigo-600" /> Temporal Synchronization</label>
                    <select 
                      value={formData.timezone}
                      onChange={e => setFormData({...formData, timezone: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                      <option value="Asia/Phnom_Penh">ICT (Indochina Time)</option>
                      <option value="America/New_York">EST (Eastern Standard Time)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Globe size={14} className="text-indigo-600" /> Interface Language</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['en', 'km', 'zh'].map((l) => (
                         <button
                           key={l}
                           onClick={() => setLanguage(l as Language)}
                           className={`py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${language === l ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-indigo-50'}`}
                         >
                           {l}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
               
               <div className="pt-8 border-t border-slate-100 space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Bell size={14} className="text-indigo-600" /> Notification Channels</label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Email Alerts</span>
                      <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Real-time SMS</span>
                      <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
             <div className="px-10 py-6 border-b border-slate-100 bg-rose-50/30">
               <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">Authentication & Security</h4>
             </div>
             <div className="p-10 space-y-8">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Lock size={20} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Master Password</p>
                      <p className="text-[10px] text-slate-400 font-bold">Last changed 42 days ago</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all">Rotate Keys</button>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Smartphone size={20} /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                      <p className="text-[10px] text-emerald-500 font-black uppercase">Verified Active</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all">Disable</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
