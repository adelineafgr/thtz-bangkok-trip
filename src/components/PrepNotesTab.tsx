import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { RandomNote, RandomNoteCategory, NoteColor, MemberName, ALL_MEMBERS } from '../types';
import {
  FileText,
  Plus,
  Pin,
  Search,
  Trash2,
  Pencil,
  Tag,
  X,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';

export const NotesTab: React.FC = () => {
  const {
    randomNotes,
    addRandomNote,
    editRandomNote,
    deleteRandomNote,
    togglePinRandomNote,
    toggleCompleteRandomNote,
    currentMember
  } = useTrip();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<RandomNoteCategory>('General');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [author, setAuthor] = useState<MemberName>(currentMember);
  const [assignee, setAssignee] = useState<MemberName | 'All'>('All');
  const [reminderDate, setReminderDate] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const colorOptions: { key: NoteColor; label: string; bgClass: string; borderClass: string }[] = [
    { key: 'yellow', label: 'Pastel Yellow', bgClass: 'bg-amber-100', borderClass: 'border-amber-300' },
    { key: 'pink', label: 'Pastel Pink', bgClass: 'bg-rose-100', borderClass: 'border-rose-300' },
    { key: 'blue', label: 'Pastel Blue', bgClass: 'bg-sky-100', borderClass: 'border-sky-300' },
    { key: 'green', label: 'Pastel Green', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-300' },
    { key: 'purple', label: 'Pastel Purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-300' },
    { key: 'amber', label: 'Pastel Orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-300' }
  ];

  const openAddModal = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setColor('yellow');
    setAuthor(currentMember);
    setAssignee('All');
    setReminderDate('');
    setIsPinned(false);
    setIsCompleted(false);
    setTagsInput('');
    setShowModal(true);
  };

  const openEditModal = (note: RandomNote) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setColor(note.color || 'yellow');
    setAuthor(note.author);
    setAssignee(note.assignee || 'All');
    setReminderDate(note.reminderDate || '');
    setIsPinned(!!note.isPinned);
    setIsCompleted(!!note.isCompleted);
    setTagsInput(note.tags ? note.tags.join(', ') : '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const notePayload = {
      title: title.trim(),
      content: content.trim(),
      category,
      color,
      author,
      assignee,
      reminderDate: reminderDate ? reminderDate : undefined,
      isPinned,
      isCompleted,
      tags: parsedTags
    };

    if (editingNoteId) {
      editRandomNote(editingNoteId, notePayload);
    } else {
      addRandomNote(notePayload);
    }

    setShowModal(false);
  };

  // Metrics
  const totalCount = randomNotes.length;
  const pinnedCount = randomNotes.filter(n => n.isPinned).length;
  const tasksCount = randomNotes.filter(n => n.category === 'Tasks & To-Do' || n.isCompleted !== undefined).length;
  const completedTasksCount = randomNotes.filter(n => n.isCompleted).length;
  const reminderCount = randomNotes.filter(n => !!n.reminderDate).length;

  // Filtering
  const filteredNotes = randomNotes.filter(n => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.content.toLowerCase().includes(term) ||
      n.category.toLowerCase().includes(term) ||
      n.author.toLowerCase().includes(term) ||
      (n.assignee && n.assignee.toLowerCase().includes(term)) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(term)))
    );
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const getCardStyle = (c: NoteColor) => {
    switch (c) {
      case 'yellow':
        return 'bg-amber-50/90 border-amber-200/90 text-amber-950 hover:border-amber-300';
      case 'pink':
        return 'bg-rose-50/90 border-rose-200/90 text-rose-950 hover:border-rose-300';
      case 'blue':
        return 'bg-sky-50/90 border-sky-200/90 text-sky-950 hover:border-sky-300';
      case 'green':
        return 'bg-emerald-50/90 border-emerald-200/90 text-emerald-950 hover:border-emerald-300';
      case 'purple':
        return 'bg-purple-50/90 border-purple-200/90 text-purple-950 hover:border-purple-300';
      case 'amber':
        return 'bg-orange-50/90 border-orange-200/90 text-orange-950 hover:border-orange-300';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  const getCategoryBadgeStyle = (cat: RandomNoteCategory) => {
    switch (cat) {
      case 'Tasks & To-Do':
        return 'bg-rose-200/90 text-rose-950 font-black';
      case 'Emergency & Contacts':
        return 'bg-red-200/90 text-red-950 font-black';
      case 'Tips & Packing':
        return 'bg-sky-200/90 text-sky-950 font-bold';
      case 'Ideas':
        return 'bg-purple-200/90 text-purple-950 font-bold';
      case 'Food & Places':
        return 'bg-amber-200/90 text-amber-950 font-bold';
      case 'Documents & Bookings':
        return 'bg-emerald-200/90 text-emerald-950 font-bold';
      default:
        return 'bg-indigo-100/90 text-indigo-950 font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4 text-rose-500" />
            <span>Notes, Ideas & Task Reminders</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Group Notes & To-Do Scratchpad
          </h2>
          <p className="text-xs text-indigo-400 font-medium max-w-2xl">
            Keep all group notes, emergency contacts, packing tips, outfit color palettes, and trip prep tasks with optional reminder dates in one place.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-900 font-bold rounded-xl border border-indigo-100 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span><strong>{totalCount}</strong> Total Notes</span>
            </span>

            <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold rounded-xl border border-amber-200/80 flex items-center space-x-1">
              <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span><strong>{pinnedCount}</strong> Pinned</span>
            </span>

            <span className="px-2.5 py-1 bg-sky-50 text-sky-900 font-bold rounded-xl border border-sky-200/80 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span><strong>{reminderCount}</strong> Reminders</span>
            </span>

            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-emerald-200/80 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span><strong>{completedTasksCount}</strong>/<strong>{tasksCount}</strong> Tasks Done</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-start lg:self-center">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-tight rounded-2xl shadow-md flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Note / Task</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Search keywords, titles, categories, authors, tasks, or tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-indigo-50/50 border border-indigo-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950 placeholder-indigo-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-black text-amber-600 uppercase tracking-wider">
            <Pin className="w-4 h-4 fill-amber-500 text-amber-600 transform -rotate-45" />
            <span>Pinned Notes & Tasks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openEditModal(note)}
                onDelete={() => deleteRandomNote(note.id)}
                onTogglePin={() => togglePinRandomNote(note.id)}
                onToggleComplete={() => toggleCompleteRandomNote(note.id)}
                cardStyle={getCardStyle(note.color)}
                categoryBadgeStyle={getCategoryBadgeStyle(note.category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && otherNotes.length > 0 && (
          <div className="flex items-center space-x-2 text-xs font-black text-indigo-400 uppercase tracking-wider pt-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>All Other Notes & Tasks</span>
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-indigo-100 p-8 text-center space-y-3">
            <FileText className="w-8 h-8 text-indigo-300 mx-auto" />
            <p className="text-sm font-bold text-indigo-900">No matching notes or tasks found</p>
            <p className="text-xs text-indigo-400">
              Try adjusting your search terms, author, or category filters.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-rose-500 text-white text-xs font-black rounded-2xl shadow-sm hover:bg-rose-600 transition"
            >
              + Create New Note or Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openEditModal(note)}
                onDelete={() => deleteRandomNote(note.id)}
                onTogglePin={() => togglePinRandomNote(note.id)}
                onToggleComplete={() => toggleCompleteRandomNote(note.id)}
                cardStyle={getCardStyle(note.color)}
                categoryBadgeStyle={getCategoryBadgeStyle(note.category)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Add / Edit Note */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-indigo-100 animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>{editingNoteId ? 'Edit Note / Task' : 'Add New Note / Task'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-indigo-400 hover:text-indigo-900 hover:bg-indigo-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-indigo-900 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Emergency Contacts, Flight Booking Deadline, TukTuk Tips"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950"
                />
              </div>

              {/* Category & Author Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as RandomNoteCategory)}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950"
                  >
                    <option value="General">General</option>
                    <option value="Tasks & To-Do">Tasks & To-Do</option>
                    <option value="Emergency & Contacts">Emergency & Contacts</option>
                    <option value="Tips & Packing">Tips & Packing</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Food & Places">Food & Places</option>
                    <option value="Documents & Bookings">Documents & Bookings</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Author</label>
                  <select
                    value={author}
                    onChange={e => setAuthor(e.target.value as MemberName)}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-indigo-950"
                  >
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reminder Date (OPTIONAL) & Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reminder Date</span>
                    </span>
                    <span className="text-[10px] text-indigo-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={e => setReminderDate(e.target.value)}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-indigo-900 mb-1 flex items-center justify-between">
                    <span>Assignee</span>
                    <span className="text-[10px] text-indigo-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value as MemberName | 'All')}
                    className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950"
                  >
                    <option value="All">All Members</option>
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block font-bold text-indigo-900 mb-1">Content / Details *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type note details, bullet points, phone numbers, or task steps..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950 leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-indigo-900 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Emergency, Booking, Hotel, Packing"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-indigo-950"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block font-bold text-indigo-900 mb-1.5">Card Color</label>
                <div className="flex items-center space-x-3">
                  {colorOptions.map(c => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setColor(c.key)}
                      className={`w-7 h-7 rounded-full border-2 transition transform ${c.bgClass} ${c.borderClass} ${
                        color === c.key ? 'scale-110 ring-2 ring-rose-500 shadow-xs' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Checkboxes: Pin & Complete */}
              <div className="flex items-center space-x-6 pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pinNote"
                    checked={isPinned}
                    onChange={e => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-rose-500 border-indigo-200 rounded-md focus:ring-rose-400 cursor-pointer"
                  />
                  <label htmlFor="pinNote" className="font-bold text-indigo-950 cursor-pointer flex items-center space-x-1">
                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pin to Top</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="completedNote"
                    checked={isCompleted}
                    onChange={e => setIsCompleted(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-indigo-200 rounded-md focus:ring-emerald-400 cursor-pointer"
                  />
                  <label htmlFor="completedNote" className="font-bold text-indigo-950 cursor-pointer flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Completed Task</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

interface NoteCardProps {
  note: RandomNote;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleComplete: () => void;
  cardStyle: string;
  categoryBadgeStyle: string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleComplete,
  cardStyle,
  categoryBadgeStyle
}) => {
  return (
    <div className={`p-4 sm:p-5 rounded-3xl border shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-3 relative group ${cardStyle} ${
      note.isCompleted ? 'opacity-85' : ''
    }`}>
      
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-tight ${categoryBadgeStyle}`}>
              {note.category}
            </span>

            {note.assignee && note.assignee !== 'All' && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-100/90 text-indigo-900">
                Assigned: {note.assignee}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={onTogglePin}
              title={note.isPinned ? 'Unpin' : 'Pin to Top'}
              className={`p-1 rounded-lg transition ${
                note.isPinned
                  ? 'text-amber-600 bg-amber-200/60'
                  : 'text-indigo-300 hover:text-indigo-600 hover:bg-white/60'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-600 transform -rotate-45' : ''}`} />
            </button>
            
            <button
              onClick={onEdit}
              title="Edit Note"
              className="p-1 rounded-lg text-indigo-400 hover:text-indigo-800 hover:bg-white/60 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onDelete}
              title="Delete Note"
              className="p-1 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100/60 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title + Checkbox Toggle */}
        <div className="flex items-start space-x-2 mb-1.5">
          <button
            onClick={onToggleComplete}
            title={note.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            className="mt-0.5 text-indigo-400 hover:text-emerald-600 transition shrink-0 cursor-pointer"
          >
            {note.isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            ) : (
              <Circle className="w-4 h-4 text-indigo-300 hover:text-emerald-500" />
            )}
          </button>

          <h4 className={`text-sm sm:text-base font-black tracking-tight leading-snug ${
            note.isCompleted ? 'line-through text-indigo-900/60' : 'text-indigo-950'
          }`}>
            {note.title}
          </h4>
        </div>

        {/* Reminder Date Badge (OPTIONAL) */}
        {note.reminderDate && (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-white/80 text-rose-700 border border-rose-200/80 mb-2 shadow-2xs">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Reminder: {note.reminderDate}</span>
          </div>
        )}

        {/* Content */}
        <p className={`text-xs font-medium whitespace-pre-line leading-relaxed ${
          note.isCompleted ? 'text-indigo-900/60' : 'text-indigo-900/90'
        }`}>
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-3">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/70 text-indigo-900 border border-indigo-100/80 flex items-center space-x-0.5"
              >
                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-indigo-900/10 flex items-center justify-between text-[10px] text-indigo-950/70 font-semibold">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>By <strong className="font-black">{note.author}</strong></span>
        </span>
        <span className="opacity-70">{note.createdAt}</span>
      </div>

    </div>
  );
};
