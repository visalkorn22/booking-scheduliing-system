
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Clock, DollarSign, Users, Shield, Briefcase, RefreshCcw, Camera, Image as ImageIcon } from 'lucide-react';
import { Service, RecurrencePattern } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceModalProps {
  service?: Service | null;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    category: 'General',
    isActive: true,
    maxCapacity: 1,
    bufferMinutes: 15,
    imageUrl: '',
    allowedRecurrence: [RecurrencePattern.NONE]
  });

  useEffect(() => {
    if (service) {
      setFormData({
        ...service
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        durationMinutes: 30,
        category: 'General',
        isActive: true,
        maxCapacity: 1,
        bufferMinutes: 15,
        imageUrl: '',
        allowedRecurrence: [RecurrencePattern.NONE]
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecurrence = (pattern: RecurrencePattern) => {
    const current = formData.allowedRecurrence || [];
    if (current.includes(pattern)) {
      if (pattern === RecurrencePattern.NONE) return; // Must allow at least one-time
      setFormData({ ...formData, allowedRecurrence: current.filter(p => p !== pattern) });
    } else {
      setFormData({ ...formData, allowedRecurrence: [...current, pattern] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{service ? 'Update Service Protocol' : 'Design New Offering'}</h3>
            <p className="text-xs text-slate-500 font-medium">Configure precision scheduling and settlement parameters.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Visual Identity</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center transition-all hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={32} />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">Upload Presentation Asset</p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">JPG, PNG, WebP recommended</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Institutional Label</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Executive Checkup"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classification</label>
              <input 
                type="text" 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="e.g. Medical"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Specifications</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none resize-none"
              placeholder="Detailed description of the service delivery..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">Settlement ($)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">Active Mins</label>
              <input 
                type="number" 
                value={formData.durationMinutes}
                onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">Slot Capacity</label>
              <input 
                type="number" 
                value={formData.maxCapacity}
                onChange={e => setFormData({...formData, maxCapacity: Number(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">Sync Buffer</label>
              <input 
                type="number" 
                value={formData.bufferMinutes}
                onChange={e => setFormData({...formData, bufferMinutes: Number(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <RefreshCcw size={14} className="text-indigo-600" /> Authorized Recurrence Cycles
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[RecurrencePattern.NONE, RecurrencePattern.WEEKLY, RecurrencePattern.BIWEEKLY, RecurrencePattern.MONTHLY].map(pattern => (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => toggleRecurrence(pattern)}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    formData.allowedRecurrence?.includes(pattern)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100'
                      : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'
                  }`}
                >
                  {t(pattern.toLowerCase())}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:text-slate-600 hover:bg-white transition-all">Discard</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200">
            <Save size={18} /> {service ? 'Commit Update' : 'Initialize Service'}
          </button>
        </div>
      </div>
    </div>
  );
};