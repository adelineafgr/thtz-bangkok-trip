import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { ExpenseCategory, MemberName, ALL_MEMBERS } from '../types';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Plus,
  ArrowRightLeft,
  Users,
  Sparkles,
  Trash2,
  DollarSign,
  PieChart,
  HelpCircle,
  Receipt
} from 'lucide-react';

export const ExpenseTab: React.FC = () => {
  const {
    expenses,
    contributions,
    addExpense,
    deleteExpense,
    updateContribution,
    getKasSummary,
    getMemberSettlements,
    getSettlementInstructions,
    formatCurrency,
    exchangeRate,
    currency,
    currentMember
  } = useTrip();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showContrModal, setShowContrModal] = useState(false);

  // Add Expense Form State
  const [item, setItem] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Shopping');
  const [amountTHB, setAmountTHB] = useState('');
  const [amountIDR, setAmountIDR] = useState('');
  const [currencyMode, setCurrencyMode] = useState<'THB' | 'IDR'>('THB');
  const [paidBy, setPaidBy] = useState<'Shared Pocket' | MemberName>('Shared Pocket');
  const [splitBetween, setSplitBetween] = useState<MemberName[]>(ALL_MEMBERS);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('id-ID'));

  // Edit Contributions state
  const [tempContr, setTempContr] = useState<{ [key in MemberName]: string }>({
    Abit: (contributions.find(c => c.memberName === 'Abit')?.totalDebitIDR || 3500000).toString(),
    Aisha: (contributions.find(c => c.memberName === 'Aisha')?.totalDebitIDR || 3500000).toString(),
    Alin: (contributions.find(c => c.memberName === 'Alin')?.totalDebitIDR || 3500000).toString(),
    Bila: (contributions.find(c => c.memberName === 'Bila')?.totalDebitIDR || 3500000).toString(),
    Risha: (contributions.find(c => c.memberName === 'Risha')?.totalDebitIDR || 3500000).toString()
  });

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

  const handleSaveContributions = () => {
    ALL_MEMBERS.forEach(m => {
      const val = parseFloat(tempContr[m]) || 0;
      updateContribution(m, val);
    });
    setShowContrModal(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-indigo-100/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-500 uppercase tracking-widest mb-1">
            <Wallet className="w-4 h-4 text-rose-500" />
            <span>Expense Tracker & Settlement Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Shared Pocket & Talangan Calculator
          </h2>
          <p className="text-xs text-indigo-400 font-medium">
            Track group Kas balance, individual payments, out-of-pocket expenses (talangan), and who owes whom.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-tight rounded-full shadow-md flex items-center space-x-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Kas Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Debit / Kas Input */}
        <div className="bg-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-2 border border-indigo-900">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-bold">
            <span>Total Debit (Pemasukan Kas)</span>
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

        {/* Total Kredit / Group Expense */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Kas Expenses (Pengeluaran)</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {formatCurrency(kas.totalExpensesTHB, kas.totalExpensesIDR)}
          </div>
          <p className="text-[11px] text-slate-500">
            Expenses paid directly using Shared Pocket
          </p>
        </div>

        {/* Remaining Kas Balance */}
        <div className="bg-emerald-500 text-white p-5 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
            <span>Saldo Akhir Kas</span>
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

      {/* Personal Payment & Talangan Matrix Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Personal Payment & Talangan Summary</span>
            </h3>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">
              Breakdown of Kas contribution, out-of-pocket payments (Talangan), and net balance per member.
            </p>
          </div>
        </div>

        {/* Mobile View Cards */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {settlements.map(s => {
            const isPositive = s.netBalanceIDR >= 0;
            return (
              <div
                key={s.memberName}
                className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-indigo-950 flex items-center space-x-1.5">
                    <span>{s.memberName}</span>
                    {s.memberName === currentMember && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">You</span>
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                      isPositive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isPositive ? '+' : ''}{formatCurrency(s.netBalanceIDR / exchangeRate, s.netBalanceIDR)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-indigo-100/60">
                  <div>
                    <span className="text-indigo-400 text-[10px] font-bold block uppercase">Kas Debit</span>
                    <span className="font-extrabold text-indigo-900">{formatCurrency(s.totalDebitIDR / exchangeRate, s.totalDebitIDR)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 text-[10px] font-bold block uppercase">Talangan</span>
                    <span className="font-extrabold text-amber-700">{formatCurrency(s.totalTalanganIDR / exchangeRate, s.totalTalanganIDR)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-400 text-[10px] font-bold block uppercase">Fair Share</span>
                    <span className="font-extrabold text-indigo-700">{formatCurrency(s.fairShareIDR / exchangeRate, s.fairShareIDR)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-indigo-50/60 border-b border-indigo-100 text-indigo-400 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Total Debit (Kas)</th>
                <th className="py-3 px-4">Total Kredit (Talangan)</th>
                <th className="py-3 px-4">Fair Share Expenses</th>
                <th className="py-3 px-4">Selisih (Net Settlement)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 font-bold">
              {settlements.map(s => {
                const isPositive = s.netBalanceIDR >= 0;
                return (
                  <tr key={s.memberName} className="hover:bg-indigo-50/30 transition">
                    <td className="py-3.5 px-4 font-black text-indigo-950">
                      {s.memberName} {s.memberName === currentMember ? ' (You)' : ''}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-900">
                      {formatCurrency(s.totalDebitIDR / exchangeRate, s.totalDebitIDR)}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700">
                      {formatCurrency(s.totalTalanganIDR / exchangeRate, s.totalTalanganIDR)}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600">
                      {formatCurrency(s.fairShareIDR / exchangeRate, s.fairShareIDR)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? '+' : ''}{formatCurrency(s.netBalanceIDR / exchangeRate, s.netBalanceIDR)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart "Settle Up" Guide */}
      {instructions.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <ArrowRightLeft className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold">Settlement Plan (Who Pays Whom)</h3>
          </div>
          <p className="text-xs text-slate-600">
            Simplified transfers to balance out all group expenses & talangan payments:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {instructions.map((inst, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-rose-700">{inst.from}</span>
                  <span className="text-slate-400">→ pays →</span>
                  <span className="font-bold text-emerald-700">{inst.to}</span>
                </div>
                <div className="font-extrabold text-slate-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                  {formatCurrency(inst.amountTHB, inst.amountIDR)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statement Transaction Log */}
      <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-indigo-100/80 flex items-center justify-between">
          <h3 className="text-base font-black text-indigo-950 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <span>Expense Statement Log</span>
          </h3>
          <span className="text-xs text-indigo-400 font-bold">
            {expenses.length} Transactions
          </span>
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
                      exp.paidBy === 'Shared Pocket'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Paid by {exp.paidBy}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-indigo-100/60 text-xs">
                  <span className="text-[11px] text-indigo-400 font-medium">
                    Split: {exp.splitBetween?.length === 5 ? 'All 5' : exp.splitBetween?.join(', ')}
                  </span>
                  <div className="text-right">
                    <span className="font-black text-indigo-950 block">
                      ฿{exp.totalTHB.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 block">
                      Rp {exp.totalIDR.toLocaleString('id-ID')}
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
                <th className="py-3 px-4">Total (THB)</th>
                <th className="py-3 px-4">Total (IDR)</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Split For</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50 font-bold">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-indigo-300 italic">
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
                      ฿{exp.totalTHB.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-indigo-900">
                      Rp {exp.totalIDR.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                          exp.paidBy === 'Shared Pocket'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {exp.paidBy}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
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
                  <option value="Shared Pocket">Shared Pocket (Kas Together)</option>
                  {ALL_MEMBERS.map(m => (
                    <option key={m} value={m}>{m} (Paid Out-of-Pocket / Talangan)</option>
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

      {/* Modal Edit Kas Contributions */}
      {showContrModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Shared Kas Contributions</h3>
            <p className="text-xs text-slate-500 mb-4">
              Update how much cash each member deposited into the Shared Pocket.
            </p>

            <div className="space-y-3 text-xs mb-4">
              {ALL_MEMBERS.map(m => (
                <div key={m} className="flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800 w-16">{m}:</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                    <input
                      type="number"
                      value={tempContr[m]}
                      onChange={e => setTempContr({ ...tempContr, [m]: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowContrModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContributions}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
              >
                Save Kas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
