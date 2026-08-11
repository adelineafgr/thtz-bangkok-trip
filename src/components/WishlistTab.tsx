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
  Globe,
  Upload,
  Image as ImageIcon
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
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [proposedBy, setProposedBy] = useState<MemberName>(currentMember);

  const categories: WishlistCategory[] = ['Shopping', 'Photo Spot', 'Activity', 'Café', 'Dining'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File foto terlalu besar (Maksimal 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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
    setImageUrl('');
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
    setImageUrl(item.imageUrl || '');
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
        imageUrl: imageUrl.trim() || undefined,
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
        imageUrl: imageUrl.trim() || undefined,
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
    setImageUrl('');
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
    <div className="space-y-6 pb-20">
      
      {/* Header matching Moodboard Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-rose-500" />
            <span>Explore & Wishlist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Group Bucket List & Wishlist
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Explore and vote on places, cafes, photo spots, and shopping locations suggested by friends.
          </p>
        </div>
      </div>

      {/* Category Dropdown, Filter & Add Place Button matching Moodboard Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Selector */}
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2.5 rounded-2xl border border-indigo-100/80 shadow-2xs text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-transparent font-black text-indigo-950 outline-none cursor-pointer pr-1"
            >
              <option value="All">All Categories ({wishlist.length})</option>
              {categories.map(cat => {
                const count = wishlist.filter(w => w.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Vote Filter */}
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2.5 rounded-2xl border border-indigo-100/80 shadow-2xs text-xs">
            <select
              value={minVotesFilter}
              onChange={(e) => setMinVotesFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent font-black text-indigo-950 outline-none cursor-pointer pr-1"
            >
              <option value="all">All Votes</option>
              <option value={1}>1+ Vote</option>
              <option value={2}>2+ Votes</option>
              <option value={3}>3+ Votes</option>
              <option value={4}>4+ Votes</option>
              <option value={5}>5 Votes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="bg-white p-1 rounded-2xl border border-indigo-100/80 shadow-2xs flex items-center space-x-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'card'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Copy TXT */}
          <button
            onClick={handleCopyTXT}
            className="px-3 py-2 bg-white hover:bg-indigo-50 text-indigo-950 text-xs font-bold rounded-2xl border border-indigo-100/80 shadow-2xs transition flex items-center space-x-1.5"
            title="Copy TXT"
          >
            {copiedText ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Export TXT */}
          <button
            onClick={handleDownloadTXT}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl border border-indigo-100/80 shadow-2xs transition flex items-center space-x-1.5"
            title="Export TXT"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Place button */}
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Place</span>
          </button>
        </div>
      </div>

      {/* Main List Display: Card View or Table View */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWishlist.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
              No bucketlist places found with current filters. Click "Place" to suggest one!
            </div>
          ) : (
            sortedWishlist.map(item => {
              const voteCount = (item.votes || []).length;
              const hasVoted = (item.votes || []).includes(currentMember);

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image if available */}
                    {item.imageUrl ? (
                      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-slate-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Category Badge Overlay */}
                        <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                          {getCategoryIcon(item.category)}
                          <span className="uppercase">{item.category}</span>
                        </div>
                        {/* Vote Badge Overlay */}
                        {voteCount > 0 && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-sm flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3 fill-slate-950" />
                            <span>{voteCount}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Top Bar without image */
                      <div className="p-4 pb-0 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </span>

                        {voteCount > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] font-black flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3 text-amber-600" />
                            <span>{voteCount} {voteCount === 1 ? 'Vote' : 'Votes'}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Card Body Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
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

                      {item.estimatedPriceTHB !== undefined && (
                        <div className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                          <span>Est: ฿{item.estimatedPriceTHB}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({formatCurrency(item.estimatedPriceTHB)})</span>
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.notes}
                        </p>
                      )}

                      {/* Google Maps link */}
                      {(() => {
                        const finalMapsUrl = item.mapsUrl || (item.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + item.location)}` : null);
                        if (!finalMapsUrl && !item.location) return null;

                        return (
                          <div>
                            <a
                              href={finalMapsUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80 hover:bg-rose-100 transition truncate max-w-full"
                              title="Open location in Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span className="truncate">{item.location || 'View on Google Maps'}</span>
                              <ExternalLink className="w-3 h-3 text-rose-500 shrink-0 ml-0.5" />
                            </a>
                          </div>
                        );
                      })()}

                      {/* Voters List */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Voted by:</span>
                        {voteCount === 0 ? (
                          <span className="text-[10px] text-slate-400 italic">No votes yet</span>
                        ) : (
                          (item.votes || []).map(v => (
                            <span
                              key={v}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v === currentMember
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {v}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar matching Moodboard's Footer Bar */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Added by:</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                        {item.proposedBy}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => voteWishlist(item.id, currentMember)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                          hasVoted
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-indigo-50'
                        }`}
                        title={hasVoted ? 'Remove vote' : 'Vote for this place'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white text-white' : ''}`} />
                        <span>{voteCount}</span>
                      </button>

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
                          <div className="flex items-center space-x-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 shadow-2xs"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
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
                                <span className="block text-[10px] text-slate-400 font-normal mt-0.5 truncate max-w-xs">
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
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
                            <button
                              type="button"
                              onClick={() => voteWishlist(item.id, currentMember)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 transition ${
                                hasVoted
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 border border-slate-200'
                              }`}
                              title={hasVoted ? 'Remove vote' : 'Vote for this place'}
                            >
                              <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-white text-white' : ''}`} />
                              <span>{voteCount}</span>
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
                <label className="block font-semibold text-slate-700 mb-1">Foto / Sampul Tempat (Opsional)</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 inline-flex items-center space-x-1.5 shrink-0 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="Atau tempel URL foto (https://...)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  {imageUrl && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                        title="Hapus foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Recommendations</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="What to buy, best photo spot, food to try..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
