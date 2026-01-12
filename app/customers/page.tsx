
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { MOCK_USERS } from '../../constants';
import { SectionTitle } from '../../components/DashboardWidgets';
import { SearchIntelligence } from '../../components/SearchIntelligence';
import { User as UserIcon, Mail, Smartphone, Calendar, History } from 'lucide-react';

interface CustomersPageProps {
  user: User;
}

export default function CustomersPage({ user }: CustomersPageProps) {
  const customers = MOCK_USERS.filter(u => u.role === UserRole.CUSTOMER);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>(customers);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionTitle title="Customer Directory" subtitle="Analyze high-value clients and their session history across the network." />
      </div>

      <div className="max-w-2xl">
        <SearchIntelligence
          data={customers}
          searchKeys={['fullName', 'email', 'phone']}
          onFilter={setFilteredCustomers}
          displayKey="fullName"
          secondaryKey="email"
          placeholder="Search customers by name, email or phone..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-indigo-600/30 transition-all shadow-sm group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black text-2xl text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">
                {customer.fullName[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{customer.fullName}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {customer.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <Mail size={14} className="text-slate-300" /> {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <Smartphone size={14} className="text-slate-300" /> {customer.phone}
                </div>
              )}
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <Calendar size={14} className="text-slate-300" /> Joined {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all">
                <History size={14} /> Full Session History
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No customers found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
