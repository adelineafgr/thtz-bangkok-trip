import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { ItineraryActivity } from '../types';
import {
  Calendar as CalendarIcon,
  CheckSquare,
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
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Clock
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

  // Activity Modal State
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [selectedFormDayNum, setSelectedFormDayNum] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailActivity, setDetailActivity] = useState<ItineraryActivity | null>(null);
  const [detailDayNum, setDetailDayNum] = useState<number>(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItineraryActivity['category']>('Sightseeing');
  const [locationName, setLocationName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [budgetTHB, setBudgetTHB] = useState('');

  // Hourly time slots (00:00 to 24:00) for Calendar View
  const hourlySlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
    '24:00'
  ];

  // Helper to parse time strings (e.g. "8:00am", "08:00", "14:30") to minutes
  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const clean = timeStr.trim().toLowerCase();
    
    const match = clean.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/);
    if (!match) {
      const numOnly = clean.match(/^(\d{1,2})/);
      if (numOnly) {
        let h = parseInt(numOnly[1], 10);
        if (clean.includes('pm') && h < 12) h += 12;
        if (clean.includes('am') && h === 12) h = 0;
        return h * 60;
      }
      return null;
    }

    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3];

    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    return hour * 60 + minute;
  };

  const getActivityTimeDetails = (timeStr: string) => {
    if (!timeStr) return { startHour: 8, startMins: 480, durationHours: 1 };

    let startPart = timeStr;
    let endPart = '';

    if (timeStr.includes('-')) {
      const parts = timeStr.split('-').map(s => s.trim());
      startPart = parts[0] || '';
      endPart = parts[1] || '';
    } else if (timeStr.includes('–')) {
      const parts = timeStr.split('–').map(s => s.trim());
      startPart = parts[0] || '';
      endPart = parts[1] || '';
    }

    let startMins = parseTimeToMinutes(startPart);
    if (startMins === null) startMins = 8 * 60;

    let endMins = parseTimeToMinutes(endPart);
    if (endMins === null || endMins <= startMins) {
      endMins = startMins + 60; // Default 1 hour duration
    }

    const startHour = Math.floor(startMins / 60);
    const durationHours = Math.max(0.5, (endMins - startMins) / 60);

    return { startHour, startMins, endMins, durationHours };
  };

  const getActivityHour = (timeStr: string) => {
    return getActivityTimeDetails(timeStr).startHour;
  };

  const openDetailModal = (dayNum: number, activity: ItineraryActivity) => {
    setDetailDayNum(dayNum);
    setDetailActivity(activity);
    setConfirmDeleteId(null);
    setShowDetailModal(true);
  };

  const openAddModal = (dayNum?: number, defaultTime?: string) => {
    setEditingActivityId(null);
    setSelectedFormDayNum(dayNum || 1);
    setFormError(null);
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
    setFormError(null);
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

  const checkConflict = (dayNum: number, startTimeStr: string, endTimeStr: string, ignoreId?: string | null) => {
    const fullTimeStr = endTimeStr.trim() ? `${startTimeStr.trim()} - ${endTimeStr.trim()}` : startTimeStr.trim();
    const newDetails = getActivityTimeDetails(fullTimeStr);

    if (newDetails.startMins >= newDetails.endMins) {
      return "End time must be after start time.";
    }

    const dayData = itinerary.find(d => d.dayNumber === dayNum);
    if (!dayData) return null;

    for (const act of dayData.activities) {
      if (ignoreId && act.id === ignoreId) continue;

      const existDetails = getActivityTimeDetails(act.time);

      // Overlap condition: newStart < existEnd AND existStart < newEnd
      if (newDetails.startMins < existDetails.endMins && existDetails.startMins < newDetails.endMins) {
        return `Schedule overlaps with "${act.title}" (${act.time}) on Day ${dayNum}. Please choose a different time!`;
      }
    }

    return null;
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const conflictMsg = checkConflict(selectedFormDayNum, time, endTime, editingActivityId);
    if (conflictMsg) {
      setFormError(conflictMsg);
      return;
    }

    setFormError(null);

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

  const getCategoryCardStyle = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food': return 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200 text-rose-950';
      case 'Shopping': return 'bg-purple-50/90 hover:bg-purple-100/90 border-purple-200 text-purple-950';
      case 'OTW': return 'bg-blue-50/90 hover:bg-blue-100/90 border-blue-200 text-blue-950';
      case 'Rest': return 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950';
      case 'Activity': return 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200 text-amber-950';
      default: return 'bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200 text-indigo-950';
    }
  };

  const getCategoryBg = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Shopping': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OTW': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rest': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Activity': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <CheckSquare className="w-4 h-4 text-rose-500" />
            <span>Bangkok Plans</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Our Day-by-Day Itinerary
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            See where we're going, what we're doing, and all the little moments in between.
          </p>
        </div>

        <div>
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-tight rounded-2xl shadow-md flex items-center space-x-1.5 transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* 5-Day Calendar Style Grid View */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-rose-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span className="font-extrabold text-indigo-950 text-xs sm:text-sm">
              Bangkok Itinerary
            </span>
          </div>
        </div>

        {/* Scrollable Grid Container */}
        <div className="overflow-auto max-h-[600px] sm:max-h-[680px] relative border-t border-indigo-100 scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse min-w-[850px] relative">
            
            {/* STICKY TOP HEADER */}
            <thead className="sticky top-0 z-30 shadow-xs">
              <tr className="bg-indigo-900 text-white font-black text-[11px] tracking-tight">
                
                {/* TOP-LEFT CORNER: STICKY TOP-0 & LEFT-0 */}
                <th className="py-3 px-3 w-20 text-center border-r border-b border-indigo-950 bg-indigo-950 text-amber-300 font-black uppercase text-xs tracking-wider whitespace-nowrap sticky top-0 left-0 z-40 shadow-sm select-none">
                  TIME
                </th>

                {/* DAY COLUMNS STICKY TOP */}
                {itinerary.map(day => (
                  <th
                    key={day.dayNumber}
                    className="py-3 px-3 border-r border-b border-indigo-200 last:border-r-0 text-center min-w-[150px] whitespace-nowrap sticky top-0 bg-indigo-50/95 backdrop-blur-md text-indigo-950 z-30 select-none shadow-2xs"
                  >
                    <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-0.5">
                      DAY {day.dayNumber}
                    </div>
                    <div className="text-indigo-950 font-extrabold text-xs">
                      {day.date}
                    </div>
                    <div className="text-[10px] text-indigo-500 font-semibold truncate max-w-[130px] mx-auto mt-0.5">
                      {day.title}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-indigo-100/60 font-medium text-slate-800">
              {hourlySlots.map((slotHourStr) => {
                const slotHour = parseInt(slotHourStr.split(':')[0], 10);

                return (
                  <tr key={slotHourStr} className="hover:bg-indigo-50/20 transition group h-[80px]">
                    
                    {/* FROZEN STICKY TIME SLOT COLUMN (LEFT-0) */}
                    <td className="py-2.5 px-2 w-20 text-center font-bold text-slate-600 bg-slate-50/95 backdrop-blur-md border-r border-b border-slate-200 text-[11px] whitespace-nowrap sticky left-0 z-20 shadow-2xs select-none h-[80px]">
                      {slotHourStr}
                    </td>

                    {/* DAY CELLS */}
                    {itinerary.map(day => {
                      const cellActivities = day.activities.filter(act => {
                        const { startHour } = getActivityTimeDetails(act.time);
                        return startHour === slotHour;
                      });

                      return (
                        <td
                          key={day.dayNumber}
                          className={`border-r border-b border-indigo-100/80 p-0 align-top h-[80px] min-w-[150px] relative transition group/cell ${
                            cellActivities.length === 0 ? 'hover:bg-indigo-50/30 cursor-pointer' : ''
                          }`}
                          onClick={() => cellActivities.length === 0 && openAddModal(day.dayNumber, slotHourStr)}
                        >
                          {/* Hover Quick Add Plus Button - Only if slot is empty */}
                          {cellActivities.length === 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddModal(day.dayNumber, slotHourStr);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-indigo-600 text-white rounded-full shadow-xs hover:scale-110 transition z-30"
                              title="Add activity at this time"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          )}

                          {/* Render Activities */}
                          {cellActivities.map((act, idx) => {
                            const timeDetails = getActivityTimeDetails(act.time);
                            const durationHours = timeDetails.durationHours;
                            const minuteOffset = timeDetails.startMins % 60;
                            const topPx = (minuteOffset / 60) * 80 + 2;
                            const heightPx = Math.max(34, durationHours * 80 - 4);

                            const total = cellActivities.length;
                            const cardPositionStyle: React.CSSProperties = {
                              top: `${topPx}px`,
                              height: `${heightPx}px`,
                              zIndex: 15,
                              ...(total > 1 ? {
                                width: `calc((100% - 8px) / ${total})`,
                                left: `calc(4px + ${idx} * (100% - 8px) / ${total})`
                              } : {
                                left: '4px',
                                right: '4px'
                              })
                            };

                            return (
                              <div
                                key={act.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailModal(day.dayNumber, act);
                                }}
                                style={cardPositionStyle}
                                className={`absolute p-2 rounded-xl border text-xs shadow-xs transition group/card cursor-pointer flex flex-col justify-between overflow-hidden ${
                                  act.isDone ? 'bg-slate-100/95 text-slate-400 border-slate-200 line-through' : getCategoryCardStyle(act.category)
                                }`}
                              >
                                <div>
                                  {/* Title */}
                                  <div className="font-extrabold text-[11px] leading-snug line-clamp-2">
                                    {act.title}
                                  </div>

                                  {/* Notes / Description */}
                                  {act.description && (
                                    <div className="text-[10px] text-slate-600/90 font-medium line-clamp-2 mt-0.5 leading-tight">
                                      {act.description}
                                    </div>
                                  )}
                                </div>

                                {/* Location & Budget if height allows */}
                                {heightPx >= 55 && (
                                  <div className="mt-1 space-y-0.5">
                                    {act.locationName && (
                                      <div className="text-[10px] text-slate-600 flex items-center space-x-1 truncate">
                                        <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                                        <span className="truncate">{act.locationName}</span>
                                      </div>
                                    )}

                                    {act.estimatedBudgetTHB && (
                                      <div className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                                        {formatCurrency(act.estimatedBudgetTHB)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
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

      {/* CREATE / EDIT ACTIVITY MODAL */}
      {showActivityModal && (
        <div
          onClick={() => setShowActivityModal(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-indigo-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingActivityId ? 'Edit Activity' : 'Add Activity'}
              </h3>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              
              {/* Conflict Error Alert */}
              {formError && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-2 text-amber-900 text-xs font-semibold animate-in fade-in duration-150">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="flex-1 leading-snug">{formError}</span>
                </div>
              )}

              {/* Date & Time Field - Mobile Friendly Layout */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date & Time *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <select
                    value={selectedFormDayNum}
                    onChange={(e) => setSelectedFormDayNum(Number(e.target.value))}
                    className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl px-2.5 py-2 outline-none border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    {itinerary.map(d => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Day {d.dayNumber} ({d.date})
                      </option>
                    ))}
                  </select>
                  <div className="col-span-2 flex items-center space-x-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Start (08:00)"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white text-slate-900 text-xs font-bold text-center rounded-xl py-2 outline-none border border-slate-200 font-mono shadow-2xs"
                    />
                    <span className="text-slate-400 font-bold text-xs shrink-0">–</span>
                    <input
                      type="text"
                      placeholder="End (10:00)"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white text-slate-900 text-xs font-bold text-center rounded-xl py-2 outline-none border border-slate-200 font-mono shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lunch at Jay Fai / Chatuchak Market"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItineraryActivity['category'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food">Culinary</option>
                  <option value="Shopping">Shopping</option>
                  <option value="OTW">OTW</option>
                  <option value="Activity">Activity</option>
                  <option value="Rest">Rest</option>
                </select>
              </div>

              {/* Location & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Palace / Iconsiam"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Est. Budget (THB)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 300"
                    value={budgetTHB}
                    onChange={(e) => setBudgetTHB(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Directions, dress code, tickets, or recommended menu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
                >
                  {editingActivityId ? 'Save Changes' : 'Add Activity'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailActivity && (() => {
        const dayInfo = itinerary.find(d => d.dayNumber === detailDayNum);
        return (
          <div
            onClick={() => setShowDetailModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 animate-in zoom-in-95 duration-150"
            >
              
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBg(detailActivity.category)}`}>
                    {detailActivity.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      toggleItineraryActivityDone(detailDayNum, detailActivity.id);
                      setDetailActivity(prev => prev ? { ...prev, isDone: !prev.isDone } : null);
                    }}
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition ${
                      detailActivity.isDone
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {detailActivity.isDone ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3 h-3 text-slate-400" />
                        <span>Mark as Done</span>
                      </>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {detailActivity.title}
                </h3>

                {/* Date & Time Info Box */}
                <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 font-bold text-indigo-950">
                    <CalendarIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Day {detailDayNum} {dayInfo?.date ? `(${dayInfo.date})` : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-200/80 w-fit">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{detailActivity.time}</span>
                  </div>
                </div>

                {detailActivity.description && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                      Notes & Details
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {detailActivity.description}
                    </p>
                  </div>
                )}

              {detailActivity.locationName && (
                <div className="flex items-center space-x-2 text-xs text-slate-700 bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold block">{detailActivity.locationName}</span>
                    {detailActivity.mapsUrl && (
                      <a
                        href={detailActivity.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center space-x-1 mt-0.5"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {detailActivity.estimatedBudgetTHB && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="font-bold text-emerald-900">Estimated Cost:</span>
                  <span className="font-black text-emerald-700">
                    {formatCurrency(detailActivity.estimatedBudgetTHB)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              {confirmDeleteId === detailActivity.id ? (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-rose-900">
                    Delete this activity?
                  </span>
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteItineraryActivity(detailDayNum, detailActivity.id);
                        setShowDetailModal(false);
                        setConfirmDeleteId(null);
                      }}
                      className="px-3 py-1.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(detailActivity.id)}
                    className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDetailModal(false);
                        openEditModal(detailDayNum, detailActivity);
                      }}
                      className="px-4 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center space-x-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        );
      })()}

    </div>
  );
};
