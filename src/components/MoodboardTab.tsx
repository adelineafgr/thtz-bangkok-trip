import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { MoodboardCategory, MoodboardItem, MemberName, ALL_MEMBERS } from '../types';
import { parseMediaUrl, extractUrlFromEmbedCode } from '../utils/mediaUtils';
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
  X,
  CheckCircle2,
  Link as LinkIcon
} from 'lucide-react';

/**
 * Renders the live media preview on the front card grid item.
 * Supports YouTube thumbnails, Instagram embeds, TikTok embeds, and direct images.
 * Plays inline immediately upon click without popups.
 */
const CardMediaPreview: React.FC<{ item: MoodboardItem }> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const parsed = parseMediaUrl(item.mediaUrl);

  // 1. YouTube Video (Inline autoplay on card click)
  if (parsed.youtubeId) {
    if (isPlaying) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${parsed.youtubeId}?autoplay=1`}
          title={item.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(true);
        }}
        className="w-full h-full cursor-pointer relative group"
        title="Klik untuk putar video"
      >
        <img
          src={`https://img.youtube.com/vi/${parsed.youtubeId}/hqdefault.jpg`}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Instagram Post / Reel Live Embed Preview (Directly interactive)
  if (parsed.instagramCode) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-900 relative">
        <iframe
          src={`https://www.instagram.com/p/${parsed.instagramCode}/embed`}
          title={item.title}
          className="w-full h-full border-0 bg-white"
          scrolling="no"
        />
      </div>
    );
  }

  // 3. TikTok Video Live Embed Preview (Directly interactive)
  if (parsed.tiktokId) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-950 relative">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${parsed.tiktokId}`}
          title={item.title}
          className="w-full h-full border-0 bg-slate-950"
          scrolling="no"
        />
      </div>
    );
  }

  // 4. Direct Images / Photos / Pinterest / Unsplash
  const isMediaImage = !item.mediaUrl.includes('tiktok.com') && !item.mediaUrl.includes('instagram.com');
  const imgSrc = (isMediaImage ? item.mediaUrl : null) || item.thumbnailUrl || parsed.thumbnailUrl || item.mediaUrl;

  return (
    <div
      onClick={() => {
        if (item.mediaUrl) window.open(item.mediaUrl, '_blank');
      }}
      className="w-full h-full cursor-pointer group"
      title="Klik untuk buka link"
    >
      <img
        src={imgSrc}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop';
        }}
      />
    </div>
  );
};

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
  const [caption, setCaption] = useState('');
  const [addedBy, setAddedBy] = useState<MemberName>(currentMember);

  const categories: MoodboardCategory[] = ['Sleep Over', 'Outfit', 'Video', 'Color Hunt', 'Food', 'Inspiration'];

  const filteredItems = moodboard.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleUrlInputChange = (inputVal: string) => {
    const clean = extractUrlFromEmbedCode(inputVal);
    setMediaUrl(clean);

    if (clean) {
      const parsed = parseMediaUrl(clean);
      setMediaType(parsed.type);
    }
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Outfit');
    setMediaType('image');
    setMediaUrl('');
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
    setCaption(item.caption || '');
    setAddedBy(item.addedBy || currentMember);
    setShowAddModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = extractUrlFromEmbedCode(mediaUrl.trim());
    if (!title.trim() || !cleanUrl) return;

    const parsed = parseMediaUrl(cleanUrl);
    const finalMediaType = mediaType || parsed.type;
    const finalThumb = parsed.thumbnailUrl || cleanUrl;

    if (editingItemId) {
      editMoodboardItem(editingItemId, {
        title: title.trim(),
        category,
        mediaType: finalMediaType,
        mediaUrl: cleanUrl,
        thumbnailUrl: finalThumb,
        caption: caption.trim(),
        addedBy
      });
    } else {
      addMoodboardItem({
        title: title.trim(),
        category,
        mediaType: finalMediaType,
        mediaUrl: cleanUrl,
        thumbnailUrl: finalThumb,
        caption: caption.trim(),
        addedBy
      });
    }

    setTitle('');
    setMediaUrl('');
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
            const parsed = parseMediaUrl(item.mediaUrl);
            const isVideo = item.mediaType !== 'image' || parsed.type !== 'image';
            const likesCount = item.likes?.length || 0;
            const hasLiked = item.likes?.includes(currentMember);
            const displayThumb = item.thumbnailUrl || parsed.thumbnailUrl || item.mediaUrl;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Media Cover Container */}
                  <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-slate-900">
                    <CardMediaPreview item={item} />

                    {/* Media Type Badge Overlay */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 z-10 pointer-events-none">
                      {isVideo ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span className="uppercase">{parsed.platformName || item.mediaType}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-sm z-10 pointer-events-none">
                      {item.category}
                    </div>
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

                    {/* Reel/TikTok/YouTube Direct Link */}
                    {item.mediaUrl && (
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 hover:bg-amber-100 transition max-w-full truncate"
                      >
                        <Film className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">Open {parsed.platformName || 'Link'}</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 shrink-0" />
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

      {/* Video / Image Modal Lightbox with Embed Support */}
      {activeMediaModal && (() => {
        const modalParsed = parseMediaUrl(activeMediaModal.mediaUrl);
        const modalThumb = activeMediaModal.thumbnailUrl || modalParsed.thumbnailUrl || activeMediaModal.mediaUrl;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  {activeMediaModal.category} · {(modalParsed.platformName || activeMediaModal.mediaType).toUpperCase()}
                </span>
                <button
                  onClick={() => setActiveMediaModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 text-sm font-bold rounded-full hover:bg-slate-100"
                >
                  ✕ Close
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">
                {activeMediaModal.title}
              </h3>

              {/* Interactive Player / Embed Box */}
              <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center min-h-[220px]">
                {modalParsed.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${modalParsed.youtubeId}?autoplay=1`}
                    title={activeMediaModal.title}
                    className="w-full aspect-video rounded-2xl border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : modalParsed.instagramCode ? (
                  <iframe
                    src={`https://www.instagram.com/p/${modalParsed.instagramCode}/embed`}
                    title={activeMediaModal.title}
                    className="w-full h-[400px] rounded-2xl border-0 bg-white"
                  />
                ) : modalParsed.tiktokId ? (
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${modalParsed.tiktokId}`}
                    title={activeMediaModal.title}
                    className="w-full h-[450px] rounded-2xl border-0 bg-black"
                  />
                ) : (
                  <img
                    src={modalThumb}
                    alt={activeMediaModal.title}
                    className="max-h-[380px] w-auto object-contain"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                )}
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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-bold flex items-center space-x-1 transition"
                >
                  <span>Open Original Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Add/Edit Moodboard Idea */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItemId ? 'Edit Idea' : 'Add Idea'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Copy-paste link TikTok, Instagram, YouTube, Pinterest, atau Gambar. Preview akan muncul otomatis!
            </p>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Thailand OOTD / Cafe aesthetic reel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Media URL / Reel / Embed Link - PROMINENT AT TOP */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Paste Link / Embed Code *</span>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto Preview
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={e => handleUrlInputChange(e.target.value)}
                    placeholder="Paste link YouTube, TikTok, Instagram, Pinterest, or Image URL..."
                    className="w-full pl-8 pr-3 py-2 border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-amber-50/30"
                    required
                  />
                  <LinkIcon className="w-4 h-4 text-amber-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Automatic Live Link Preview Box */}
              {mediaUrl && (() => {
                const parsed = parseMediaUrl(mediaUrl);

                return (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Preview Terdeteksi ({parsed.platformName})
                      </span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                        Otomatis Dibuat
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-300/80 flex items-center justify-center">
                      {parsed.youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${parsed.youtubeId}/hqdefault.jpg`}
                          alt="YouTube preview"
                          className="w-full h-full object-cover"
                        />
                      ) : parsed.instagramCode ? (
                        <iframe
                          src={`https://www.instagram.com/p/${parsed.instagramCode}/embed`}
                          title="Instagram preview"
                          className="w-full h-[220px] border-0 bg-white"
                        />
                      ) : parsed.tiktokId ? (
                        <iframe
                          src={`https://www.tiktok.com/embed/v2/${parsed.tiktokId}`}
                          title="TikTok preview"
                          className="w-full h-[220px] border-0 bg-slate-950"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Live preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={e => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                      )}
                      {parsed.type !== 'image' && !parsed.instagramCode && !parsed.tiktokId && (
                        <div className="absolute inset-0 m-auto w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-slate-900 ml-0.5 text-slate-900" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Category */}
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
