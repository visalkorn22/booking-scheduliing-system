
import React, { useState } from 'react';
import { X, Save, User, Briefcase, Plus, Trash2 } from 'lucide-react';
import { Staff, Service } from '../types';

interface StaffModalProps {
  staff?: Staff | null;
  availableServices: Service[];
  onClose: () => void;
  onSave: (staff: Partial<Staff>) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ staff, availableServices, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Staff>>(staff || {
    fullName: '',
    specialties: [],
    assignedServices: []
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  const toggleService = (id: string) => {
    const current = formData.assignedServices || [];
    if (current.includes(id)) {
      setFormData({...formData, assignedServices: current.filter(cid => cid !== id)});
    } else {
      setFormData({...formData, assignedServices: [...current, id]});
    }
  };

  const addSpecialty = () => {
    if (!newSpecialty) return;
    setFormData({...formData, specialties: [...(formData.specialties || []), newSpecialty]});
    setNewSpecialty('');
  };

  const removeSpecialty = (index: number) => {
    setFormData({...formData, specialties: (formData.specialties || []).filter((_, i) => i !== index)});
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{staff ? 'Edit Staff Member' : 'Onboard New Staff'}</h3>
            <p className="text-xs text-slate-500 font-medium">Manage credentials and service permissions.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                placeholder="Specialist Name"
                className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-0 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialties & Skills</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSpecialty}
                onChange={e => setNewSpecialty(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addSpecialty()}
                placeholder="Add skill..."
                className="flex-1 px-5 py-2.5 bg-slate-50 border-0 rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none"
              />
              <button onClick={addSpecialty} className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties?.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-indigo-100">
                  {s}
                  <button onClick={() => removeSpecialty(i)} className="text-indigo-300 hover:text-rose-500"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Services</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.assignedServices?.includes(service.id) ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{service.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{service.category}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${formData.assignedServices?.includes(service.id) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200'}`}>
                    {formData.assignedServices?.includes(service.id) && <Plus size={12} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            <Save size={16} /> Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};
