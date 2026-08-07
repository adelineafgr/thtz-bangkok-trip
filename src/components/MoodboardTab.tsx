import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { MoodboardCategory, MoodboardItem, MemberName, ALL_MEMBERS } from '../types';
import {
  Camera,
  Play,
  Heart,
  Plus,
  Video,
  ExternalLink,
  Sparkles,
  Trash2,
  Tv,
  Film,
  Image as ImageIcon,
  Pencil,
  Upload,
  X
} from 'lucide-react';

export const MoodboardTab: React.FC = () => {
  const {
    moodboard,
    addMoodboardItem,
    editMoodboardItem,
    toggleMoodboardLike,
    deleteMoodboardItem,
    currentMember
  } = useTrip();

  const [selectedCategory, setSelectedCategory] = useState<MoodboardCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [activeMediaModal, setActiveMediaModal] = useState<MoodboardItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MoodboardCategory>('Outfit');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'tiktok' | 'instagram'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [addedBy, setAddedBy] = useState<MemberName>(currentMember);

  const categories: MoodboardCategory[] = ['Sleep Over', 'Outfit', 'Video', 'Color Hunt', 'Food', 'Inspiration'];

  const filteredItems = moodboard.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailUrl(result);
        if (!mediaUrl.trim() || mediaType === 'image') {
          setMediaUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Outfit');
    setMediaType('image');
    setMediaUrl('');
    setThumbnailUrl('');
    setCaption('');
    setAddedBy(currentMember);
    setShowAddModal(true);
  };

  const openEditModal = (item: MoodboardItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setMediaType(item.mediaType || 'image');
    setMediaUrl(item.mediaUrl);
    setThumbnailUrl(item.thumbnailUrl || '');
    setCaption(item.caption || '');
    setAddedBy(item.addedBy || currentMember);
    setShowAddModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMediaUrl = mediaUrl.trim() || thumbnailUrl.trim();
    if (!title.trim() || !finalMediaUrl) return;

    if (editingItemId) {
      editMoodboardItem(editingItemId, {
        title,
        category,
        mediaType,
        mediaUrl: finalMediaUrl,
        thumbnailUrl: thumbnailUrl || (mediaType === 'image' ? finalMediaUrl : undefined),
        caption,
        addedBy
      });
    } else {
      addMoodboardItem({
        title,
        category,
        mediaType,
        mediaUrl: finalMediaUrl,
        thumbnailUrl: thumbnailUrl || (mediaType === 'image' ? finalMediaUrl : undefined),
        caption,
        addedBy
      });
    }

    setTitle('');
    setMediaUrl('');
    setThumbnailUrl('');
    setCaption('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Capture the Vibe</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Trip Moodboard & Reel Ideas
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Photo poses, outfit inspo, reel ideas, and unforgettable moments.
          </p>
        </div>
      </div>

      {/* Category Dropdown & Idea Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2.5 rounded-2xl border border-indigo-100/80 shadow-2xs text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-transparent font-black text-indigo-950 outline-none cursor-pointer pr-1"
          >
            <option value="All">All Moods ({moodboard.length})</option>
            {categories.map(cat => {
              const count = moodboard.filter(m => m.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Idea</span>
        </button>
      </div>

      {/* Gallery Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
            No moodboard items found in this category. Click "Idea" to inspire the group!
          </div>
        ) : (
          filteredItems.map(item => {
            const isVideo = item.mediaType !== 'image';
            const likesCount = item.likes?.length || 0;
            const hasLiked = item.likes?.includes(currentMember);

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Media Cover Container */}
                  <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        // Fallback image if link fails
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop';
                      }}
                    />

                    {/* Media Type Badge Overlay */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                      {isVideo ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span className="uppercase">{item.mediaType}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-sm">
                      {item.category}
                    </div>

                    {/* Play Button Overlay for Video */}
                    {isVideo && (
                      <button
                        onClick={() => setActiveMediaModal(item)}
                        className="absolute inset-0 m-auto w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl transition transform hover:scale-110"
                      >
                        <Play className="w-6 h-6 fill-slate-900 ml-1 text-slate-900" />
                      </button>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.caption}
                      </p>
                    )}

                    {/* Reel/TikTok Direct Link if video */}
                    {isVideo && (
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 hover:bg-amber-100 transition"
                      >
                        <Film className="w-3 h-3 text-amber-600" />
                        <span className="truncate">Open Reel / TikTok Link</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400">Added by:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {item.addedBy}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleMoodboardLike(item.id, currentMember)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                        hasLiked
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{likesCount}</span>
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-slate-400 hover:text-indigo-900 rounded transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteMoodboardItem(item.id)}
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

      {/* Video / Image Modal Lightbox */}
      {activeMediaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                {activeMediaModal.category} · {activeMediaModal.mediaType.toUpperCase()}
              </span>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-base font-extrabold text-slate-900">
              {activeMediaModal.title}
            </h3>

            {/* Media Box */}
            <div className="rounded-2xl overflow-hidden bg-black max-h-[350px] flex items-center justify-center">
              <img
                src={activeMediaModal.thumbnailUrl || activeMediaModal.mediaUrl}
                alt={activeMediaModal.title}
                className="max-h-[350px] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {activeMediaModal.caption && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {activeMediaModal.caption}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Creator idea by {activeMediaModal.addedBy}</span>
              <a
                href={activeMediaModal.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-bold flex items-center space-x-1"
              >
                <span>Open Video / Reel Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Moodboard Idea */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItemId ? 'Edit Idea' : 'Idea'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add outfit photos, aesthetic inspo, or TikTok video link.
            </p>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Can I try your drink? TikTok reel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as MoodboardCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Outfit">Outfit / OOTD</option>
                    <option value="Sleep Over">Sleep Over</option>
                    <option value="Video">Video Reel Idea</option>
                    <option value="Color Hunt">Color Hunt</option>
                    <option value="Food">Food / Mam Vlog</option>
                    <option value="Inspiration">Inspiration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Media Format</label>
                  <select
                    value={mediaType}
                    onChange={e => setMediaType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="image">Photo / Image</option>
                    <option value="tiktok">TikTok Video Link</option>
                    <option value="instagram">Instagram Reel Link</option>
                    <option value="video">Direct Video URL</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail Cover Photo (Optional) - Placed ABOVE Media URL */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thumbnail Cover Photo (Optional)</label>
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
                      value={thumbnailUrl}
                      onChange={e => {
                        const val = e.target.value;
                        setThumbnailUrl(val);
                        if (!mediaUrl.trim() || mediaType === 'image') {
                          setMediaUrl(val);
                        }
                      }}
                      placeholder="Atau masukkan URL foto"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  {thumbnailUrl && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Media URL / Reel Link *</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... OR https://www.tiktok.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Concept Description</label>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Idea note for group photo pose, outfit theme, or video script..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Added By</label>
                <select
                  value={addedBy}
                  onChange={e => setAddedBy(e.target.value as MemberName)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {ALL_MEMBERS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
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
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
