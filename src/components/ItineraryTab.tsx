import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { ItineraryActivity } from '../types';
import {
  Calendar as CalendarIcon,
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

  // Hourly time slots (06:00 to 23:00) for Calendar View
  const hourlySlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
    '21:00', '22:00', '23:00'
  ];

  const getActivityHour = (timeStr: string) => {
    if (!timeStr) return 8;
    const cleanStr = timeStr.trim();
    const match = cleanStr.match(/^(\d{1,2})[:.]/);
    if (match) {
      const hour = parseInt(match[1], 10);
      if (!isNaN(hour)) return hour;
    }
    const fallbackHour = parseInt(cleanStr, 10);
    return isNaN(fallbackHour) ? 8 : fallbackHour;
  };

  const openDetailModal = (dayNum: number, activity: ItineraryActivity) => {
    setDetailDayNum(dayNum);
    setDetailActivity(activity);
    setShowDetailModal(true);
  };

  const openAddModal = (dayNum?: number, defaultTime?: string) => {
    setEditingActivityId(null);
    setSelectedFormDayNum(dayNum || 1);
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
    if (window.confirm(`Hapus "${actTitle}" dari Day ${dayNum}?`)) {
      deleteItineraryActivity(dayNum, activityId);
    }
  };

  const getCategoryCardStyle = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food': return 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-200 text-rose-950';
      case 'Shopping': return 'bg-purple-50/90 hover:bg-purple-100/90 border-purple-200 text-purple-950';
      case 'Transport': return 'bg-blue-50/90 hover:bg-blue-100/90 border-blue-200 text-blue-950';
      case 'Rest': return 'bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950';
      case 'Activity': return 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-200 text-amber-950';
      default: return 'bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200 text-indigo-950';
    }
  };

  const getCategoryBg = (cat: ItineraryActivity['category']) => {
    switch (cat) {
      case 'Food': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Shopping': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Transport': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rest': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Activity': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <CalendarIcon className="w-4 h-4 text-rose-500" />
            <span>Bangkok Trip Itinerary</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Agenda & Jadwal Kegiatan
          </h2>
        </div>

        <div>
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-tight rounded-2xl shadow-md flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* 5-Day Calendar Style Table View */}
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
                <th className="py-3 px-3 w-15 text-center border-r border-b border-indigo-950 bg-indigo-950 text-amber-300 font-extrabold uppercase text-[10px] tracking-wider whitespace-nowrap sticky top-0 left-0 z-40 shadow-sm select-none">
                  TIME
                  <div className="text-[9px] text-indigo-300 font-normal capitalize">Jam</div>
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
                  <tr key={slotHourStr} className="hover:bg-indigo-50/20 transition group">
                    
                    {/* FROZEN STICKY TIME SLOT COLUMN (LEFT-0) */}
                    <td className="py-2.5 px-2 w-20 text-center font-bold text-slate-600 bg-slate-50/95 backdrop-blur-md border-r border-b border-slate-200 text-[11px] whitespace-nowrap sticky left-0 z-20 shadow-2xs select-none">
                      {slotHourStr}
                    </td>

                    {/* DAY CELLS */}
                    {itinerary.map(day => {
                      const cellActivities = day.activities.filter(act => {
                        const actHour = getActivityHour(act.time);
                        return actHour === slotHour;
                      });

                      return (
                        <td
                          key={day.dayNumber}
                          className="border-r border-b border-indigo-100/80 p-1.5 align-top h-24 min-w-[150px] relative hover:bg-indigo-50/30 transition cursor-pointer group/cell"
                          onClick={() => openAddModal(day.dayNumber, slotHourStr)}
                        >
                          {/* Hover Quick Add Plus Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddModal(day.dayNumber, slotHourStr);
                            }}
                            className="absolute top-1 right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-indigo-600 text-white rounded-full shadow-xs hover:scale-110 transition z-10"
                            title="Tambah aktivitas di jam ini"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                          </button>

                          {/* Render Activities */}
                          <div className="space-y-1.5">
                            {cellActivities.map((act) => (
                              <div
                                key={act.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailModal(day.dayNumber, act);
                                }}
                                className={`p-2 rounded-xl border text-xs shadow-2xs transition relative group/card cursor-pointer ${
                                  act.isDone ? 'bg-slate-100 text-slate-400 border-slate-200 line-through' : getCategoryCardStyle(act.category)
                                }`}
                              >
                                {/* Top Row: Time & Category */}
                                <div className="flex items-center justify-between text-[10px] font-bold mb-0.5 gap-1">
                                  <span className="font-mono text-slate-700 bg-white/70 px-1.5 py-0.2 rounded border border-black/5">
                                    {act.time}
                                  </span>
                                </div>

                                {/* Title */}
                                <div className="font-extrabold text-[11px] leading-snug line-clamp-2">
                                  {act.title}
                                </div>

                                {/* Location & Budget */}
                                {act.locationName && (
                                  <div className="text-[10px] text-slate-600 flex items-center space-x-1 mt-1 truncate">
                                    <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                                    <span className="truncate">{act.locationName}</span>
                                  </div>
                                )}

                                {act.estimatedBudgetTHB && (
                                  <div className="mt-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                                    {formatCurrency(act.estimatedBudgetTHB)}
                                  </div>
                                )}
                              </div>
                            ))}
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

      {/* CREATE / EDIT ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900">
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

            <form onSubmit={handleSaveActivity} className="space-y-4">
              
              {/* Day Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hari Ke- / Date
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {itinerary.map(d => (
                    <button
                      type="button"
                      key={d.dayNumber}
                      onClick={() => setSelectedFormDayNum(d.dayNumber)}
                      className={`py-2 text-xs font-black rounded-xl border transition ${
                        selectedFormDayNum === d.dayNumber
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Day {d.dayNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Mulai *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="text"
                    placeholder="10:30"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Makan Siang di Jay Fai / Chatuchak Market"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItineraryActivity['category'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food">Food / Culinary</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Activity">Activity / Experience</option>
                  <option value="Rest">Rest / Hotel</option>
                </select>
              </div>

              {/* Location & Maps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Grand Palace / Iconsiam"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Est. Budget (THB)
                  </label>
                  <input
                    type="number"
                    placeholder="300"
                    value={budgetTHB}
                    onChange={(e) => setBudgetTHB(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruksi jalan, dresscode, tiket, atau menu yang disarankan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
                >
                  {editingActivityId ? 'Simpan Perubahan' : 'Add Activity'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && detailActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 font-mono font-bold text-xs rounded-md">
                  {detailActivity.time}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryBg(detailActivity.category)}`}>
                  {detailActivity.category}
                </span>
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

              {detailActivity.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed">
                  {detailActivity.description}
                </p>
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
                        <span>Buka di Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {detailActivity.estimatedBudgetTHB && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="font-bold text-emerald-900">Estimasi Biaya:</span>
                  <span className="font-black text-emerald-700">
                    {formatCurrency(detailActivity.estimatedBudgetTHB)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleDeleteActivity(detailDayNum, detailActivity.id, detailActivity.title);
                  setShowDetailModal(false);
                }}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
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

          </div>
        </div>
      )}

    </div>
  );
};
