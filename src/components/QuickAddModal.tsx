import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { MemberName, ALL_MEMBERS, WishlistCategory, MoodboardCategory, ExpenseCategory } from '../types';
import {
  Wallet,
  Heart,
  CheckSquare,
  Image as ImageIcon,
  Sparkles,
  X
} from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const {
    currentMember,
    addExpense,
    addWishlistItem,
    addPrepNote,
    addMoodboardItem,
    exchangeRate
  } = useTrip();

  const [activeType, setActiveType] = useState<'expense' | 'wishlist' | 'prep' | 'moodboard'>('expense');

  // Expense form
  const [expItem, setExpItem] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Shopping');
  const [expAmountTHB, setExpAmountTHB] = useState('');
  const [expPaidBy, setExpPaidBy] = useState<'Shared Pocket' | MemberName>('Shared Pocket');

  // Wishlist form
  const [wishTitle, setWishTitle] = useState('');
  const [wishCategory, setWishCategory] = useState<WishlistCategory>('Shopping');
  const [wishPriceTHB, setWishPriceTHB] = useState('');

  // Prep form
  const [prepAgenda, setPrepAgenda] = useState('');
  const [prepDate, setPrepDate] = useState('');

  // Moodboard form
  const [mbTitle, setMbTitle] = useState('');
  const [mbCategory, setMbCategory] = useState<MoodboardCategory>('Outfit');
  const [mbUrl, setMbUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'expense') {
      if (!expItem.trim()) return;
      const thb = parseFloat(expAmountTHB) || 0;
      addExpense({
        date: new Date().toLocaleDateString('id-ID'),
        item: expItem,
        category: expCategory,
        totalTHB: thb,
        totalIDR: Math.round(thb * exchangeRate),
        paidBy: expPaidBy,
        splitBetween: ALL_MEMBERS
      });
    } else if (activeType === 'wishlist') {
      if (!wishTitle.trim()) return;
      addWishlistItem({
        title: wishTitle,
        category: wishCategory,
        estimatedPriceTHB: wishPriceTHB ? parseFloat(wishPriceTHB) : undefined,
        rating: 5,
        proposedBy: currentMember,
        status: 'Want to Go'
      });
    } else if (activeType === 'prep') {
      if (!prepAgenda.trim()) return;
      addPrepNote({
        agenda: prepAgenda,
        date: prepDate || 'Upcoming',
        status: 'Upcoming',
        assignee: 'All',
        category: 'Preparation'
      });
    } else if (activeType === 'moodboard') {
      if (!mbTitle.trim() || !mbUrl.trim()) return;
      const isVideo = mbUrl.includes('tiktok') || mbUrl.includes('instagram') || mbUrl.includes('reel');
      addMoodboardItem({
        title: mbTitle,
        category: mbCategory,
        mediaType: isVideo ? 'tiktok' : 'image',
        mediaUrl: mbUrl,
        addedBy: currentMember
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-indigo-950 leading-tight">
                Quick Add Entry
              </h3>
              <p className="text-[11px] font-bold text-indigo-400">Posting as {currentMember}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-indigo-400 hover:text-indigo-950 rounded-full hover:bg-indigo-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-indigo-50/80 rounded-2xl mb-4 text-[10px] sm:text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveType('expense')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeType === 'expense' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-400'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('wishlist')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeType === 'wishlist' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Wishlist</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('prep')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeType === 'prep' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-400'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('moodboard')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeType === 'moodboard' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-400'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Mood</span>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {activeType === 'expense' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Item *</label>
                <input
                  type="text"
                  value={expItem}
                  onChange={e => setExpItem(e.target.value)}
                  placeholder="e.g. Pad Thai / Taxi Grab"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (THB ฿)</label>
                  <input
                    type="number"
                    value={expAmountTHB}
                    onChange={e => setExpAmountTHB(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paid By</label>
                  <select
                    value={expPaidBy}
                    onChange={e => setExpPaidBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white"
                  >
                    <option value="Shared Pocket">Shared Pocket (Kas)</option>
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m} (Talangan)</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeType === 'wishlist' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wishlist Spot *</label>
                <input
                  type="text"
                  value={wishTitle}
                  onChange={e => setWishTitle(e.target.value)}
                  placeholder="e.g. Gentlewoman Siam Square"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={wishCategory}
                    onChange={e => setWishCategory(e.target.value as WishlistCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white"
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Photo Spot">Photo Spot</option>
                    <option value="Activity">Activity</option>
                    <option value="Café">Café</option>
                    <option value="Dining">Dining</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Price (THB)</label>
                  <input
                    type="number"
                    value={wishPriceTHB}
                    onChange={e => setWishPriceTHB(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'prep' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task / Agenda *</label>
                <input
                  type="text"
                  value={prepAgenda}
                  onChange={e => setPrepAgenda(e.target.value)}
                  placeholder="e.g. Tukar Baht / Beli eSIM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="text"
                  value={prepDate}
                  onChange={e => setPrepDate(e.target.value)}
                  placeholder="e.g. 28/10/26"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </>
          )}

          {activeType === 'moodboard' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Idea Title *</label>
                <input
                  type="text"
                  value={mbTitle}
                  onChange={e => setMbTitle(e.target.value)}
                  placeholder="e.g. Thailand OOTD / TikTok Reel idea"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={mbCategory}
                    onChange={e => setMbCategory(e.target.value as MoodboardCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium bg-white"
                  >
                    <option value="Outfit">Outfit</option>
                    <option value="Sleep Over">Sleep Over</option>
                    <option value="Video">Video Reel</option>
                    <option value="Color Hunt">Color Hunt</option>
                    <option value="Food">Food Vlog</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Photo / Reel URL *</label>
                  <input
                    type="url"
                    value={mbUrl}
                    onChange={e => setMbUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              Save Entry
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
