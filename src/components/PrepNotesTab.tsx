import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { NoteStatus, NoteColor, PrepCategory, MemberName, ALL_MEMBERS, PreparationNote } from '../types';
import {
  CheckSquare,
  Pin,
  Plus,
  Search,
  Trash2,
  Pencil,
  Tag,
  User,
  Calendar,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Grid,
  List,
  Sparkles
} from 'lucide-react';

export const PrepNotesTab: React.FC = () => {
  const {
    currentMember,
    prepNotes,
    addPrepNote,
    editPrepNote,
    updatePrepNoteStatus,
    deletePrepNote,
    togglePinPrepNote
  } = useTrip();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterAssignee, setFilterAssignee] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [activeDetailNote, setActiveDetailNote] = useState<PreparationNote | null>(null);

  // Form Fields
  const [agenda, setAgenda] = useState('');
  const [category, setCategory] = useState<PrepCategory>('Preparation');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<NoteStatus>('Upcoming');
  const [assignee, setAssignee] = useState<MemberName | 'All'>('All');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [isPinned, setIsPinned] = useState(false);

  const categories: string[] = [
    'All',
    'Preparation',
    'Document',
    'Booking',
    'Meeting',
    'Emergency & Contacts',
    'Tips & Packing',
    'Ideas',
    'General'
  ];

  const colors: { id: NoteColor; label: string; bgClass: string; borderClass: string }[] = [
    { id: 'yellow', label: 'Yellow', bgClass: 'bg-amber-100', borderClass: 'border-amber-300' },
    { id: 'pink', label: 'Pink', bgClass: 'bg-pink-100', borderClass: 'border-pink-300' },
    { id: 'blue', label: 'Blue', bgClass: 'bg-sky-100', borderClass: 'border-sky-300' },
    { id: 'green', label: 'Green', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-300' },
    { id: 'purple', label: 'Purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-300' },
    { id: 'amber', label: 'Amber', bgClass: 'bg-amber-200', borderClass: 'border-amber-400' }
  ];

  const openAddModal = () => {
    setEditingNoteId(null);
    setAgenda('');
    setCategory('Preparation');
    setDate(new Date().toLocaleDateString('id-ID'));
    setStatus('Upcoming');
    setAssignee('All');
    setNotes('');
    setTagsInput('');
    setColor('yellow');
    setIsPinned(false);
    setShowModal(true);
  };

  const openEditModal = (note: PreparationNote) => {
    setEditingNoteId(note.id);
    setAgenda(note.agenda || '');
    setCategory((note.category as PrepCategory) || 'Preparation');
    setDate(note.date || '');
    setStatus(note.status || 'Upcoming');
    setAssignee(note.assignee || 'All');
    setNotes(note.notes || '');
    setTagsInput(note.tags ? note.tags.join(', ') : '');
    setColor(note.color || 'yellow');
    setIsPinned(!!note.isPinned);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agenda.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingNoteId) {
      editPrepNote(editingNoteId, {
        agenda: agenda.trim(),
        category,
        date: date.trim() || new Date().toLocaleDateString('id-ID'),
        status,
        assignee,
        notes: notes.trim(),
        tags: parsedTags,
        color,
        isPinned,
        author: currentMember
      });
    } else {
      addPrepNote({
        agenda: agenda.trim(),
        category,
        date: date.trim() || new Date().toLocaleDateString('id-ID'),
        status,
        assignee,
        notes: notes.trim(),
        tags: parsedTags,
        color,
        isPinned,
        author: currentMember
      });
    }

    setShowModal(false);
  };

  // Filter notes
  const filteredNotes = prepNotes.filter(n => {
    if (filterCategory !== 'All' && (n.category || 'General') !== filterCategory) return false;
    if (filterStatus !== 'All' && n.status !== filterStatus) return false;
    if (filterAssignee !== 'All' && (n.assignee || 'All') !== filterAssignee) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAgenda = n.agenda.toLowerCase().includes(q);
      const matchNotes = (n.notes || '').toLowerCase().includes(q);
      const matchCategory = (n.category || '').toLowerCase().includes(q);
      const matchTags = n.tags ? n.tags.some(t => t.toLowerCase().includes(q)) : false;
      const matchAuthor = (n.author || '').toLowerCase().includes(q);
      const matchAssignee = (n.assignee || '').toLowerCase().includes(q);
      return matchAgenda || matchNotes || matchCategory || matchTags || matchAuthor || matchAssignee;
    }

    return true;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  const doneCount = prepNotes.filter(n => n.status === 'Done').length;
  const upcomingCount = prepNotes.filter(n => n.status === 'Upcoming').length;
  const scheduleCount = prepNotes.filter(n => n.status === 'To Schedule').length;

  const getColorClasses = (c?: NoteColor) => {
    switch (c) {
      case 'pink':
        return 'bg-pink-50/90 border-pink-200/90 text-pink-950 hover:border-pink-300';
      case 'blue':
        return 'bg-sky-50/90 border-sky-200/90 text-sky-950 hover:border-sky-300';
      case 'green':
        return 'bg-emerald-50/90 border-emerald-200/90 text-emerald-950 hover:border-emerald-300';
      case 'purple':
        return 'bg-purple-50/90 border-purple-200/90 text-purple-950 hover:border-purple-300';
      case 'amber':
        return 'bg-amber-100/70 border-amber-300/90 text-amber-950 hover:border-amber-400';
      case 'yellow':
      default:
        return 'bg-amber-50/90 border-amber-200/90 text-amber-950 hover:border-amber-300';
    }
  };

  const getStatusBadge = (s: NoteStatus) => {
    switch (s) {
      case 'Done':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Done</span>
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Upcoming</span>
          </span>
        );
      case 'To Schedule':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            <span>To Schedule</span>
          </span>
        );
    }
  };

  const renderNoteCard = (note: PreparationNote) => {
    return (
      <div
        key={note.id}
        onClick={() => setActiveDetailNote(note)}
        className={`rounded-3xl border p-4 sm:p-5 transition duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md relative group ${getColorClasses(
          note.color
        )}`}
      >
        <div>
          {/* Card Top Row: Category, Status & Pin */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/80 border border-slate-200/80 text-slate-800 shadow-2xs">
                {note.category || 'Preparation'}
              </span>
              {getStatusBadge(note.status)}
            </div>

            <div className="flex items-center space-x-1 shrink-0" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => togglePinPrepNote(note.id)}
                className={`p-1.5 rounded-xl transition ${
                  note.isPinned
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
                }`}
                title={note.isPinned ? 'Lepas Sematan' : 'Sematkan Note'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title / Agenda */}
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug mb-1.5">
            {note.agenda}
          </h3>

          {/* Metadata Row: Date & Assignee */}
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-600 mb-2.5 flex-wrap gap-y-1">
            <span className="flex items-center space-x-1 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200/60 font-mono">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{note.date}</span>
            </span>
            <span className="flex items-center space-x-1 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200/60">
              <User className="w-3 h-3 text-indigo-500" />
              <span>Assignee: {note.assignee || 'All'}</span>
            </span>
          </div>

          {/* Note Content / Detail */}
          {note.notes && (
            <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed line-clamp-4 bg-white/60 p-3 rounded-2xl border border-slate-200/50 mb-3">
              {note.notes}
            </p>
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200/60"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  <span>#{t}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>{note.author ? `oleh ${note.author}` : `Catatan Prep`}</span>

          <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => openEditModal(note)}
              className="p-1 text-slate-500 hover:text-indigo-900 hover:bg-white/80 rounded-lg transition"
              title="Edit Note"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Hapus prep note "${note.agenda}"?`)) {
                  deletePrepNote(note.id);
                }
              }}
              className="p-1 text-slate-500 hover:text-rose-600 hover:bg-white/80 rounded-lg transition"
              title="Hapus Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Banner Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <CheckSquare className="w-4 h-4 text-rose-500" />
            <span>Prep Notes & Checklist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Persiapan Trip & Catatan Penting
          </h2>
          <p className="text-xs text-indigo-400 font-medium mt-0.5">
            Kelola agenda persiapan, tiket, dokumen, booking, kontak darurat, dan tips packing Bangkok.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center space-x-1.5 transition shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Prep Note</span>
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-indigo-100/80 shadow-sm space-y-3">
        
        {/* Top Row: Search input + View Mode + Quick Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari agenda, detail, tags, atau assignee..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-indigo-100 rounded-2xl text-xs font-semibold text-indigo-950 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Filters & View Switcher */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Status Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-indigo-100 px-3 py-2 rounded-2xl text-xs font-bold text-indigo-950 focus:outline-none cursor-pointer"
            >
              <option value="All">Semua Status ({prepNotes.length})</option>
              <option value="Upcoming">Upcoming ({upcomingCount})</option>
              <option value="To Schedule">To Schedule ({scheduleCount})</option>
              <option value="Done">Done ({doneCount})</option>
            </select>

            {/* Assignee Filter Dropdown */}
            <select
              value={filterAssignee}
              onChange={e => setFilterAssignee(e.target.value)}
              className="bg-slate-50 border border-indigo-100 px-3 py-2 rounded-2xl text-xs font-bold text-indigo-950 focus:outline-none cursor-pointer"
            >
              <option value="All">Semua Member</option>
              {ALL_MEMBERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'grid' ? 'bg-white text-indigo-950 shadow-xs font-black' : 'text-slate-400'
                }`}
                title="Grid Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === 'table' ? 'bg-white text-indigo-950 shadow-xs font-black' : 'text-slate-400'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid View */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          
          {/* Section 1: Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black text-indigo-950 uppercase tracking-wider">
                <Pin className="w-4 h-4 text-rose-500 fill-current" />
                <span>Disematkan ({pinnedNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          {/* Section 2: Other Notes */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && (
              <div className="text-xs font-black text-indigo-950 uppercase tracking-wider pt-2">
                Catatan & Prep Lainnya ({unpinnedNotes.length})
              </div>
            )}

            {unpinnedNotes.length === 0 && pinnedNotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-indigo-100/80 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-indigo-950">Tidak ada prep note ditemukan</h3>
                <p className="text-xs text-indigo-400 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau filter status/kategori, atau buat note baru!
                </p>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Prep Note Baru</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedNotes.map(renderNoteCard)}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-indigo-100 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Agenda / Task</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50 font-medium">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada catatan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map(n => (
                    <tr
                      key={n.id}
                      onClick={() => setActiveDetailNote(n)}
                      className="hover:bg-indigo-50/50 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-950 whitespace-nowrap">
                        {n.date}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-indigo-950">
                        <div className="flex items-center space-x-1.5">
                          {n.isPinned && <Pin className="w-3 h-3 text-rose-500 fill-current shrink-0" />}
                          <span>{n.agenda}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                          {n.category || 'Preparation'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {n.assignee || 'All'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(n.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openEditModal(n)}
                            className="p-1.5 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePrepNote(n.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Add / Edit Prep Note */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-indigo-950">
                  {editingNoteId ? 'Edit Prep Note' : 'Tambah Prep Note Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-indigo-400 hover:text-indigo-950 rounded-full hover:bg-indigo-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* Agenda / Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul / Agenda Task *</label>
                <input
                  type="text"
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                  placeholder="e.g. Tukar Baht / Beli e-SIM Thailand / Meeting Outfit"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as PrepCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white"
                  >
                    <option value="Preparation">Preparation</option>
                    <option value="Document">Document</option>
                    <option value="Booking">Booking</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Emergency & Contacts">Emergency & Contacts</option>
                    <option value="Tips & Packing">Tips & Packing</option>
                    <option value="Ideas">Ideas</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as NoteStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="To Schedule">To Schedule</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              {/* Assignee & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab</label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value as MemberName | 'All')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800 bg-white"
                  >
                    <option value="All">All Members (Semua)</option>
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Date / Deadline</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="e.g. 28/10/26"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Content / Detail Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Catatan / Detail Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Tulis instruksi, nomor kontak, tips, link booking, atau catatan detail..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (dipisahkan koma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. eSIM, Internet, Penting"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Warna Kartu</label>
                <div className="flex items-center space-x-2">
                  {colors.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={`w-8 h-8 rounded-full ${c.bgClass} border-2 ${c.borderClass} transition transform ${
                        color === c.id ? 'scale-110 shadow-md ring-2 ring-indigo-600' : 'hover:scale-105'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Pin Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pin-checkbox"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="pin-checkbox" className="font-bold text-slate-700 cursor-pointer select-none">
                  Sematkan di Atas (Pin Note)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Simpan Note
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal View Detail Prep Note */}
      {activeDetailNote && (
        <div
          onClick={() => setActiveDetailNote(null)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-indigo-100 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                    {activeDetailNote.category || 'Preparation'}
                  </span>
                  {getStatusBadge(activeDetailNote.status)}
                </div>
                <h3 className="text-lg font-black text-indigo-950 leading-snug">
                  {activeDetailNote.agenda}
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailNote(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Row */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>🗓 Deadline: {activeDetailNote.date || '-'}</span>
              <span>👤 Assignee: {activeDetailNote.assignee || 'All'}</span>
            </div>

            {/* Note Content */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">Detail & Notes:</span>
              <p className="text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/60 max-h-60 overflow-y-auto">
                {activeDetailNote.notes || 'Tidak ada detail tambahan.'}
              </p>
            </div>

            {/* Tags */}
            {activeDetailNote.tags && activeDetailNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeDetailNote.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const noteToDelete = activeDetailNote;
                  setActiveDetailNote(null);
                  if (window.confirm(`Hapus prep note "${noteToDelete.agenda}"?`)) {
                    deletePrepNote(noteToDelete.id);
                  }
                }}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>

              <button
                onClick={() => {
                  const noteToEdit = activeDetailNote;
                  setActiveDetailNote(null);
                  openEditModal(noteToEdit);
                }}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Note</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
