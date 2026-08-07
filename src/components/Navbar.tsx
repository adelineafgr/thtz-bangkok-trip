import React, { useState } from 'react';
import { useTrip, TabType } from '../context/TripContext';
import { ALL_MEMBERS, MemberName } from '../types';
import {
  Compass,
  Calendar,
  CheckSquare,
  Heart,
  Camera,
  Wallet,
  User,
  RotateCcw,
  Smartphone,
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  toggleDevicePreview: () => void;
  isDevicePreview: boolean;
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  toggleDevicePreview,
  isDevicePreview,
  onOpenQuickAdd
}) => {
  const {
    currentMember,
    setCurrentMember,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    activeTab,
    setActiveTab,
    resetToDefault
  } = useTrip();

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [tempRate, setTempRate] = useState(exchangeRate.toString());

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'prep', label: 'Notes & Prep', icon: CheckSquare },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'moodboard', label: 'Moodboard', icon: Camera },
    { id: 'expenses', label: 'Expenses & Pocket', icon: Wallet }
  ];

  const handleSaveRate = () => {
    const val = parseFloat(tempRate);
    if (!isNaN(val) && val > 0) {
      setExchangeRate(val);
      setShowRateModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100/80 shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Destination */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-rose-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-md transform rotate-3 shrink-0">
              🇹🇭
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-xl font-black text-indigo-950 tracking-tight leading-none truncate">
                  THTZ to BKK '26
                </h1>
              </div>
            </div>
          </div>

          {/* Right Actions Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Currency Toggle */}
            <button
              onClick={() => setCurrency(currency === 'IDR' ? 'THB' : 'IDR')}
              className="px-2.5 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-950 text-xs font-bold flex items-center space-x-1.5 transition"
              title="Switch Currency"
            >
              <span className="font-extrabold text-indigo-600">{currency}</span>
              <span className="text-[10px] text-indigo-400">({currency === 'IDR' ? 'Rp' : '฿'})</span>
            </button>

            {/* Exchange Rate button */}
            <button
              onClick={() => {
                setTempRate(exchangeRate.toString());
                setShowRateModal(true);
              }}
              className="hidden sm:flex items-center space-x-1 text-xs text-indigo-700 font-semibold hover:text-indigo-900 bg-indigo-50/80 px-2.5 py-1.5 rounded-xl border border-indigo-100/60 transition"
              title="Edit Exchange Rate"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span>1 THB = {Math.round(exchangeRate)} IDR</span>
            </button>

            {/* Current Member Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-xl shadow-md hover:opacity-95 text-xs font-black tracking-tight transition"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{currentMember}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showMemberDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMemberDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-indigo-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                     Login as
                    </div>
                    {ALL_MEMBERS.map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setCurrentMember(m);
                          setShowMemberDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
                          currentMember === m ? 'font-black text-indigo-600 bg-indigo-50/60' : 'text-indigo-950 font-semibold'
                        }`}
                      >
                        <span>{m}</span>
                        {currentMember === m && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex space-x-2 border-t border-indigo-100/80 pt-2 pb-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-tight whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-indigo-950 hover:bg-indigo-100 border border-indigo-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exchange Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Exchange Rate Setting</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set conversion rate from Thai Baht (THB) to Indonesian Rupiah (IDR).
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                1 THB = ? IDR
              </label>
              <input
                type="number"
                value={tempRate}
                onChange={e => setTempRate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. 561.12"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRate}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
