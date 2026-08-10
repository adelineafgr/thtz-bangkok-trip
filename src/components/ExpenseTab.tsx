import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { ExpenseCategory, MemberName, ALL_MEMBERS } from '../types';
import {
  Wallet,
  TrendingDown,
  Plus,
  Trash2,
  Receipt,
  PiggyBank,
  X,
  PlusCircle,
  Calendar,
  FileText
} from 'lucide-react';

export const ExpenseTab: React.FC = () => {
  const {
    expenses,
    kasDeposits,
    addExpense,
    deleteExpense,
    addKasDeposit,
    deleteKasDeposit,
    getKasSummary,
    getMemberSettlements,
    getSettlementInstructions,
    formatCurrency,
    exchangeRate,
    currency
  } = useTrip();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showContrModal, setShowContrModal] = useState(false);

  // Add Expense Form State
  const [item, setItem] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Shopping');
  const [amountTHB, setAmountTHB] = useState('');
  const [amountIDR, setAmountIDR] = useState('');
  const [currencyMode, setCurrencyMode] = useState<'THB' | 'IDR'>('THB');
  const [paidBy, setPaidBy] = useState<'Shared' | 'Shared Pocket' | MemberName>('Shared Pocket');
  const [splitBetween, setSplitBetween] = useState<MemberName[]>(ALL_MEMBERS);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('id-ID'));

  // Add Kas Income Form State
  const [kasSource, setKasSource] = useState<MemberName | 'Bunga Bank' | 'Other / Bonus'>('Aisha');
  const [kasAmountIDR, setKasAmountIDR] = useState('3500000');
  const [kasDate, setKasDate] = useState(new Date().toLocaleDateString('id-ID'));
  const [kasNotes, setKasNotes] = useState('');

  const kas = getKasSummary();
  const settlements = getMemberSettlements();
  const instructions = getSettlementInstructions();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;

    let thbVal = 0;
    let idrVal = 0;

    if (currencyMode === 'THB') {
      thbVal = parseFloat(amountTHB) || 0;
      idrVal = Math.round(thbVal * exchangeRate);
    } else {
      idrVal = parseFloat(amountIDR) || 0;
      thbVal = Math.round(idrVal / exchangeRate);
    }

    addExpense({
      date: date || new Date().toLocaleDateString('id-ID'),
      item,
      category,
      totalTHB: thbVal,
      totalIDR: idrVal,
      paidBy,
      notes,
      splitBetween: splitBetween.length > 0 ? splitBetween : ALL_MEMBERS
    });

    setItem('');
    setAmountTHB('');
    setAmountIDR('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleAddKasDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(kasAmountIDR);
    if (!amt || amt <= 0) return;

    addKasDeposit({
      source: kasSource,
      amountIDR: amt,
      date: kasDate || new Date().toLocaleDateString('id-ID'),
      notes: kasNotes.trim() || (kasSource === 'Bunga Bank' ? 'Bunga Tabungan' : 'Setoran Kas')
    });

    setKasAmountIDR('');
    setKasNotes('');
  };

  const toggleSplitMember = (m: MemberName) => {
    if (splitBetween.includes(m)) {
      if (splitBetween.length > 1) {
        setSplitBetween(splitBetween.filter(x => x !== m));
      }
    } else {
      setSplitBetween([...splitBetween, m]);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <Wallet className="w-4 h-4 text-rose-500" />
            <span>Expense Tracker & Settlement Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Expense Summary
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Track group kas balance and personal payments.
          </p>
        </div>
      </div>

      {/* Kas Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Shared Pocket */}
        <div className="bg-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-2 border border-indigo-900">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-bold">
            <span>Shared Pocket</span>
            <button
              onClick={() => setShowContrModal(true)}
              className="text-[10px] font-black text-amber-300 hover:text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20 transition"
            >
              Edit Kas
            </button>
          </div>
          <div className="text-2xl font-black text-amber-300">
            {formatCurrency(kas.totalKasInputTHB, kas.totalKasInputIDR)}
          </div>
          <p className="text-[11px] text-indigo-300 font-medium">
            Pooled funds from 5 members (Rp 3.500.000 / person)
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {formatCurrency(kas.totalExpensesTHB, kas.totalExpensesIDR)}
          </div>
          <p className="text-[11px] text-slate-500">
            Expenses paid directly using Shared Pocket
          </p>
        </div>

        {/* Balance */}
        <div className="bg-emerald-500 text-white p-5 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
            <span>Balance</span>
            <Wallet className="w-4 h-4 text-emerald-100" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatCurrency(kas.saldoKasTHB, kas.saldoKasIDR)}
          </div>
          <p className="text-[11px] text-emerald-100 font-medium">
            Available funds for upcoming trip activities
          </p>
        </div>

      </div>

      {/* Expense Section */}
      <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-indigo-100/80 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <span>Expense</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-indigo-400 font-bold">
              {expenses.length} Transactions
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Expense</span>
            </button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="p-4 space-y-3 sm:hidden">
          {expenses.length === 0 ? (
            <div className="text-center py-6 text-indigo-300 text-xs italic">
              No expense statement entries yet.
            </div>
          ) : (
            expenses.map(exp => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 block">{exp.date}</span>
                    <h4 className="font-extrabold text-sm text-indigo-950 leading-tight">{exp.item}</h4>
                    {exp.notes && (
                      <p className="text-[11px] text-indigo-400 mt-0.5">{exp.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-2 text-indigo-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] bg-indigo-100/80 text-indigo-900 font-extrabold">
                    {exp.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                      exp.paidBy === 'Shared Pocket' || exp.paidBy === 'Shared'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Paid by {exp.paidBy === 'Shared Pocket' ? 'Shared' : exp.paidBy}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-indigo-100/60 text-xs">
                  <span className="text-[11px] text-indigo-400 font-medium">
                    Split: {exp.splitBetween?.length === 5 ? 'All 5' : exp.splitBetween?.join(', ')}
                  </span>
                  <div className="text-right">
                    <span className="font-black text-indigo-950 block">
                      {currency === 'IDR' ? `Rp ${exp.totalIDR.toLocaleString('id-ID')}` : `฿${exp.totalTHB.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-indigo-50/60 border-b border-indigo-100 text-indigo-400 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expense</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Split For</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 font-bold">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-indigo-300 italic">
                    No expense statement entries yet.
                  </td>
                </tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-indigo-50/30 transition">
                    <td className="py-3.5 px-4 font-mono text-indigo-500 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3.5 px-4 font-black text-indigo-950">
                      {exp.item}
                      {exp.notes && (
                        <span className="block text-[10px] text-indigo-400 font-normal">
                          {exp.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] bg-indigo-100/80 text-indigo-900 font-black">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-indigo-900">
                      {currency === 'IDR' ? `Rp ${exp.totalIDR.toLocaleString('id-ID')}` : `฿${exp.totalTHB.toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                          exp.paidBy === 'Shared Pocket' || exp.paidBy === 'Shared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {exp.paidBy === 'Shared Pocket' ? 'Shared' : exp.paidBy}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[10px] text-indigo-400 font-bold">
                      {exp.splitBetween?.length === 5 ? 'All 5 Friends' : exp.splitBetween?.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 text-indigo-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Expense */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Trip Expense</h3>
            <p className="text-xs text-slate-500 mb-4">
              Record a meal, transport, hotel, or shopping expense paid by Kas or Talangan.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Description *</label>
                <input
                  type="text"
                  value={item}
                  onChange={e => setItem(e.target.value)}
                  placeholder="e.g. DP Pace Shoes / Lunch Pad Thai"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Activity">Activity / Ticket</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency Mode</label>
                  <div className="flex border border-slate-300 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('THB')}
                      className={`flex-1 py-2 font-bold transition ${
                        currencyMode === 'THB' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600'
                      }`}
                    >
                      THB (฿)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyMode('IDR')}
                      className={`flex-1 py-2 font-bold transition ${
                        currencyMode === 'IDR' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600'
                      }`}
                    >
                      IDR (Rp)
                    </button>
                  </div>
                </div>
              </div>

              {currencyMode === 'THB' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount in THB (฿) *</label>
                  <input
                    type="number"
                    value={amountTHB}
                    onChange={e => setAmountTHB(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                  {amountTHB && (
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      ≈ Rp {Math.round((parseFloat(amountTHB) || 0) * exchangeRate).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount in IDR (Rp) *</label>
                  <input
                    type="number"
                    value={amountIDR}
                    onChange={e => setAmountIDR(e.target.value)}
                    placeholder="e.g. 1122243"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                  {amountIDR && (
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      ≈ ฿{Math.round((parseFloat(amountIDR) || 0) / exchangeRate).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paid By *</label>
                <select
                  value={paidBy}
                  onChange={e => setPaidBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  <option value="Shared">Shared</option>
                  {ALL_MEMBERS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Split Between (Beneficiaries):</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_MEMBERS.map(m => {
                    const isSelected = splitBetween.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleSplitMember(m)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? 'bg-slate-900 text-amber-400 border border-slate-800'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {m} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Receipt Info</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Receipt saved on WhatsApp..."
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
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kas Income & Contributions */}
      {showContrModal && (
        <div
          onClick={() => setShowContrModal(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center space-x-2">
                <PiggyBank className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-indigo-950">
                  Shared Kas Income & Deposits
                </h3>
              </div>
              <button
                onClick={() => setShowContrModal(false)}
                className="p-1.5 text-indigo-400 hover:text-indigo-950 rounded-full hover:bg-indigo-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-indigo-600/80 font-medium leading-relaxed">
              Catat pemasukan kas kelompok. Pilih sumber (anggota, bunga bank, atau bonus) beserta tanggal & nominal setoran.
            </p>

            {/* Income Entries Table */}
            <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-indigo-950 px-1">
                <span>Daftar Pemasukan Kas</span>
                <span className="text-amber-600">Total: Rp {kas.totalKasInputIDR.toLocaleString('id-ID')}</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {kasDeposits.length === 0 ? (
                  <div className="text-center py-4 text-indigo-300 italic">Belum ada catatan setoran kas.</div>
                ) : (
                  kasDeposits.map(dep => (
                    <div key={dep.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            dep.source === 'Bunga Bank'
                              ? 'bg-emerald-100 text-emerald-800'
                              : dep.source === 'Other / Bonus'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {dep.source}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400">{dep.date}</span>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-900 mt-0.5">{dep.notes}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-black text-indigo-950">
                          Rp {dep.amountIDR.toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => deleteKasDeposit(dep.id)}
                          className="p-1 text-indigo-300 hover:text-rose-600 transition"
                          title="Hapus setoran"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Form to Add New Kas Deposit */}
            <form onSubmit={handleAddKasDepositSubmit} className="bg-white p-4 rounded-2xl border border-indigo-200 space-y-3 text-xs">
              <h4 className="font-extrabold text-indigo-950 flex items-center space-x-1.5">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Tambah Pemasukan / Setoran Kas Baru</span>
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Sumber Pemasukan *</label>
                  <select
                    value={kasSource}
                    onChange={e => setKasSource(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-xl font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    {ALL_MEMBERS.map(m => (
                      <option key={m} value={m}>{m} (Setoran Kas)</option>
                    ))}
                    <option value="Bunga Bank">Bunga Bank</option>
                    <option value="Other / Bonus">Other / Bonus / Cashback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Nominal (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={kasAmountIDR}
                    onChange={e => setKasAmountIDR(e.target.value)}
                    placeholder="e.g. 3500000"
                    className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-xl font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Tanggal *</label>
                  <input
                    type="text"
                    required
                    value={kasDate}
                    onChange={e => setKasDate(e.target.value)}
                    placeholder="01/08/2026"
                    className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Catatan / Keterangan</label>
                  <input
                    type="text"
                    value={kasNotes}
                    onChange={e => setKasNotes(e.target.value)}
                    placeholder="e.g. Setoran Kas Tahap 1"
                    className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                >
                  + Simpan Setoran Kas
                </button>
              </div>
            </form>

            <div className="flex justify-end pt-2 border-t border-indigo-100">
              <button
                onClick={() => setShowContrModal(false)}
                className="px-5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
