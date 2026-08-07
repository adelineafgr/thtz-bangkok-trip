import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { WishlistCategory, MemberName, ALL_MEMBERS, WishlistItem } from '../types';
import {
  Heart,
  ShoppingBag,
  Camera,
  Compass,
  Coffee,
  Utensils,
  Plus,
  MapPin,
  Trash2,
  Tag,
  ThumbsUp,
  Pencil,
  X,
  LayoutGrid,
  Table,
  FileText,
  Copy,
  Download,
  CheckCircle2,
  Sparkles,
  Trophy
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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WishlistCategory>('Shopping');
  const [estimatedPriceTHB, setEstimatedPriceTHB] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [proposedBy, setProposedBy] = useState<MemberName>(currentMember);

  const categories: WishlistCategory[] = ['Shopping', 'Photo Spot', 'Activity', 'Café', 'Dining'];

  const filteredWishlist = wishlist.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  // Top voted items (> 3 votes)
  const highVotedItems = wishlist.filter(item => (item.votes || []).length > 3);
  const sortedWishlist = [...filteredWishlist].sort((a, b) => (b.votes || []).length - (a.votes || []).length);

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Shopping');
    setEstimatedPriceTHB('');
    setNotes('');
    setLocation('');
    setProposedBy(currentMember);
    setShowAddModal(true);
  };

  const openEditModal = (item: WishlistItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setEstimatedPriceTHB(item.estimatedPriceTHB ? String(item.estimatedPriceTHB) : '');
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
        notes,
        location,
        proposedBy
      });
    } else {
      addWishlistItem({
        title,
        category,
        estimatedPriceTHB: thbVal,
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

  // Generate TXT prompt for AI itinerary
  const generateAIPromptTXT = () => {
    const itemsToExport = highVotedItems.length > 0 ? highVotedItems : sortedWishlist;
    
    let txt = `=== BANGKOK TRIP 2026 - TOP VOTED BUCKET LIST ITEMS FOR ITINERARY ===\n`;
    txt += `Generated on: ${new Date().toLocaleDateString('id-ID')}\n`;
    txt += `Total Approved Spots (>3 votes): ${highVotedItems.length} items\n\n`;
    txt += `LIST OF PLACES & ACTIVITIES:\n`;

    itemsToExport.forEach((item, index) => {
      const voteCount = (item.votes || []).length;
      const voters = (item.votes || []).join(', ');
      txt += `${index + 1}. ${item.title}\n`;
      txt += `   - Category: ${item.category}\n`;
      txt += `   - Location/Area: ${item.location || 'Bangkok'}\n`;
      txt += `   - Votes (${voteCount}): ${voters || 'None'}\n`;
      txt += `   - Proposed by: ${item.proposedBy}\n`;
      if (item.estimatedPriceTHB) txt += `   - Est. Expense: ฿${item.estimatedPriceTHB}\n`;
      if (item.notes) txt += `   - Notes: ${item.notes}\n`;
      txt += `\n`;
    });

    txt += `--- PROMPT FOR AI ITINERARY GENERATOR ---\n`;
    txt += `"Tolong buatkan jadwal r itinerary Bangkok 5 hari 4 malam berdasarkan daftar tempat yang sudah divote terbanyak (>3 vote) di atas. Kelompokkan tempat berdasarkan area lokasi yang berdekatan agar rute perjalanan efisien."\n`;

    return txt;
  };

  const handleCopyTXT = () => {
    const text = generateAIPromptTXT();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadTXT = () => {
    const text = generateAIPromptTXT();
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `bangkok_itinerary_bucketlist_export.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Activity & Place Wishlist</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
              Group Bucket List
            </h2>
            <p className="text-xs text-indigo-400 font-medium">
              Shopping spots, aesthetic cafes, photo spots & food markets requested by friends.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-indigo-50/80 p-1 rounded-2xl border border-indigo-100">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                viewMode === 'card'
                  ? 'bg-white text-indigo-950 shadow-2xs'
                  : 'text-indigo-400 hover:text-indigo-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-950 shadow-2xs'
                  : 'text-indigo-400 hover:text-indigo-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vote Recap Section (Requirement 6) */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-0.5 shadow-md">
        <div className="bg-white rounded-[23px] p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                  <span>Rekap Hasil Vote Bucket List</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px]">
                    {highVotedItems.length} Approved (&gt;3 Votes)
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tempat dengan lebih dari 3 vote otomatis disetujui untuk dimasukkan ke Itinerary AI.
                </p>
              </div>
            </div>

            {/* Export Buttons (Requirement 5) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyTXT}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-black rounded-xl border border-indigo-200 transition flex items-center space-x-1.5"
              >
                {copiedText ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Copy TXT AI Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadTXT}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export TXT File</span>
              </button>
            </div>
          </div>

          {/* Top Voted Highlights */}
          <div className="flex flex-wrap gap-2 text-xs">
            {highVotedItems.length === 0 ? (
              <span className="text-slate-400 text-xs italic">
                Belum ada spot yang meraih &gt;3 vote. Vote item favorit kalian sekarang!
              </span>
            ) : (
              highVotedItems.map(item => (
                <div
                  key={item.id}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-indigo-950 font-bold flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{item.title}</span>
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-md font-black">
                    {(item.votes || []).length} Votes
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter Bar & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Dropdown */}
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-indigo-100/90 shadow-2xs text-xs">
          <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
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

        {/* Add Bucketlist Button */}
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>bucketlist</span>
        </button>
      </div>

      {/* MAIN VIEW: Card View vs Table View */}
      {viewMode === 'card' ? (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWishlist.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
              No wishlist items found. Click "bucketlist" to add your favorite spot!
            </div>
          ) : (
            filteredWishlist.map(item => {
              const voteCount = (item.votes || []).length;
              const isApproved = voteCount > 3;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between shadow-2xs ${
                    isApproved ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Category & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>

                      {isApproved && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Pass to AI</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {item.title}
                    </h3>

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
                          Votes ({voteCount}):
                        </span>
                        {voteCount === 0 ? (
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
      ) : (
        /* TABLE VIEW (Requirement 4 & 5) */
        <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-indigo-100 bg-indigo-50/40 flex items-center justify-between">
            <h3 className="text-sm font-black text-indigo-950 flex items-center space-x-2">
              <Table className="w-4 h-4 text-indigo-600" />
              <span>Bucket List Data Table (&gt;3 Votes Auto-Qualified for Export)</span>
            </h3>
            <span className="text-xs text-indigo-400 font-bold">
              Showing {filteredWishlist.length} Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-indigo-50/60 border-b border-indigo-100 text-indigo-400 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Place / Activity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Proposed By</th>
                  <th className="py-3 px-4">Votes</th>
                  <th className="py-3 px-4">Est. Price</th>
                  <th className="py-3 px-4">AI Export Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50 font-bold">
                {sortedWishlist.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-indigo-300 italic">
                      No bucket list items found.
                    </td>
                  </tr>
                ) : (
                  sortedWishlist.map((item, idx) => {
                    const voteCount = (item.votes || []).length;
                    const isQualified = voteCount > 3;

                    return (
                      <tr key={item.id} className={`hover:bg-indigo-50/30 transition ${isQualified ? 'bg-amber-50/30' : ''}`}>
                        <td className="py-3.5 px-4 font-mono text-indigo-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-black text-indigo-950">
                          {item.title}
                          {item.notes && (
                            <span className="block text-[10px] text-indigo-400 font-normal">
                              {item.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] border font-bold ${getCategoryBadgeClass(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-indigo-600 font-medium">
                          {item.location || '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px]">
                            {item.proposedBy}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-indigo-950">{voteCount} Votes</span>
                            <button
                              type="button"
                              onClick={() => voteWishlist(item.id, currentMember)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                (item.votes || []).includes(currentMember)
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-indigo-50 text-indigo-800 hover:bg-rose-100'
                              }`}
                            >
                              {(item.votes || []).includes(currentMember) ? 'Voted' : 'Vote'}
                            </button>
                          </div>
                          <div className="text-[9px] text-indigo-300 mt-0.5">
                            {(item.votes || []).join(', ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-indigo-900">
                          {item.estimatedPriceTHB !== undefined ? `฿${item.estimatedPriceTHB}` : '-'}
                        </td>
                        <td className="py-3.5 px-4">
                          {isQualified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Export Ready (&gt;3 Votes)</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-normal">
                              Need {4 - voteCount} more votes
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-slate-400 hover:text-indigo-900 transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteWishlistItem(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Wishlist Item */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItemId ? 'Edit Bucket List' : 'bucketlist'}
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
