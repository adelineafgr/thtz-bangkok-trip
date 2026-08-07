import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { AccommodationOption } from '../types';
import {
  Calendar,
  Building,
  FileCheck,
  PhoneCall,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calculator,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Camera,
  ThumbsUp
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const {
    currentMember,
    prepNotes,
    wishlist,
    moodboard,
    accommodations,
    voteAccommodation,
    addAccommodation,
    editAccommodation,
    deleteAccommodation,
    essentialDocs,
    toggleDocumentMember,
    addEssentialDoc,
    editEssentialDoc,
    deleteEssentialDoc,
    getKasSummary,
    formatCurrency,
    setActiveTab,
    exchangeRate,
    itinerary
  } = useTrip();

  // Essential Documents expanded state
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Essential Document CRUD Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [docNotice, setDocNotice] = useState('');

  const openAddDocModal = () => {
    setEditingDocId(null);
    setDocName('');
    setDocDescription('');
    setDocNotice('');
    setShowDocModal(true);
  };

  const openEditDocModal = (doc: { id: string; name: string; description: string; criticalNotice?: string }) => {
    setEditingDocId(doc.id);
    setDocName(doc.name);
    setDocDescription(doc.description);
    setDocNotice(doc.criticalNotice || '');
    setShowDocModal(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    if (editingDocId) {
      editEssentialDoc(editingDocId, {
        name: docName,
        description: docDescription,
        criticalNotice: docNotice.trim() || undefined
      });
    } else {
      addEssentialDoc({
        name: docName,
        description: docDescription,
        criticalNotice: docNotice.trim() || undefined
      });
    }
    setShowDocModal(false);
  };

  // Quick Currency Calc
  const [calcAmount, setCalcAmount] = useState<string>('1000');
  const [calcDir, setCalcDir] = useState<'THB_TO_IDR' | 'IDR_TO_THB'>('THB_TO_IDR');

  // Accommodation Detail Modal State
  const [showDetailAccModal, setShowDetailAccModal] = useState(false);
  const [detailAcc, setDetailAcc] = useState<AccommodationOption | null>(null);

  // Logistics / Hotel CRUD Modal State
  const [showAccModal, setShowAccModal] = useState(false);
  const [editingAccId, setEditingAccId] = useState<string | null>(null);

  const [accName, setAccName] = useState('');
  const [accLocation, setAccLocation] = useState('');
  const [accRating, setAccRating] = useState('4.9');
  const [accTotalPriceIDR, setAccTotalPriceIDR] = useState('');
  const [accDetails, setAccDetails] = useState('');
  const [accPros, setAccPros] = useState('');
  const [accCons, setAccCons] = useState('');
  const [accPhoto1, setAccPhoto1] = useState('');
  const [accPhoto2, setAccPhoto2] = useState('');
  const [accPhoto3, setAccPhoto3] = useState('');
  const [accBookingLink, setAccBookingLink] = useState('');

  const kas = getKasSummary();
  const donePrep = prepNotes.filter(p => p.status === 'Done').length;
  const prepProgressPercent = Math.round((donePrep / (prepNotes.length || 1)) * 100);

  // Next upcoming activity from itinerary
  const allActivitiesWithDay = itinerary.flatMap(day =>
    day.activities.map(act => ({
      ...act,
      dayNumber: day.dayNumber,
      dateStr: day.dateStr,
      dayTitle: day.title
    }))
  );
  const nextActivity = allActivitiesWithDay.find(act => !act.isDone) || allActivitiesWithDay[0];

  // Countdown calc to Oct 30, 2026
  const tripDate = new Date('2026-10-30T00:00:00');
  const now = new Date();
  const diffTime = tripDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const convertResult = () => {
    const val = parseFloat(calcAmount) || 0;
    if (calcDir === 'THB_TO_IDR') {
      return `Rp ${Math.round(val * exchangeRate).toLocaleString('id-ID')}`;
    } else {
      return `฿${Math.round(val / exchangeRate).toLocaleString('id-ID')}`;
    }
  };

  const openAddAccModal = () => {
    setEditingAccId(null);
    setAccName('');
    setAccLocation('');
    setAccRating('4.9');
    setAccTotalPriceIDR('');
    setAccDetails('3 bedrooms · 3 beds · 1 bath');
    setAccPros('Lokasi strategis, dekat transportasi');
    setAccCons('Kamar mandi 1');
    setAccPhoto1('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop');
    setAccPhoto2('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop');
    setAccPhoto3('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop');
    setAccBookingLink('');
    setShowAccModal(true);
  };

  const openEditAccModal = (acc: AccommodationOption) => {
    setEditingAccId(acc.id);
    setAccName(acc.name);
    setAccLocation(acc.location);
    setAccRating(acc.rating.toString());
    setAccTotalPriceIDR(acc.totalPriceIDR.toString());
    setAccDetails(acc.details);
    setAccPros(acc.pros.join(', '));
    setAccCons(acc.cons.join(', '));
    setAccPhoto1(acc.photos[0] || '');
    setAccPhoto2(acc.photos[1] || '');
    setAccPhoto3(acc.photos[2] || '');
    setAccBookingLink(acc.bookingLink || '');
    setShowAccModal(true);
  };

  const handleSaveAcc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;

    const totalIDR = parseFloat(accTotalPriceIDR) || 0;
    const perPersonIDR = Math.round(totalIDR / 5 / 5); // 5 people, 5 nights
    const prosArray = accPros.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    const consArray = accCons.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
    const photosArray = [accPhoto1, accPhoto2, accPhoto3].filter(p => p.trim() !== '');

    if (photosArray.length === 0) {
      photosArray.push('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop');
    }

    if (editingAccId) {
      editAccommodation(editingAccId, {
        name: accName,
        location: accLocation,
        rating: parseFloat(accRating) || 4.8,
        totalPriceIDR: totalIDR,
        pricePerNightPerPersonIDR: perPersonIDR,
        details: accDetails,
        pros: prosArray,
        cons: consArray,
        photos: photosArray,
        bookingLink: accBookingLink
      });
    } else {
      addAccommodation({
        name: accName,
        location: accLocation,
        rating: parseFloat(accRating) || 4.8,
        totalPriceIDR: totalIDR,
        pricePerNightPerPersonIDR: perPersonIDR,
        details: accDetails,
        pros: prosArray,
        cons: consArray,
        photos: photosArray,
        bookingLink: accBookingLink
      });
    }

    setShowAccModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.3),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>30 Oct - 04 Nov 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Sawasdee Krub! 🇹🇭
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Plan, budget, and capture ideas for the ultimate 5-day Bangkok trip
            </p>
          </div>

          {/* Countdown Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center min-w-[200px] shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
              Countdown to Trip
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white my-1 font-mono">
              {diffDays > 0 ? `${diffDays} Days` : 'Trip Today!'}
            </div>
            <p className="text-[11px] font-bold text-indigo-200">
              30 Oct - 04 Nov 2026
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Event Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-rose-950 rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-indigo-700/50">
        <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
          <div className="p-3 bg-rose-500/20 border border-rose-400/30 rounded-2xl backdrop-blur-xs flex-shrink-0 text-amber-300">
            <Calendar className="w-6 h-6 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-widest mb-0.5">
              <span>Upcoming Event</span>
              {nextActivity && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-indigo-200">
                  Day {nextActivity.dayNumber} · {nextActivity.time}
                </span>
              )}
            </div>
            {nextActivity ? (
              <div>
                <h4 className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                  {nextActivity.title}
                </h4>
                {nextActivity.locationName && (
                  <p className="text-xs text-indigo-200 font-medium flex items-center space-x-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{nextActivity.locationName}</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h4 className="font-black text-sm sm:text-base tracking-tight text-white">
                  No upcoming activities scheduled
                </h4>
                <p className="text-xs text-indigo-200 font-medium mt-0.5">
                  Start adding events to your Bangkok itinerary!
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setActiveTab('itinerary')}
          className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white text-indigo-950 rounded-2xl text-xs font-black shadow-md hover:bg-rose-50 transition shrink-0 cursor-pointer"
        >
          <span>View Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Kas Budget */}
        <div
          onClick={() => setActiveTab('expenses')}
          className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Shared Pocket</span>
            <div className="p-2 bg-emerald-100 rounded-2xl text-emerald-600 group-hover:scale-105 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-950">
            {formatCurrency(kas.saldoKasTHB, kas.saldoKasIDR)}
          </div>
          <p className="text-[11px] font-medium text-indigo-500 mt-1">
            Target Pemasukan: {formatCurrency(undefined, kas.totalKasInputIDR)}
          </p>
        </div>

        {/* Preparation Checklist */}
        <div
          onClick={() => setActiveTab('prep')}
          className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Prep Notes</span>
            <div className="p-2 bg-amber-100 rounded-2xl text-amber-600 group-hover:scale-105 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-950">
            {donePrep} / {prepNotes.length} <span className="text-xs font-normal text-indigo-400">Done</span>
          </div>
          <div className="w-full bg-indigo-50 rounded-full h-2 mt-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${prepProgressPercent}%` }}
            />
          </div>
          <p className="text-[11px] font-medium text-indigo-500 mt-1.5">
            Getting Ready for Bangkok
          </p>
        </div>

        {/* Wishlist Items */}
        <div
          onClick={() => setActiveTab('wishlist')}
          className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Wishlist Places</span>
            <div className="p-2 bg-rose-100 rounded-2xl text-rose-600 group-hover:scale-105 transition">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-950">
            {wishlist.length} <span className="text-xs font-normal text-indigo-400">Spots</span>
          </div>
          <p className="text-[11px] font-medium text-indigo-500 mt-1">
            Shopping, Cafe, Food & Culture
          </p>
        </div>

        {/* Moodboard / Reels */}
        <div
          onClick={() => setActiveTab('moodboard')}
          className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Moodboard & Reels</span>
            <div className="p-2 bg-sky-100 rounded-2xl text-sky-600 group-hover:scale-105 transition">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-indigo-950">
            {moodboard.length} <span className="text-xs font-normal text-indigo-400">Ideas</span>
          </div>
          <p className="text-[11px] font-medium text-indigo-500 mt-1">
            TikTok, IG Reels & Outfits
          </p>
        </div>
      </div>

      {/* Hotel & Accommodation Comparison Section (Logistics CRUD) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-indigo-950 flex items-center space-x-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <span>Logistics: Hotel & Airbnb Options</span>
            </h3>
            <p className="text-xs text-indigo-400 font-medium">
              Klik card untuk melihat detail lengkap hotel & memberikan vote!
            </p>
          </div>
          
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={openAddAccModal}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-black shadow-xs flex items-center space-x-1 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Option</span>
            </button>
          </div>
        </div>

        {/* Accommodation Cards Grid (Sampai Estimasi Harga) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accommodations.map(acc => {
            const hasVoted = acc.votes.includes(currentMember);
            return (
              <div
                key={acc.id}
                onClick={() => {
                  setDetailAcc(acc);
                  setShowDetailAccModal(true);
                }}
                className={`rounded-3xl border p-4 transition flex flex-col justify-between cursor-pointer hover:shadow-md ${
                  hasVoted ? 'border-indigo-400 bg-indigo-50/40 shadow-sm' : 'border-indigo-100 bg-white hover:border-indigo-300'
                }`}
              >
                <div>
                  {/* Photo Strip */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3 rounded-2xl overflow-hidden h-28 relative">
                    {acc.photos.map((photo, pIdx) => (
                      <img
                        key={pIdx}
                        src={photo}
                        alt={`${acc.name} ${pIdx}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>

                  {/* Title & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-extrabold text-indigo-950 text-sm leading-snug break-words flex items-center gap-1.5">
                        <span>{acc.name}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-black shrink-0">
                          ★ {acc.rating}
                        </span>
                      </h4>
                      <p className="text-xs text-indigo-400 font-medium flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{acc.location}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-indigo-900 mb-3 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100/60">
                    {acc.details}
                  </p>

                  {/* Pricing (sampai estimasi harga aja) */}
                  <div className="bg-indigo-950 text-white p-3.5 rounded-2xl space-y-0.5">
                    <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">Est. Price Per Person</div>
                    <div className="text-base font-black text-amber-300">
                      {formatCurrency(undefined, acc.pricePerNightPerPersonIDR)} <span className="text-[10px] text-indigo-200 font-normal">/ night</span>
                    </div>
                    <div className="text-[10px] text-indigo-300 font-medium">
                      Total: {formatCurrency(undefined, acc.totalPriceIDR)} (5 nights)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Accommodation Modal */}
      {showDetailAccModal && detailAcc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-start justify-between pb-2 border-b border-indigo-100">
              <div>
                <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                  <span>{detailAcc.name}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-black">
                    ★ {detailAcc.rating}
                  </span>
                </h3>
                <p className="text-xs text-indigo-500 font-medium flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{detailAcc.location}</span>
                </p>
              </div>
              <button
                onClick={() => setShowDetailAccModal(false)}
                className="p-1.5 text-indigo-400 hover:text-indigo-950 rounded-full hover:bg-indigo-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden h-32 relative">
              {detailAcc.photos.map((photo, pIdx) => (
                <img
                  key={pIdx}
                  src={photo}
                  alt={`${detailAcc.name} ${pIdx}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>

            <p className="text-xs font-semibold text-indigo-900 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100/60">
              {detailAcc.details}
            </p>

            {/* Pricing */}
            <div className="bg-indigo-950 text-white p-3.5 rounded-2xl space-y-0.5">
              <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">Est. Price Per Person</div>
              <div className="text-base font-black text-amber-300">
                {formatCurrency(undefined, detailAcc.pricePerNightPerPersonIDR)} <span className="text-[10px] text-indigo-200 font-normal">/ night</span>
              </div>
              <div className="text-[10px] text-indigo-300 font-medium">
                Total: {formatCurrency(undefined, detailAcc.totalPriceIDR)} (5 nights)
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="font-extrabold text-emerald-700 block mb-1">PROS (+)</span>
                <ul className="space-y-1 text-slate-700 pl-2 border-l-2 border-emerald-400 font-medium">
                  {detailAcc.pros.map((pro, idx) => (
                    <li key={idx}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-extrabold text-rose-600 block mb-1">CONS (-)</span>
                <ul className="space-y-1 text-slate-700 pl-2 border-l-2 border-rose-400 font-medium">
                  {detailAcc.cons.map((con, idx) => (
                    <li key={idx}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Votes & Actions */}
            <div className="pt-3 border-t border-indigo-100 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    voteAccommodation(detailAcc.id, currentMember);
                    setDetailAcc({
                      ...detailAcc,
                      votes: detailAcc.votes.includes(currentMember)
                        ? detailAcc.votes.filter(v => v !== currentMember)
                        : [...detailAcc.votes, currentMember]
                    });
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center space-x-1.5 transition ${
                    detailAcc.votes.includes(currentMember)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-50 text-indigo-950 hover:bg-rose-500 hover:text-white border border-indigo-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{detailAcc.votes.includes(currentMember) ? 'Voted' : 'Vote This'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const accToEdit = detailAcc;
                    setShowDetailAccModal(false);
                    openEditAccModal(accToEdit);
                  }}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold text-xs flex items-center space-x-1 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${detailAcc.name}"?`)) {
                      deleteAccommodation(detailAcc.id);
                      setShowDetailAccModal(false);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center space-x-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Essential Documents & Currency Converter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Interactive Essential Documents */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Essential Documents</span>
            </h3>
            <button
              onClick={openAddDocModal}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-full shadow-xs flex items-center space-x-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {essentialDocs.map(doc => {
              const readyCount = doc.readyMembers.length;
              const isCurrentMemberReady = doc.readyMembers.includes(currentMember);
              const isExpanded = expandedDocId === doc.id;

              let badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300';
              if (readyCount === 5) {
                badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black';
              } else if (doc.criticalNotice) {
                badgeStyle = 'bg-rose-100 text-rose-900 border-rose-300 font-black';
              }

              return (
                <div
                  key={doc.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isCurrentMemberReady ? 'bg-indigo-50/40 border-indigo-200' : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  {/* Collapsed Header / Name Row */}
                  <div
                    onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-indigo-100/50 transition select-none"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <span className="font-extrabold text-indigo-950 text-xs sm:text-sm truncate">
                        {doc.name}
                      </span>
                      {doc.criticalNotice && (
                        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] bg-rose-100 text-rose-700 font-black uppercase">
                          Notice
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border font-black ${badgeStyle}`}>
                        Ready {readyCount}/5
                      </span>
                      <div className="p-1 text-indigo-400 hover:text-indigo-900">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-indigo-100/80 bg-white/90 space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-indigo-600 text-[11px] font-medium leading-relaxed">
                          {doc.description}
                        </p>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDocModal(doc);
                            }}
                            className="p-1 text-indigo-500 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition"
                            title="Edit document"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete document "${doc.name}"?`)) {
                                deleteEssentialDoc(doc.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {doc.criticalNotice && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-[11px] flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{doc.criticalNotice}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-indigo-400">Your Status:</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDocumentMember(doc.id, currentMember);
                          }}
                          className={`text-[10px] font-extrabold px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                            isCurrentMemberReady
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                          }`}
                        >
                          {isCurrentMemberReady ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{currentMember}: Ready ✓</span>
                            </>
                          ) : (
                            <span>Mark {currentMember} Ready</span>
                          )}
                        </button>
                      </div>

                      {/* Per Member Status Pills */}
                      <div className="pt-2 border-t border-indigo-100/60">
                        <span className="text-[10px] text-indigo-400 font-bold block mb-1.5">All Friends Status:</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {['Dhila', 'Dito', 'Tya', 'Adel', 'Anis'].map(m => {
                            const mReady = doc.readyMembers.includes(m as any);
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDocumentMember(doc.id, m as any);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black transition flex items-center space-x-1 ${
                                  mReady
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-slate-300'
                                }`}
                                title={`Click to toggle readiness for ${m}`}
                              >
                                <span>{m}</span>
                                {mReady ? <span className="text-emerald-700">✓</span> : <span className="text-slate-400">✕</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency Converter Tool */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100/80 shadow-sm space-y-3">
          <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-rose-500" />
            <span>Quick Currency Calculator</span>
          </h3>

          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span>Conversion direction:</span>
              <button
                onClick={() => setCalcDir(calcDir === 'THB_TO_IDR' ? 'IDR_TO_THB' : 'THB_TO_IDR')}
                className="text-indigo-600 hover:text-rose-600 hover:underline flex items-center space-x-1 font-black"
              >
                <span>{calcDir === 'THB_TO_IDR' ? 'THB → IDR' : 'IDR → THB'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs font-black text-indigo-400">
                  {calcDir === 'THB_TO_IDR' ? '฿' : 'Rp'}
                </span>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={e => setCalcAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm font-black text-indigo-950 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  placeholder="Amount"
                />
              </div>

              <span className="text-indigo-400 font-black">=</span>

              <div className="flex-1 px-3 py-2 bg-indigo-950 text-amber-300 rounded-xl text-sm font-black truncate text-right">
                {convertResult()}
              </div>
            </div>

            <p className="text-[10px] font-bold text-indigo-400 text-right">
              Rate: 1 THB = {Math.round(exchangeRate)} IDR
            </p>
          </div>
        </div>

      </div>

      {/* Emergency & Transit Apps */}
      <div className="bg-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base font-black text-amber-300 flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-amber-300" />
          <span>Emergency Contacts & Transit Info</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-rose-300 font-black block mb-0.5">Tourist Police Thailand</span>
            <div className="text-lg font-black text-white">1155</div>
            <p className="text-[10px] text-indigo-200 font-medium">24/7 English/Indonesian Assistance</p>
          </div>

          <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
            <span className="text-rose-300 font-black block mb-0.5">KBRI Bangkok (Embassy)</span>
            <div className="text-sm font-extrabold text-white">+66 2 247 7506</div>
            <p className="text-[10px] text-indigo-200 font-medium">Petchburi Rd, Ratchathewi, Bangkok</p>
          </div>

          <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 sm:col-span-2 lg:col-span-1">
            <span className="text-rose-300 font-black block mb-0.5">Recommended Transit Apps</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold text-white">
                Grab BKK
              </span>
              <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold text-white">
                Bolt Thailand
              </span>
              <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold text-white">
                BTS SkyTrain
              </span>
              <span className="px-2.5 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold text-white">
                ViaBus
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation Modal (Add / Edit) */}
      {showAccModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-indigo-950">
                  {editingAccId ? 'Edit Accommodation Option' : 'Add New Accommodation Option'}
                </h3>
              </div>
              <button
                onClick={() => setShowAccModal(false)}
                className="p-1.5 text-indigo-400 hover:text-indigo-950 rounded-full hover:bg-indigo-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAcc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-indigo-900 mb-1">Hotel / Airbnb Name *</label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={e => setAccName(e.target.value)}
                  placeholder="e.g. Phayathai Pratunam Loft"
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Location / Area</label>
                  <input
                    type="text"
                    value={accLocation}
                    onChange={e => setAccLocation(e.target.value)}
                    placeholder="e.g. Pratunam (Near BTS)"
                    className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Rating (Out of 5)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={accRating}
                    onChange={e => setAccRating(e.target.value)}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">Total Price (IDR for 5 nights) *</label>
                <input
                  type="number"
                  required
                  value={accTotalPriceIDR}
                  onChange={e => setAccTotalPriceIDR(e.target.value)}
                  placeholder="e.g. 6500000"
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="text-[10px] text-indigo-400 mt-0.5">
                  Estimated per person / night: {accTotalPriceIDR ? formatCurrency(undefined, Math.round(parseFloat(accTotalPriceIDR) / 25)) : 'Rp 0'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">Room Details / Layout</label>
                <input
                  type="text"
                  value={accDetails}
                  onChange={e => setAccDetails(e.target.value)}
                  placeholder="e.g. 3 bedrooms · 3 beds · 2 baths"
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1">Pros (+) (comma separated)</label>
                <textarea
                  value={accPros}
                  onChange={e => setAccPros(e.target.value)}
                  placeholder="Near station, spacious room, swimming pool"
                  rows={2}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-800 mb-1">Cons (-) (comma separated)</label>
                <textarea
                  value={accCons}
                  onChange={e => setAccCons(e.target.value)}
                  placeholder="Far from mall, 1 bathroom only"
                  rows={2}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">Photo URLs (3 photos)</label>
                <div className="space-y-1.5">
                  <input
                    type="url"
                    value={accPhoto1}
                    onChange={e => setAccPhoto1(e.target.value)}
                    placeholder="Photo 1 URL"
                    className="w-full px-3 py-1.5 border border-indigo-200 rounded-lg text-xs"
                  />
                  <input
                    type="url"
                    value={accPhoto2}
                    onChange={e => setAccPhoto2(e.target.value)}
                    placeholder="Photo 2 URL"
                    className="w-full px-3 py-1.5 border border-indigo-200 rounded-lg text-xs"
                  />
                  <input
                    type="url"
                    value={accPhoto3}
                    onChange={e => setAccPhoto3(e.target.value)}
                    placeholder="Photo 3 URL"
                    className="w-full px-3 py-1.5 border border-indigo-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">Booking Link (Optional)</label>
                <input
                  type="url"
                  value={accBookingLink}
                  onChange={e => setAccBookingLink(e.target.value)}
                  placeholder="https://airbnb.com/..."
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setShowAccModal(false)}
                  className="px-4 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md"
                >
                  Save Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Essential Document Add/Edit Modal */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100 mb-4">
              <h3 className="text-lg font-black text-indigo-950 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>{editingDocId ? 'Edit Essential Document' : 'Add Essential Document'}</span>
              </h3>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-indigo-900 mb-1">Document Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Passport (Min. 6 Months Validity)"
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">Description / Notes</label>
                <textarea
                  value={docDescription}
                  onChange={e => setDocDescription(e.target.value)}
                  placeholder="Details, requirements, links, or instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-800 mb-1">Critical Notice / Alert (Optional)</label>
                <input
                  type="text"
                  value={docNotice}
                  onChange={e => setDocNotice(e.target.value)}
                  placeholder="e.g. Check expiry date immediately!"
                  className="w-full px-3 py-2 border border-rose-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none text-rose-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-indigo-100">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
