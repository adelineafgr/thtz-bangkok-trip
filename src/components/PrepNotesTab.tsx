import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { NoteStatus, MemberName, ALL_MEMBERS, PreparationNote } from '../types';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Circle,
  Pencil,
  X,
  Search,
  Calendar,
  Tag,
  User,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PrepNotesTab: React.FC = () => {
  const {
    prepNotes,
    addPrepNote,
    editPrepNote,
    updatePrepNoteStatus,
    deletePrepNote,
    setActiveTab
  } = useTrip();

  // Search & View layout states
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [activeDetailNote, setActiveDetailNote] = useState<PreparationNote | null>(null);

  // Form states
  const [date, setDate] = useState('');
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<NoteStatus>('Upcoming');
  const [assignee, setAssignee] = useState<MemberName | 'All'>('All');
  const [category, setCategory] = useState<'Document' | 'Booking' | 'Meeting' | 'Preparation'>('Preparation');

  const openAddModal = () => {
    setEditingItemId(null);
    setDate('');
    setAgenda('');
    setNotes('');
    setStatus('Upcoming');
    setAssignee('All');
    setCategory('Preparation');
    setShowAddModal(true);
  };

  const openEditModal = (note: PreparationNote) => {
    setEditingItemId(note.id);
    setDate(note.date || '');
    setAgenda(note.agenda || '');
    setNotes(note.notes || '');
    setStatus(note.status || 'Upcoming');
    setAssignee(note.assignee || 'All');
    setCategory(note.category || 'Preparation');
    setShowAddModal(true);
  };

  // Filter notes ONLY using search query (No dropdown filters as requested)
  const filteredNotes = prepNotes.filter(n => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      n.agenda.toLowerCase().includes(query) ||
      (n.notes && n.notes.toLowerCase().includes(query)) ||
      (n.assignee && n.assignee.toLowerCase().includes(query)) ||
      (n.category && n.category.toLowerCase().includes(query)) ||
      (n.date && n.date.toLowerCase().includes(query)) ||
      (n.status && n.status.toLowerCase().includes(query))
    );
  });

  // Sort notes: Pending / Upcoming notes first, Done items at the bottom
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const aIsDone = a.status === 'Done';
    const bIsDone = b.status === 'Done';
    if (aIsDone !== bIsDone) {
      return aIsDone ? 1 : -1;
    }
    return 0;
  });

  const totalCount = prepNotes.length;
  const doneCount = prepNotes.filter(n => n.status === 'Done').length;
  const pendingCount = totalCount - doneCount;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agenda.trim()) return;

    if (editingItemId) {
      editPrepNote(editingItemId, {
        date: date.trim(),
        agenda: agenda.trim(),
        notes: notes.trim(),
        status,
        assignee,
        category
      });
    } else {
      addPrepNote({
        date: date.trim(),
        agenda: agenda.trim(),
        notes: notes.trim(),
        status,
        assignee,
        category
      });
    }

    setDate('');
    setAgenda('');
    setNotes('');
    setShowAddModal(false);
  };

  const getStatusBadge = (s: NoteStatus) => {
    switch (s) {
      case 'Done':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Completed</span>
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Upcoming</span>
          </span>
        );
      case 'To Schedule':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>To Schedule</span>
          </span>
        );
    }
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'Booking':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Document':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Meeting':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <CheckSquare className="w-4 h-4 text-rose-500" />
            <span>Preparation Notes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Trip Preparation & Checklist Notes
          </h2>
          <p className="text-xs text-indigo-400 font-medium mt-0.5">
            Keep track of flight bookings, entry documents, e-SIM setup, and optional reminder dates.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('notes')}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-2xl border border-indigo-100 transition flex items-center space-x-1.5"
          >
            <span>General Scratchpad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Control Bar: Search Bar & Add Prep Note Button (NO Dropdown Filters) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Prominent Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prep notes by title, details, assignee, date..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-indigo-100/90 rounded-2xl text-xs font-medium text-indigo-950 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white shadow-2xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: View Switcher & Add Prep Note */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-indigo-100 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid Note Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Compact Note List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Prep Note Button */}
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-2xl shadow-md flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Prep Note</span>
          </button>
        </div>

      </div>

      {/* Quick Search Status & Note Counters */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
        <div>
          {searchQuery ? (
            <span className="text-indigo-900">
              Found <strong className="text-indigo-600 font-extrabold">{sortedNotes.length}</strong> {sortedNotes.length === 1 ? 'note' : 'notes'} matching "{searchQuery}"
            </span>
          ) : (
            <span>
              Showing all <strong className="text-indigo-950 font-black">{totalCount}</strong> preparation notes ({pendingCount} pending, {doneCount} completed)
            </span>
          )}
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-indigo-600 hover:underline font-bold text-xs"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Empty State when no notes found */}
      {sortedNotes.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-indigo-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-indigo-950">
            {searchQuery ? 'No prep notes match your search' : 'No prep notes created yet'}
          </h3>
          <p className="text-xs text-indigo-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try searching with a different term, or clear the search filter to view all items.'
              : 'Add your first preparation note for flight bookings, travel documents, or offline meetings.'}
          </p>
          <div className="pt-2">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition"
              >
                Reset Search
              </button>
            ) : (
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Add Prep Note
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid View (Note Cards Layout) */}
      {viewMode === 'grid' && sortedNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map(n => {
            const isDone = n.status === 'Done';
            const hasDate = n.date && n.date.trim().length > 0;

            return (
              <div
                key={n.id}
                onClick={() => setActiveDetailNote(n)}
                className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-indigo-100 hover:border-indigo-300'
                }`}
              >
                {/* Note Header: Badges & Status Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      {/* Category Badge */}
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryColor(n.category)}`}>
                        {n.category || 'Preparation'}
                      </span>
                      
                      {/* Assignee Badge */}
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100/80 text-amber-900 border border-amber-200/60 flex items-center space-x-1">
                        <User className="w-3 h-3 text-amber-700" />
                        <span>{n.assignee || 'All'}</span>
                      </span>
                    </div>

                    {/* Quick Toggle Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePrepNoteStatus(n.id, isDone ? 'Upcoming' : 'Done');
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition shrink-0"
                      title={isDone ? 'Mark as Pending' : 'Mark as Done'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                      )}
                    </button>
                  </div>

                  {/* Note Title */}
                  <h3 className={`text-base font-extrabold tracking-tight text-indigo-950 leading-snug ${
                    isDone ? 'line-through text-slate-400' : ''
                  }`}>
                    {n.agenda}
                  </h3>

                  {/* Note Content / Body */}
                  {n.notes ? (
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-100 line-clamp-3">
                      {n.notes}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-300 italic">No additional details</p>
                  )}
                </div>

                {/* Note Footer: Optional Reminder Date & Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* Optional Reminder Date Pill */}
                  <div>
                    {hasDate ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{n.date}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 italic">
                        No reminder date
                      </span>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(n)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                      title="Edit Prep Note"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePrepNote(n.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact List View */}
      {viewMode === 'list' && sortedNotes.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">Status</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Reminder Date (Optional)</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sortedNotes.map(n => {
                  const isDone = n.status === 'Done';
                  const hasDate = n.date && n.date.trim().length > 0;

                  return (
                    <tr
                      key={n.id}
                      onClick={() => setActiveDetailNote(n)}
                      className={`hover:bg-indigo-50/40 transition cursor-pointer ${
                        isDone ? 'bg-slate-50/50 text-slate-400' : ''
                      }`}
                    >
                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => updatePrepNoteStatus(n.id, isDone ? 'Upcoming' : 'Done')}
                          className="p-1 rounded-full text-slate-400 hover:text-indigo-600 transition"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 hover:text-indigo-500" />
                          )}
                        </button>
                      </td>

                      {/* Title & Notes */}
                      <td className="py-3.5 px-4">
                        <div className={`font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {n.agenda}
                        </div>
                        {n.notes && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {n.notes}
                          </div>
                        )}
                      </td>

                      {/* Optional Reminder Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hasDate ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                            <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>{n.date}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">None</span>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {n.assignee || 'All'}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(n.category)}`}>
                          {n.category || 'Preparation'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openEditModal(n)}
                            className="p-1.5 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePrepNote(n.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Preparation Note */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-indigo-950">
                  {editingItemId ? 'Edit Prep Note' : 'Add Prep Note'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5 text-xs">
              
              {/* 1. Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prep Note Title *
                </label>
                <input
                  type="text"
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                  placeholder="e.g. Purchase Unlimited Thailand e-SIM"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* 2. Optional Reminder Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Reminder Date
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Optional (Not Required)
                  </span>
                </div>
                <input
                  type="text"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  placeholder="e.g. Oct 28, 2026 or leave empty"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  You can leave this blank if no specific target deadline is needed.
                </p>
              </div>

              {/* 3. Detailed Content / Instructions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes & Details <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add specific instructions, booking links, or details..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* 4. Category & Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Preparation">Preparation</option>
                    <option value="Booking">Booking</option>
                    <option value="Document">Document</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value as MemberName | 'All')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="All">All Members</option>
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as NoteStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="To Schedule">To Schedule</option>
                  <option value="Done">Completed</option>
                </select>
              </div>

              {/* Footer Modal Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  {editingItemId ? 'Save Changes' : 'Create Prep Note'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Read-Only Detail View */}
      {activeDetailNote && (
        <div
          onClick={() => setActiveDetailNote(null)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryColor(activeDetailNote.category)}`}>
                    {activeDetailNote.category || 'Preparation'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Assigned: {activeDetailNote.assignee || 'All'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveDetailNote(null)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-black text-slate-900 mt-2.5 leading-snug">
                {activeDetailNote.agenda}
              </h3>
            </div>

            {/* Content Box */}
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Status:</span>
                <div>{getStatusBadge(activeDetailNote.status)}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-bold">Reminder Date:</span>
                <span className="font-mono font-bold text-slate-800">
                  {activeDetailNote.date && activeDetailNote.date.trim() ? activeDetailNote.date : 'Not Set (Optional)'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-bold block mb-1">Notes & Details:</span>
                <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                  {activeDetailNote.notes || 'No extra notes specified for this task.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  const item = activeDetailNote;
                  setActiveDetailNote(null);
                  deletePrepNote(item.id);
                }}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => {
                  const item = activeDetailNote;
                  setActiveDetailNote(null);
                  openEditModal(item);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow-xs"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Note</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
