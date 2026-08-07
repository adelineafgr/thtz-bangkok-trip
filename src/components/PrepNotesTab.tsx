import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { NoteStatus, MemberName, ALL_MEMBERS } from '../types';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Filter,
  Pencil,
  X
} from 'lucide-react';

export const PrepNotesTab: React.FC = () => {
  const {
    prepNotes,
    addPrepNote,
    editPrepNote,
    updatePrepNoteStatus,
    deletePrepNote
  } = useTrip();

  const [filterStatus, setFilterStatus] = useState<'All' | NoteStatus>('All');
  const [filterAssignee, setFilterAssignee] = useState<MemberName | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [activeDetailNote, setActiveDetailNote] = useState<any | null>(null);

  // Form
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

  const openEditModal = (note: any) => {
    setEditingItemId(note.id);
    setDate(note.date || '');
    setAgenda(note.agenda || '');
    setNotes(note.notes || '');
    setStatus(note.status || 'Upcoming');
    setAssignee(note.assignee || 'All');
    setCategory(note.category || 'Preparation');
    setShowAddModal(true);
  };

  const parseDateTimestamp = (dateStr: string): number => {
    if (!dateStr) return 9999999999999;
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day).getTime();
    }
    const timestamp = new Date(dateStr).getTime();
    return isNaN(timestamp) ? 9999999999999 : timestamp;
  };

  const filteredNotes = prepNotes.filter(n => {
    if (filterStatus !== 'All' && n.status !== filterStatus) return false;
    if (filterAssignee !== 'All' && (n.assignee || 'All') !== filterAssignee) return false;
    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => parseDateTimestamp(a.date) - parseDateTimestamp(b.date));

  const doneCount = prepNotes.filter(n => n.status === 'Done').length;
  const upcomingCount = prepNotes.filter(n => n.status === 'Upcoming').length;
  const scheduleCount = prepNotes.filter(n => n.status === 'To Schedule').length;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agenda.trim()) return;

    if (editingItemId) {
      editPrepNote(editingItemId, {
        date: date || new Date().toLocaleDateString('id-ID'),
        agenda,
        notes,
        status,
        assignee,
        category
      });
    } else {
      addPrepNote({
        date: date || new Date().toLocaleDateString('id-ID'),
        agenda,
        notes,
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
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Done</span>
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Upcoming</span>
          </span>
        );
      case 'To Schedule':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3 h-3" />
            <span>To Schedule</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
          <CheckSquare className="w-4 h-4 text-rose-500" />
          <span>Notes & Wishlist Preparation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
          Upcoming Events & To-Do Checklist
        </h2>
        <p className="text-xs text-indigo-400 font-medium">
          Track flight bookings, TDAC forms, money exchange, and offline trip meetings.
        </p>
      </div>

      {/* Filter Dropdowns & Add Prep Button */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-indigo-100 shadow-2xs text-xs">
          <Filter className="w-4 h-4 text-indigo-500 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-transparent font-extrabold text-indigo-950 outline-none cursor-pointer pr-1"
          >
            <option value="All">All Tasks ({prepNotes.length})</option>
            <option value="Upcoming">Upcoming ({upcomingCount})</option>
            <option value="To Schedule">To Schedule ({scheduleCount})</option>
            <option value="Done">Done ({doneCount})</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-2xl border border-indigo-100 shadow-2xs text-xs">
          <span className="text-slate-400 font-bold">Assigned to:</span>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value as any)}
            className="bg-transparent font-extrabold text-indigo-950 outline-none cursor-pointer pr-1"
          >
            <option value="All">All</option>
            {ALL_MEMBERS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-2xl shadow-md flex items-center space-x-1.5 transition ml-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Prep</span>
        </button>
      </div>

      {/* Table for Desktop & Cards for Mobile */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Agenda / Task</th>
                <th className="py-3.5 px-4">Notes & Warnings</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedNotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No notes found under this filter.
                  </td>
                </tr>
              ) : (
                sortedNotes.map(n => {
                  const isTDAC = n.agenda.includes('TDAC');
                  return (
                    <tr
                      key={n.id}
                      onClick={() => setActiveDetailNote(n)}
                      className={`hover:bg-indigo-50/50 transition cursor-pointer ${
                        isTDAC ? 'bg-rose-50/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {n.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {n.agenda}
                        {n.category && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-normal">
                            {n.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {n.notes || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-slate-100">
          {sortedNotes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notes found under this filter.
            </div>
          ) : (
            sortedNotes.map(n => (
              <div
                key={n.id}
                onClick={() => setActiveDetailNote(n)}
                className="p-4 space-y-2 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono font-bold">
                      {n.date}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">
                      {n.agenda}
                    </h4>
                  </div>
                  {getStatusBadge(n.status)}
                </div>

                {n.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2">
                    {n.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-xs" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">Assigned to:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {n.assignee || 'All'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(n)}
                      className="p-1.5 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deletePrepNote(n.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Modal Add Preparation Note */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItemId ? 'Edit Preparation Task' : 'Add Preparation Task'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Create or edit checklist item for flight ticket, passport, or offline meeting.
            </p>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda / Task Title *</label>
                <input
                  type="text"
                  value={agenda}
                  onChange={e => setAgenda(e.target.value)}
                  placeholder="e.g. Tukar uang Baht / Beli e-SIM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="e.g. 28/10/26"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as NoteStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="To Schedule">To Schedule</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value as MemberName | 'All')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="All">All Members</option>
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Preparation">Preparation</option>
                    <option value="Booking">Booking</option>
                    <option value="Document">Document</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Details, links, deadline..."
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
                  {editingItemId ? 'Simpan Perubahan' : 'Add Prep'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Preparation Task Detail */}
      {activeDetailNote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {activeDetailNote.category || 'Preparation'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                  {activeDetailNote.agenda}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  🗓 Date: {activeDetailNote.date}
                </p>
              </div>
              <button
                onClick={() => setActiveDetailNote(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Assigned to:</label>
                <select
                  value={activeDetailNote.assignee || 'All'}
                  onChange={(e) => {
                    const newAssignee = e.target.value as MemberName | 'All';
                    editPrepNote(activeDetailNote.id, { assignee: newAssignee });
                    setActiveDetailNote({ ...activeDetailNote, assignee: newAssignee });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="All">All</option>
                  {ALL_MEMBERS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-0.5">Notes & Details:</span>
                <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                  {activeDetailNote.notes || 'No additional notes provided.'}
                </p>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Change preparation status:</label>
                <select
                  value={activeDetailNote.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as NoteStatus;
                    updatePrepNoteStatus(activeDetailNote.id, newStatus);
                    setActiveDetailNote({ ...activeDetailNote, status: newStatus });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="To Schedule">To Schedule</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  const taskToDelete = activeDetailNote;
                  setActiveDetailNote(null);
                  deletePrepNote(taskToDelete.id);
                }}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const taskToEdit = activeDetailNote;
                    setActiveDetailNote(null);
                    openEditModal(taskToEdit);
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setActiveDetailNote(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
