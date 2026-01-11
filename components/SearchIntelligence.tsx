
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Command } from 'lucide-react';

interface SearchIntelligenceProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  placeholder: string;
  onFilter: (filtered: T[]) => void;
  displayKey: keyof T;
  secondaryKey?: keyof T;
}

export function SearchIntelligence<T>({ 
  data, 
  searchKeys, 
  placeholder, 
  onFilter, 
  displayKey,
  secondaryKey 
}: SearchIntelligenceProps<T>) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length > 0) {
      const filtered = data.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(val.toLowerCase())
        )
      );
      setSuggestions(filtered.slice(0, 5));
      onFilter(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      onFilter(data);
      setIsOpen(false);
    }
  };

  const selectSuggestion = (item: T) => {
    const val = String(item[displayKey]);
    setQuery(val);
    setIsOpen(false);
    const filtered = data.filter(i => String(i[displayKey]) === val);
    onFilter(filtered);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onFilter(data);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search className={`transition-colors ${query ? 'text-indigo-600' : 'text-slate-400'}`} size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700 transition-all shadow-sm placeholder:text-slate-400"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query ? (
            <button 
              onClick={clearSearch}
              className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X size={16} />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-400">
              <Command size={10} />
              <span className="text-[10px] font-black uppercase">K</span>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligent Suggestions</p>
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{suggestions.length} Results</p>
          </div>
          <div className="py-2">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestion(item)}
                  className="w-full px-6 py-4 text-left hover:bg-indigo-50 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs font-black">
                      {String(item[displayKey])[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{String(item[displayKey])}</p>
                      {secondaryKey && (
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1.5">{String(item[secondaryKey])}</p>
                      )}
                    </div>
                  </div>
                  <CornerDownLeft size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching signatures detected</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
