import React from 'react';
import { useTrip, TabType } from '../context/TripContext';
import {
  Compass,
  Calendar,
  CheckSquare,
  Heart,
  Camera,
  Wallet,
  Plus
} from 'lucide-react';

interface BottomNavProps {
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenQuickAdd }) => {
  const { activeTab, setActiveTab } = useTrip();

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'prep', label: 'Prep', icon: CheckSquare },
    { id: 'wishlist', label: 'Bucketlist', icon: Heart },
    { id: 'moodboard', label: 'Mood', icon: Camera },
    { id: 'expenses', label: 'Expense', icon: Wallet }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-indigo-100/80 px-1 py-1 pb-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <React.Fragment key={tab.id}>
              {idx === 3 && (
                <button
                  type="button"
                  onClick={onOpenQuickAdd}
                  className="flex flex-col items-center justify-center -mt-5 px-1 focus:outline-none"
                  title="Add Item"
                >
                  <div className="w-11 h-11 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white transform rotate-3 active:scale-95 transition">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-rose-600 tracking-tight mt-0.5">Add</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition active:scale-95 ${
                  isActive ? 'text-indigo-600 font-black' : 'text-indigo-400/80 hover:text-indigo-700'
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-indigo-100/80 text-indigo-600' : ''}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] mt-0.5 leading-none tracking-tight font-black truncate max-w-[50px]">
                  {tab.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
