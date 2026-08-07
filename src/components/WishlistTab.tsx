import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { WishlistCategory, MemberName, ALL_MEMBERS } from '../types';
import {
  Heart,
  ShoppingBag,
  Camera,
  Compass,
  Coffee,
  Utensils,
  Plus,
  Star,
  MapPin,
  Trash2,
  Tag,
  ThumbsUp,
  Pencil,
  X
} from 'lucide-react';

export const WishlistTab: React.FC = () => {
  const {
    wishlist,
    addWishlistItem,
    editWishlistItem,
    deleteWishlistItem,
    voteWishlist,
    formatCurrency,
    currentMember
  } = useTrip();

  const [selectedCategory, setSelectedCategory] = useState<WishlistCategory | 'All'>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WishlistCategory>('Shopping');
  const [estimatedPriceTHB, setEstimatedPriceTHB] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [proposedBy, setProposedBy] = useState<MemberName>(currentMember);

  const categories: WishlistCategory[] = ['Shopping', 'Photo Spot', 'Activity', 'Café', 'Dining'];

  const filteredWishlist = wishlist.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (minRating > 0 && (item.rating || 0) < minRating) return false;
    return true;
  });

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Shopping');
    setEstimatedPriceTHB('');
    setRating(5);
    setNotes('');
    setLocation('');
    setProposedBy(currentMember);
    setShowAddModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setEstimatedPriceTHB(item.estimatedPriceTHB ? String(item.estimatedPriceTHB) : '');
    setRating(item.rating || 5);
    setNotes(item.notes || '');
    setLocation(item.location || '');
    setProposedBy(item.proposedBy || currentMember);
    setShowAddModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const thbVal = estimatedPriceTHB ? parseFloat(estimatedPriceTHB) : undefined;

    if (editingItemId) {
      editWishlistItem(editingItemId, {
        title,
        category,
        estimatedPriceTHB: thbVal,
        rating,
        notes,
        location,
        proposedBy
      });
    } else {
      addWishlistItem({
        title,
        category,
        estimatedPriceTHB: thbVal,
        rating,
        notes,
        location,
        proposedBy,
        status: 'Want to Go'
      });
    }

    setTitle('');
    setEstimatedPriceTHB('');
    setNotes('');
    setLocation('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: WishlistCategory) => {
    switch (cat) {
      case 'Shopping': return <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />;
      case 'Photo Spot': return <Camera className="w-3.5 h-3.5 text-rose-600" />;
      case 'Activity': return <Compass className="w-3.5 h-3.5 text-amber-600" />;
      case 'Café': return <Coffee className="w-3.5 h-3.5 text-blue-600" />;
      case 'Dining': return <Utensils className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getCategoryBadgeClass = (cat: WishlistCategory) => {
    switch (cat) {
      case 'Shopping': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Photo Spot': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Activity': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Café': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Dining': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Activity & Place Wishlist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Group Wishlist Bucket List
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Shopping spots, aesthetic cafes, photo spots & food markets requested by friends.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Wishlist Place</span>
        </button>
      </div>

      {/* Categories & Filter Bar (Side-by-Side Dropdowns) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-indigo-100/90 shadow-2xs text-xs">
          <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="font-bold text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-transparent font-extrabold text-indigo-950 outline-none cursor-pointer pr-1"
          >
            <option value="All">All Categories ({wishlist.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({wishlist.filter(w => w.category === cat).length})
              </option>
            ))}
          </select>
        </div>

        {/* Min Rating Dropdown */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-indigo-100/90 shadow-2xs text-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
          <span className="font-bold text-slate-500">Rating:</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-transparent font-extrabold text-indigo-950 outline-none cursor-pointer pr-1"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4★ & above</option>
            <option value={5}>5★ Only</option>
          </select>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWishlist.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
            No wishlist items found. Click "Add Wishlist Place" to add your favorite spot!
          </div>
        ) : (
          filteredWishlist.map(item => {
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 transition flex flex-col justify-between shadow-2xs hover:border-amber-300"
              >
                <div>
                  {/* Category */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                    {item.title}
                  </h3>

                  {/* Rating Stars */}
                  {item.rating && (
                    <div className="flex items-center space-x-1 text-amber-400 text-xs mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (item.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-bold text-slate-500 ml-1">
                        ({item.rating}/5)
                      </span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                      {item.notes}
                    </p>
                  )}

                  {item.location && (
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  {/* Votes Row */}
                  <div className="pt-2.5 pb-2 border-t border-slate-100 flex items-center justify-between text-xs my-2">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-indigo-400 font-bold mr-0.5">
                        Votes ({(item.votes || []).length}):
                      </span>
                      {(item.votes || []).length === 0 ? (
                        <span className="text-[10px] text-slate-300 italic">No votes yet</span>
                      ) : (
                        (item.votes || []).map(v => (
                          <span
                            key={v}
                            className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded-md"
                          >
                            {v}
                          </span>
                        ))
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => voteWishlist(item.id, currentMember)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 transition shrink-0 ${
                        (item.votes || []).includes(currentMember)
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-indigo-50 text-indigo-800 hover:bg-rose-100 border border-indigo-100'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{(item.votes || []).includes(currentMember) ? 'Voted' : 'Vote'}</span>
                    </button>
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400">By:</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {item.proposedBy}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.estimatedPriceTHB !== undefined && (
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {formatCurrency(item.estimatedPriceTHB)}
                      </span>
                    )}

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-slate-400 hover:text-indigo-900 rounded transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteWishlistItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal Add/Edit Wishlist Item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItemId ? 'Edit Wishlist Place' : 'Add Wishlist Place'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add a shop, cafe, or attraction you want to visit in Bangkok.
            </p>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Place / Activity Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Wallflowers Cafe / Chatuchak Market"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as WishlistCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Photo Spot">Photo Spot</option>
                    <option value="Activity">Activity</option>
                    <option value="Café">Café</option>
                    <option value="Dining">Dining</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating Priority</label>
                  <select
                    value={rating}
                    onChange={e => setRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Must Visit!)</option>
                    <option value={4}>⭐⭐⭐⭐ (High Priority)</option>
                    <option value={3}>⭐⭐⭐ (Nice to Have)</option>
                    <option value={2}>⭐⭐ (If Time Permits)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Expense (THB)</label>
                  <input
                    type="number"
                    value={estimatedPriceTHB}
                    onChange={e => setEstimatedPriceTHB(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposed By</label>
                  <select
                    value={proposedBy}
                    onChange={e => setProposedBy(e.target.value as MemberName)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Siam Square / Songwat Road"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Recommendations</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="What to buy, best photo spot, food to try..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Save Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
