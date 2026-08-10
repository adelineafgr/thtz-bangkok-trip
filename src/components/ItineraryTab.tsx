import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { ItineraryActivity } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  CheckCircle,
  Circle,
  Utensils,
  ShoppingBag,
  Camera,
  Car,
  Coffee,
  Sparkles,
  LayoutGrid,
  ListFilter,
  Pencil,
  Trash2,
  X
} from 'lucide-react';

export const ItineraryTab: React.FC = () => {
  const {
    itinerary,
    addItineraryActivity,
    editItineraryActivity,
    deleteItineraryActivity,
    toggleItineraryActivityDone,
    formatCurrency
  } = useTrip();

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  // Activity Modal State
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [selectedFormDayNum, setSelectedFormDayNum] = useState<number>(1);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailActivity, setDetailActivity] = useState<ItineraryActivity | null>(null);
  const [detailDayNum, setDetailDayNum] = useState<number>(1);

  // Form Fields
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItineraryActivity['category']>('Sightseeing');
  const [locationName, setLocationName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [budgetTHB, setBudgetTHB] = useState('');

  const activeDay = itinerary.find(d => d.dayNumber === selectedDayNum) || itinerary[0];

  // Hourly time slots (07:00 to 23:00) for Google Calendar View
  const hourlySlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    '21:00', '22:00', '23:00'
  ];

  const getActivityHour = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (isNaN(hour)) return 8;
    return hour;
  };

  const openDetailModal = (dayNum: number, activity: ItineraryActivity) => {
    setDetailDayNum(dayNum);
    setDetailActivity(activity);
    setShowDetailModal(true);
  };

  const openAddModal = (dayNum?: number, defaultTime?: string) => {
    setEditingActivityId(null);
    setSelectedFormDayNum(dayNum || selectedDayNum);
    if (defaultTime) {
      setTime(defaultTime);
      const hourNum = parseInt(defaultTime.split(':')[0], 10);
      const endH = hourNum + 1;
      setEndTime(`${endH < 10 ? '0' : ''}${endH}:00`);
    } else {
      setTime('09:00');
      setEndTime('10:00');
    }
    setTitle('');
    setDescription('');
    setCategory('Sightseeing');
    setLocationName('');
    setMapsUrl('');
    setBudgetTHB('');
    setShowActivityModal(true);
  };

  const openEditModal = (dayNum: number, activity: ItineraryActivity) => {
    setEditingActivityId(activity.id);
    setSelectedFormDayNum(dayNum);
    if (activity.time.includes('-')) {
      const parts = activity.time.split('-').map(p => p.trim());
      setTime(parts[0] || '09:00');
      setEndTime(parts[1] || '10:00');
    } else {
      setTime(activity.time);
      setEndTime('');
    }
    setTitle(activity.title);
    setDescription(activity.description || '');
    setCategory(activity.category);
    setLocationName(activity.locationName || '');
    setMapsUrl(activity.mapsUrl || '');
    setBudgetTHB(activity.estimatedBudgetTHB ? String(activity.estimatedBudgetTHB) : '');
    setShowActivityModal(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fullTime = endTime.trim() ? `${time.trim()} - ${endTime.trim()}` : time.trim();

    const payload = {
      time: fullTime,
      title,
      description: description.trim() || undefined,
      category,
      locationName: locationName.trim() || undefined,
      mapsUrl: mapsUrl.trim() || undefined,
      estimatedBudgetTHB: budgetTHB ? parseFloat(budgetTHB) : undefined,
      isDone: false
    };

    if (editingActivityId) {
      editItineraryActivity(selectedFormDayNum, editingActivityId, payload);
    } else {
      addItineraryActivity(selectedFormDayNum, payload);
    }

    setShowActivityModal(false);
  };

  const handleDeleteActivity = (dayNum: number, activityId: string, actTitle: string) => {
    if (window.confirm(`Delete "${actTitle}" from Day ${dayNum}?`)) {
      deleteItineraryActivity(dayNum, activityId);
    }
  };

  const getCategoryIcon = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food':
        return <Utensils className="w-3.5 h-3.5 text-rose-500" />;
      case 'Shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />;
      case 'Transport':
        return <Car className="w-3.5 h-3.5 text-blue-500" />;
      case 'Rest':
        return <Coffee className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Activity':
        return <Camera className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getCategoryBg = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Shopping': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Transport': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rest': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Activity': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <CalendarIcon className="w-4 h-4 text-rose-500" />
            <span>Our Bangkok Adventure</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            THTZ Bangkok Itinerary
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Every place, every meal, every memory.
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* 5-Day Google Calendar Style Table View */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-rose-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <span className="font-extrabold text-indigo-950 text-xs sm:text-sm">
                Bangkok Itinerary
              </span>
            </div>
            <span className="text-[10px] font-bold text-indigo-500 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-2xs">
              30 Oct – 04 Nov 2026
            </span>
          </div>

          <div className="overflow-auto max-h-[550px] sm:max-h-[650px] relative border-t border-indigo-100">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead className="sticky top-0 z-30 bg-indigo-50 border-b border-indigo-200 shadow-2xs">
                <tr className="bg-indigo-900/5 text-indigo-950 font-black uppercase text-[11px] tracking-tight">
                  <th className="py-2.5 px-3 w-16 text-center border-r border-indigo-200 bg-indigo-100 text-indigo-950 font-black uppercase text-[10px] tracking-tight whitespace-nowrap sticky top-0 left-0 z-40 shadow-2xs">
                    Time
                  </th>
                  {itinerary.map(day => (
                    <th key={day.dayNumber} className="py-2.5 px-2 border-r border-indigo-100 last:border-r-0 text-center min-w-[125px] whitespace-nowrap sticky top-0 bg-indigo-50/95 backdrop-blur-md z-30">
                      <div className="text-rose-500 text-[9px] font-black uppercase tracking-wider leading-none mb-0.5">
                        Day {day.dayNumber}
                      </div>
                      <div className="text-indigo-950 font-extrabold text-[11px] leading-tight whitespace-nowrap">
                        {day.date}
                      </div>
                      <div className="text-[9px] text-indigo-400 normal-case font-semibold truncate max-w-[110px] mx-auto leading-none mt-0.5">
                        {day.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100/60 font-medium text-slate-800">
                {hourlySlots.map((slotHourStr) => {
                  const slotHour = parseInt(slotHourStr.split(':')[0], 10);

                  return (
                    <tr key={slotHourStr} className="hover:bg-slate-50/50 transition">
                      {/* Frozen Sticky Time Slot Column */}
                      <td className="py-2 px-2 font-mono font-bold text-[10px] text-indigo-950 bg-indigo-50/95 border-r border-indigo-100 text-center align-top whitespace-nowrap sticky left-0 z-20 shadow-2xs">
                        {slotHourStr}
                      </td>

                      {/* Day Cells */}
                      {itinerary.map((day) => {
                        const dayActivities = day.activities.filter(
                          act => getActivityHour(act.time) === slotHour
                        );

                        return (
                          <td
                            key={day.dayNumber}
                            onClick={() => {
                              if (dayActivities.length === 0) {
                                openAddModal(day.dayNumber, slotHourStr);
                              }
                            }}
                            className="py-1.5 px-2 border-r border-indigo-100/60 last:border-r-0 align-top bg-white/50 hover:bg-indigo-50/30 transition cursor-pointer group/cell relative"
                          >
                            <div className="space-y-1.5 min-h-[32px]">
                              {dayActivities.length === 0 ? (
                                <div className="hidden group-hover/cell:flex items-center justify-center py-1.5 text-[9px] font-bold text-indigo-500 border border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
                                  + {slotHourStr}
                                </div>
                              ) : (
                                dayActivities.map(act => (
                                  <div
                                    key={act.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDetailModal(day.dayNumber, act);
                                    }}
                                    className="p-2 rounded-xl border bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md transition shadow-2xs relative group cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getCategoryBg(act.category)}`}>
                                        {act.category}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleItineraryActivityDone(day.dayNumber, act.id);
                                        }}
                                        className="p-0.5 hover:scale-110 transition"
                                        title={act.isDone ? 'Mark as Not Done' : 'Mark as Done'}
                                      >
                                        {act.isDone ? (
                                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                                        ) : (
                                          <Circle className="w-3.5 h-3.5 text-slate-300 hover:text-emerald-500" />
                                        )}
                                      </button>
                                    </div>

                                    <div className="font-extrabold text-indigo-950 text-xs leading-tight mb-1">
                                      {act.title}
                                    </div>

                                    {act.locationName && (
                                      <div className="flex items-center space-x-1 text-[10px] text-indigo-500 truncate">
                                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                        <span className="truncate">{act.locationName}</span>
                                      </div>
                                    )}

                                    {act.mapsUrl && (
                                      <a
                                        href={act.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-1 text-[9px] font-bold text-amber-700 hover:text-amber-900 inline-flex items-center space-x-0.5"
                                      >
                                        <span>Maps</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modal Add / Edit Activity */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                <span>{editingActivityId ? 'Edit Activity' : 'Add Activity'}</span>
              </h3>
              <button
                onClick={() => setShowActivityModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Date & Time Range</label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  {/* Day Date Selector */}
                  <div className="flex items-center space-x-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs font-extrabold text-slate-800 text-xs">
                    <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <select
                      value={selectedFormDayNum}
                      onChange={e => setSelectedFormDayNum(Number(e.target.value))}
                      className="bg-transparent border-none outline-none focus:ring-0 text-slate-800 font-extrabold cursor-pointer text-xs"
                    >
                      {itinerary.map(d => (
                        <option key={d.dayNumber} value={d.dayNumber}>
                          Day {d.dayNumber} ({d.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time Pill */}
                  <div className="flex items-center space-x-1 bg-white px-2.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-bold text-xs text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <input
                      type="text"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      placeholder="09:00"
                      className="w-16 bg-transparent outline-none font-extrabold text-slate-900 text-center text-xs"
                      required
                    />
                  </div>

                  <span className="text-slate-400 font-black">-</span>

                  {/* End Time Pill */}
                  <div className="flex items-center space-x-1 bg-white px-2.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-bold text-xs text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <input
                      type="text"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      placeholder="10:00"
                      className="w-16 bg-transparent outline-none font-extrabold text-slate-900 text-center text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ItineraryActivity['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-white"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food & Cafe</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Activity">Activity / Workshop</option>
                    <option value="Transport">Transport</option>
                    <option value="Rest">Rest & Relaxation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Lunch at SookSiam Iconsiam"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Details, tips, dresscode..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="e.g. Iconsiam, Charoen Nakhon Rd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Maps URL (Optional)</label>
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={e => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Budget (THB)</label>
                <input
                  type="number"
                  value={budgetTHB}
                  onChange={e => setBudgetTHB(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
                {editingActivityId ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteActivity(selectedFormDayNum, editingActivityId, title);
                      setShowActivityModal(false);
                    }}
                    className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                  >
                    {editingActivityId ? 'Update Activity' : 'Save Activity'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {showDetailModal && detailActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-indigo-100 pb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBg(detailActivity.category)}`}>
                    {detailActivity.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Day {detailDayNum} · {detailActivity.time}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {detailActivity.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailActivity.description && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
                {detailActivity.description}
              </div>
            )}

            {(detailActivity.locationName || detailActivity.mapsUrl) && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-bold text-slate-800 truncate">
                    {detailActivity.locationName || 'Google Maps Location'}
                  </span>
                </div>
                {detailActivity.mapsUrl && (
                  <a
                    href={detailActivity.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] rounded-xl shadow-2xs shrink-0 transition"
                  >
                    <span>Open Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {detailActivity.estimatedBudgetTHB && (
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                <span>Estimated Budget:</span>
                <span className="text-emerald-800 font-black">
                  {formatCurrency(detailActivity.estimatedBudgetTHB)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-indigo-100 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleDeleteActivity(detailDayNum, detailActivity.id, detailActivity.title);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2.5 text-xs font-black text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Activity</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleItineraryActivityDone(detailDayNum, detailActivity.id);
                    setShowDetailModal(false);
                  }}
                  className={`px-3 py-2.5 text-xs font-black rounded-2xl shadow-xs transition flex items-center space-x-1.5 ${
                    detailActivity.isDone
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{detailActivity.isDone ? 'Mark Incomplete' : 'Mark Complete'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(detailDayNum, detailActivity);
                  }}
                  className="px-4 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
