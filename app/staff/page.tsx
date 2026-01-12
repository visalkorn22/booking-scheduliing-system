
import React, { useState } from 'react';
import { User, Staff } from '../../types';
import { MOCK_STAFF, MOCK_LOCATIONS } from '../../constants';
import { SectionTitle } from '../../components/DashboardWidgets';
import { Plus, User as UserIcon, Briefcase, MapPin } from 'lucide-react';
import { SearchIntelligence } from '../../components/SearchIntelligence';

interface StaffPageProps {
  user: User;
}

export default function StaffPage({ user }: StaffPageProps) {
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>(MOCK_STAFF);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionTitle title="Specialist Roster" subtitle="Manage elite personnel and their service assignments." />
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
          <Plus size={18} /> Onboard Specialist
        </button>
      </div>

      <div className="max-w-2xl">
        <SearchIntelligence
          data={MOCK_STAFF}
          searchKeys={['fullName', 'specialties']}
          onFilter={setFilteredStaff}
          displayKey="fullName"
          secondaryKey="specialties"
          placeholder="Search by name or specialty (e.g. Diagnostics)..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStaff.map(staff => (
          <div key={staff.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-600/30 transition-all">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {staff.fullName[0]}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{staff.fullName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {staff.locationIds.map(lid => (
                    <span key={lid} className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                      {MOCK_LOCATIONS.find(l => l.id === lid)?.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={12} className="text-indigo-600" /> Core Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {staff.specialties.map(spec => (
                    <span key={spec} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Assignments: <span className="text-slate-900 ml-1">{staff.assignedServices.length} protocols</span>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Manage Credentials</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No specialists matching your search.</p>
        </div>
      )}
    </div>
  );
}
