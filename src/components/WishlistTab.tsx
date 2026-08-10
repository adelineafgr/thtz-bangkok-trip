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
  Copy,
  Download,
  CheckCircle2,
  Filter,
  ExternalLink,
  Globe
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
  const [minVotesFilter, setMinVotesFilter] = useState<number | 'all'>('all');
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
  const [mapsUrl, setMapsUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [proposedBy, setProposedBy] = useState<MemberName>(currentMember);

  const categories: WishlistCategory[] = ['Shopping', 'Photo Spot', 'Activity', 'Café', 'Dining'];

  // Filter logic
  const filteredWishlist = wishlist.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    
    const voteCount = (item.votes || []).length;
    if (minVotesFilter !== 'all') {
      if (voteCount < minVotesFilter) return false;
    }
    
    return true;
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => (b.votes || []).length - (a.votes || []).length);

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Shopping');
    setEstimatedPriceTHB('');
    setNotes('');
    setLocation('');
    setMapsUrl('');
    setLinkUrl('');
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
    setMapsUrl(item.mapsUrl || '');
    setLinkUrl(item.linkUrl || '');
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
        mapsUrl: mapsUrl.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        proposedBy
      });
    } else {
      addWishlistItem({
        title,
        category,
        estimatedPriceTHB: thbVal,
        notes,
        location,
        mapsUrl: mapsUrl.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        proposedBy,
        status: 'Want to Go'
      });
    }

    setTitle('');
    setEstimatedPriceTHB('');
    setNotes('');
    setLocation('');
    setMapsUrl('');
    setLinkUrl('');
    setShowAddModal(false);
  };

  // Plain TXT export of place list
  const generatePlaceListTXT = () => {
    let txt = `BANGKOK TRIP 2026 - BUCKETLIST PLACES\n`;
    txt += `Category: ${selectedCategory} | Vote Filter: ${minVotesFilter === 'all' ? 'All Votes' : `${minVotesFilter}+ Votes`}\n`;
    txt += `Total Places: ${sortedWishlist.length}\n`;
    txt += `=========================================\n\n`;

    if (sortedWishlist.length === 0) {
      txt += `No bucketlist places found for current filters.\n`;
    } else {
      sortedWishlist.forEach((item, index) => {
        const voteCount = (item.votes || []).length;
        const voters = (item.votes || []).join(', ');
        txt += `${index + 1}. ${item.title}\n`;
        txt += `   Category: ${item.category}\n`;
        if (item.location) txt += `   Location: ${item.location}\n`;
        txt += `   Votes (${voteCount}): ${voters || 'None'}\n`;
        txt += `   Proposed By: ${item.proposedBy || 'Unknown'}\n`;
        if (item.estimatedPriceTHB !== undefined) txt += `   Est. Price: ฿${item.estimatedPriceTHB}\n`;
        if (item.notes) txt += `   Notes: ${item.notes}\n`;
        txt += `\n`;
      });
    }

    return txt;
  };

  const handleCopyTXT = () => {
    const text = generatePlaceListTXT();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadTXT = () => {
    const text = generatePlaceListTXT();
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `bangkok_bucketlist.txt`;
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
    <div className="space-y-5 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Bangkok Trip 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
              Bucketlist Places
            </h2>
            <p className="text-xs text-indigo-400 font-medium">
              Explore and vote on places, cafes, photo spots, and shopping locations suggested by friends.
            </p>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-indigo-50/80 p-1 rounded-2xl border border-indigo-100">
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'card'
                    ? 'bg-white text-indigo-950 shadow-2xs'
                    : 'text-indigo-400 hover:text-indigo-900'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-950 shadow-2xs'
                    : 'text-indigo-400 hover:text-indigo-900'
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-indigo-100/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Filters: Category & Vote Count Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100 font-bold text-xs text-indigo-950 outline-none cursor-pointer"
              >
                <option value="All">All Categories ({wishlist.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({wishlist.filter(w => w.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Vote Count Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-rose-500 shrink-0" />
              <select
                value={minVotesFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setMinVotesFilter(val === 'all' ? 'all' : Number(val));
                }}
                className="bg-rose-50/80 px-3 py-1.5 rounded-xl border border-rose-100 font-bold text-xs text-rose-950 outline-none cursor-pointer"
              >
                <option value="all">All Votes</option>
                <option value="1">1+ Vote</option>
                <option value="2">2+ Votes</option>
                <option value="3">3+ Votes</option>
                <option value="4">4+ Votes</option>
                <option value="5">5 Votes</option>
              </select>
            </div>
          </div>

          {/* Action Buttons: Copy TXT, Export TXT & Add Place */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyTXT}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold rounded-xl border border-indigo-200 transition flex items-center space-x-1.5"
            >
              {copiedText ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy TXT</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTXT}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TXT</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Place</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main List Display: Card View or Table View */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWishlist.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
              No bucketlist places found with current filters. Click "Add Place" to suggest one!
            </div>
          ) : (
            sortedWishlist.map(item => {
              const voteCount = (item.votes || []).length;
              const hasVoted = (item.votes || []).includes(currentMember);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-200 transition flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    {/* Category Badge & Top Votes indicator */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>

                      {voteCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          {voteCount} {voteCount === 1 ? 'Vote' : 'Votes'}
                        </span>
                      )}
                    </div>

                    {/* Title with optional embedded link */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-950 hover:text-indigo-600 hover:underline inline-flex items-center gap-1 group/title transition"
                          title="Open attached website / reference"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0 group-hover/title:translate-x-0.5 transition" />
                        </a>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </h3>

                    {item.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2.5 leading-relaxed">
                        {item.notes}
                      </p>
                    )}

                    {/* Google Maps link */}
                    {(() => {
                      const finalMapsUrl = item.mapsUrl || (item.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + item.location)}` : null);
                      if (!finalMapsUrl && !item.location) return null;

                      return (
                        <div className="mb-3">
                          <a
                            href={finalMapsUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-800 hover:underline font-bold transition group/map"
                            title="Open location in Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover/map:scale-110 transition" />
                            <span className="truncate">{item.location || 'View on Google Maps'}</span>
                            <ExternalLink className="w-3 h-3 text-rose-400 shrink-0" />
                          </a>
                        </div>
                      );
                    })()}

                    {/* Votes List */}
                    <div className="pt-2 pb-2 border-t border-slate-100 flex items-center justify-between text-xs my-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-medium mr-0.5">Voters:</span>
                        {voteCount === 0 ? (
                          <span className="text-[10px] text-slate-300 italic">No votes yet</span>
                        ) : (
                          (item.votes || []).map(v => (
                            <span
                              key={v}
                              className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded"
                            >
                              {v}
                            </span>
                          ))
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => voteWishlist(item.id, currentMember)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 transition shrink-0 ${
                          hasVoted
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-indigo-50 text-indigo-900 hover:bg-rose-100 border border-indigo-100'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{hasVoted ? 'Voted' : 'Vote'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer Info & Actions */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-slate-400">By:</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                        {item.proposedBy}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.estimatedPriceTHB !== undefined && (
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
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
        /* Table View */
        <div className="bg-white rounded-2xl border border-indigo-100/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">Place Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Proposed By</th>
                  <th className="py-3.5 px-4">Votes</th>
                  <th className="py-3.5 px-4">Est. Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sortedWishlist.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      No bucketlist places found with current filters.
                    </td>
                  </tr>
                ) : (
                  sortedWishlist.map((item, idx) => {
                    const voteCount = (item.votes || []).length;
                    const hasVoted = (item.votes || []).includes(currentMember);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.linkUrl ? (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-950 hover:text-indigo-600 hover:underline inline-flex items-center gap-1 group/title"
                              title="Open attached website / reference"
                            >
                              <span>{item.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            </a>
                          ) : (
                            <span>{item.title}</span>
                          )}
                          {item.notes && (
                            <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                              {item.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] border font-bold ${getCategoryBadgeClass(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {(() => {
                            const finalMapsUrl = item.mapsUrl || (item.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + item.location)}` : null);
                            if (finalMapsUrl) {
                              return (
                                <a
                                  href={finalMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center space-x-1 font-bold text-xs"
                                  title="Open in Google Maps"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>{item.location || 'View Map'}</span>
                                  <ExternalLink className="w-3 h-3 text-rose-400 shrink-0" />
                                </a>
                              );
                            }
                            return <span>{item.location || '-'}</span>;
                          })()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                            {item.proposedBy}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{voteCount} Votes</span>
                            <button
                              type="button"
                              onClick={() => voteWishlist(item.id, currentMember)}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                hasVoted ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-rose-100'
                              }`}
                            >
                              {hasVoted ? 'Voted' : 'Vote'}
                            </button>
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {(item.votes || []).join(', ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-900">
                          {item.estimatedPriceTHB !== undefined ? `฿${item.estimatedPriceTHB}` : '-'}
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

      {/* Modal Add/Edit Bucketlist Item - Click outside to close */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItemId ? 'Edit Place Item' : 'Add Bucketlist Place'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Place / Activity Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Wallflowers Cafe / Chatuchak Market"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as WishlistCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Siam Square / Songwat Road"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Google Maps URL (Optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={mapsUrl}
                    onChange={e => setMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Attached Link / Website (Optional)</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Recommendations</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="What to buy, best photo spot, food to try..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
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
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
