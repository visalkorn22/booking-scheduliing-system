
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Command, ArrowUp, ArrowDown } from 'lucide-react';

interface SearchIntelligenceProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  placeholder: string;
  onFilter: (filtered: T[]) => void;
  displayKey: keyof T;
  secondaryKey?: keyof T;
}

/**
 * Highlight helper to bold the matching parts of the text
 */
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <b key={i} className="text-indigo-600 font-extrabold">{part}</b>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length > 0) {
      const filtered = data.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(val.toLowerCase())
        )
      );
      setSuggestions(filtered.slice(0, 6));
      onFilter(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
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
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onFilter(data);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search className={`transition-colors ${query ? 'text-indigo-600' : 'text-slate-400'}`} size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-12 py-4 rounded-3xl bg-white border border-slate-200 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none font-bold text-slate-800 transition-all shadow-sm placeholder:text-slate-400 text-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query ? (
            <button 
              onClick={clearSearch}
              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            >
              <X size={16} />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
              <Command size={10} />
              <span className="text-[10px] font-black uppercase tracking-tighter">K</span>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="px-8 py-5 border-b border-slate-100/50 bg-slate-50/50 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Sparkles size={14} className="text-indigo-600" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type-Ahead Intelligence</p>
             </div>
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{suggestions.length} Matches Found</p>
          </div>
          
          <div className="py-3 px-2">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full px-6 py-4 text-left rounded-2xl flex items-center justify-between group transition-all duration-200 ${
                      isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 font-black text-sm ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                      }`}>
                        {String(item[displayKey])[0].toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          <HighlightedText text={String(item[displayKey])} highlight={query} />
                        </p>
                        {secondaryKey && (
                          <p className={`text-[10px] font-bold uppercase tracking-tight mt-2 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {String(item[secondaryKey])}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isSelected && (
                         <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-lg">
                           <CornerDownLeft size={10} className="text-white" />
                           <span className="text-[9px] font-black uppercase">Select</span>
                         </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-8 py-12 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={24} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching signatures detected</p>
              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100/50 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
              <div className="p-1 bg-white border border-slate-200 rounded-md"><ArrowUp size={8} /></div>
              <div className="p-1 bg-white border border-slate-200 rounded-md"><ArrowDown size={8} /></div>
              Navigate
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
              <div className="px-1.5 py-1 bg-white border border-slate-200 rounded-md">Enter</div>
              Select
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
              <div className="px-1.5 py-1 bg-white border border-slate-200 rounded-md">Esc</div>
              Close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Sparkles = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
