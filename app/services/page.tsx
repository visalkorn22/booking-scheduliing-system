
import React, { useState } from 'react';
import { User, Service } from '../../types';
import { MOCK_SERVICES } from '../../constants';
import { SectionTitle } from '../../components/DashboardWidgets';
import { Plus, Clock, Users, MapPin, Sparkles } from 'lucide-react';
import { SearchIntelligence } from '../../components/SearchIntelligence';

interface ServicesProps {
  user: User;
  locationId: string;
}

export default function ServicesPage({ user, locationId }: ServicesProps) {
  const [filteredServices, setFilteredServices] = useState<Service[]>(MOCK_SERVICES);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionTitle title="Operational Offerings" subtitle="Manage high-performance service protocols across locations." />
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
          <Plus size={18} /> Deploy New Protocol
        </button>
      </div>

      <div className="max-w-2xl">
        <SearchIntelligence
          data={MOCK_SERVICES}
          searchKeys={['name', 'category']}
          onFilter={setFilteredServices}
          displayKey="name"
          secondaryKey="category"
          placeholder="Search by service name or category (e.g. Wellness)..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden group hover:border-indigo-600/30 transition-all shadow-sm">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              <img src={service.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600">
                {service.category}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-slate-900">{service.name}</h4>
                <p className="text-2xl font-black text-slate-900">${service.price}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">{service.description}</p>
              
              <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Clock size={16} className="text-indigo-600" /> {service.durationMinutes}m</span>
                <span className="flex items-center gap-2"><Users size={16} className="text-indigo-600" /> Cap: {service.maxCapacity}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-indigo-600" /> {service.locationIds.length} Sites</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No services matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
