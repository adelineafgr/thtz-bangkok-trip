import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { compressDataObjects } from '../lib/imageCompressor';
import {
  MemberName,
  ALL_MEMBERS,
  Currency,
  PreparationNote,
  WishlistItem,
  MoodboardItem,
  ExpenseItem,
  KasDepositEntry,
  MemberContribution,
  MemberSettlement,
  SettlementInstruction,
  ItineraryDay,
  ItineraryActivity,
  AccommodationOption,
  EssentialDocument
} from '../types';
import {
  DEFAULT_EXCHANGE_RATE_IDR_PER_THB,
  DEFAULT_MEMBERS_CONTRIBUTIONS,
  INITIAL_PREPARATION_NOTES,
  INITIAL_WISHLIST,
  INITIAL_MOODBOARD,
  INITIAL_EXPENSES,
  INITIAL_ITINERARY,
  INITIAL_ACCOMMODATION_OPTIONS,
  INITIAL_ESSENTIAL_DOCUMENTS
} from '../data/initialData';

export const INITIAL_KAS_DEPOSITS: KasDepositEntry[] = [
  { id: 'dep-1', source: 'Abit', amountIDR: 3500000, date: '01/08/2026', notes: 'Setoran Kas Awal' },
  { id: 'dep-2', source: 'Aisha', amountIDR: 3500000, date: '01/08/2026', notes: 'Setoran Kas Awal' },
  { id: 'dep-3', source: 'Alin', amountIDR: 3500000, date: '01/08/2026', notes: 'Setoran Kas Awal' },
  { id: 'dep-4', source: 'Bila', amountIDR: 3500000, date: '01/08/2026', notes: 'Setoran Kas Awal' },
  { id: 'dep-5', source: 'Risha', amountIDR: 3500000, date: '01/08/2026', notes: 'Setoran Kas Awal' }
];

export type TabType = 'overview' | 'itinerary' | 'prep' | 'wishlist' | 'moodboard' | 'expenses';

interface TripContextType {
  currentMember: MemberName;
  setCurrentMember: (member: MemberName) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCloudSynced: boolean;
  
  // Data
  prepNotes: PreparationNote[];
  wishlist: WishlistItem[];
  moodboard: MoodboardItem[];
  expenses: ExpenseItem[];
  contributions: MemberContribution[];
  kasDeposits: KasDepositEntry[];
  itinerary: ItineraryDay[];
  accommodations: AccommodationOption[];
  essentialDocs: EssentialDocument[];

  // CRUD Actions
  addKasDeposit: (deposit: Omit<KasDepositEntry, 'id'>) => void;
  editKasDeposit: (id: string, updated: Partial<KasDepositEntry>) => void;
  deleteKasDeposit: (id: string) => void;
  addPrepNote: (note: Omit<PreparationNote, 'id'>) => void;
  editPrepNote: (id: string, updated: Partial<PreparationNote>) => void;
  updatePrepNoteStatus: (id: string, status: PreparationNote['status']) => void;
  deletePrepNote: (id: string) => void;
  togglePinPrepNote: (id: string) => void;

  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => void;
  editWishlistItem: (id: string, updated: Partial<WishlistItem>) => void;
  toggleWishlistStatus: (id: string) => void;
  deleteWishlistItem: (id: string) => void;
  voteWishlist: (id: string, member: MemberName) => void;

  addMoodboardItem: (item: Omit<MoodboardItem, 'id' | 'createdAt'>) => void;
  editMoodboardItem: (id: string, updated: Partial<MoodboardItem>) => void;
  toggleMoodboardLike: (id: string, member: MemberName) => void;
  deleteMoodboardItem: (id: string) => void;

  addExpense: (item: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateContribution: (member: MemberName, amountIDR: number) => void;

  addItineraryActivity: (dayNumber: number, activity: Omit<ItineraryActivity, 'id'>) => void;
  editItineraryActivity: (dayNumber: number, activityId: string, updated: Partial<ItineraryActivity>) => void;
  deleteItineraryActivity: (dayNumber: number, activityId: string) => void;
  toggleItineraryActivityDone: (dayNumber: number, activityId: string) => void;

  voteAccommodation: (accId: string, member: MemberName) => void;
  addAccommodation: (acc: Omit<AccommodationOption, 'id' | 'votes'>) => void;
  editAccommodation: (id: string, acc: Partial<AccommodationOption>) => void;
  deleteAccommodation: (id: string) => void;

  toggleDocumentMember: (docId: string, member: MemberName) => void;
  addEssentialDoc: (doc: Omit<EssentialDocument, 'id' | 'readyMembers'>) => void;
  editEssentialDoc: (id: string, updated: Partial<EssentialDocument>) => void;
  deleteEssentialDoc: (id: string) => void;

  resetToDefault: () => void;

  // Calculators
  formatCurrency: (amountTHB?: number, amountIDR?: number) => string;
  getKasSummary: () => {
    totalKasInputIDR: number;
    totalExpensesIDR: number;
    saldoKasIDR: number;
    totalKasInputTHB: number;
    totalExpensesTHB: number;
    saldoKasTHB: number;
  };
  getMemberSettlements: () => MemberSettlement[];
  getSettlementInstructions: () => SettlementInstruction[];
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bkk_trip_2026_';
const TRIP_DOC_ID = 'bangkok2026';

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMember, setCurrentMember] = useState<MemberName>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}current_member`) as MemberName) || 'Aisha';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}currency`) as Currency) || 'IDR';
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}exchange_rate`);
    return saved ? parseFloat(saved) : DEFAULT_EXCHANGE_RATE_IDR_PER_THB;
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Persistence State
  const [prepNotes, setPrepNotes] = useState<PreparationNote[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}prep_notes`);
    return saved ? JSON.parse(saved) : INITIAL_PREPARATION_NOTES;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}wishlist`);
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [moodboard, setMoodboard] = useState<MoodboardItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}moodboard`);
    return saved ? JSON.parse(saved) : INITIAL_MOODBOARD;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [contributions, setContributions] = useState<MemberContribution[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}contributions`);
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS_CONTRIBUTIONS;
  });

  const [kasDeposits, setKasDeposits] = useState<KasDepositEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}kas_deposits`);
    return saved ? JSON.parse(saved) : INITIAL_KAS_DEPOSITS;
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}itinerary`);
    return saved ? JSON.parse(saved) : INITIAL_ITINERARY;
  });

  const [accommodations, setAccommodations] = useState<AccommodationOption[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}accommodations`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOMMODATION_OPTIONS;
  });

  const [essentialDocs, setEssentialDocs] = useState<EssentialDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}essential_docs`);
    return saved ? JSON.parse(saved) : INITIAL_ESSENTIAL_DOCUMENTS;
  });

  const isUpdatingFromCloud = useRef(false);
  const isInitialCloudLoadDone = useRef(false);

  // Helper function to strip undefined values before sending to Firestore
  const removeUndefinedFields = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) {
      return obj.map(removeUndefinedFields);
    }
    if (typeof obj === 'object') {
      const cleaned: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (val !== undefined) {
          cleaned[key] = removeUndefinedFields(val);
        }
      }
      return cleaned;
    }
    return obj;
  };

  // Helper to save data to Firebase Firestore
  const syncToCloud = async (overrideData?: Record<string, any>) => {
    try {
      const tripRef = doc(db, 'trips', TRIP_DOC_ID);
      const rawData = overrideData || {
        prepNotes,
        wishlist,
        moodboard,
        expenses,
        contributions,
        kasDeposits,
        itinerary,
        accommodations,
        essentialDocs,
        exchangeRate,
        updatedAt: new Date().toISOString()
      };

      // Asynchronously compress any large base64 image strings in payload to < 50KB
      const compressedData = await compressDataObjects(rawData);
      const cleanedData = removeUndefinedFields(compressedData);

      await setDoc(tripRef, cleanedData, { merge: true });
      setIsCloudSynced(true);
    } catch (err) {
      console.error('Firebase sync error:', err);
    }
  };

  // Compress any existing legacy uncompressed images in state on mount
  useEffect(() => {
    const sanitizeExistingImages = async () => {
      let changed = false;

      const cleanWishlist = await compressDataObjects(wishlist);
      if (JSON.stringify(cleanWishlist) !== JSON.stringify(wishlist)) {
        setWishlist(cleanWishlist);
        changed = true;
      }

      const cleanMoodboard = await compressDataObjects(moodboard);
      if (JSON.stringify(cleanMoodboard) !== JSON.stringify(moodboard)) {
        setMoodboard(cleanMoodboard);
        changed = true;
      }

      if (changed) {
        console.log('Sanitized legacy base64 images in state.');
      }
    };

    sanitizeExistingImages();
  }, []);

  // Listen to Cloud Firestore realtime updates
  useEffect(() => {
    const tripRef = doc(db, 'trips', TRIP_DOC_ID);
    const unsubscribe = onSnapshot(tripRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        isUpdatingFromCloud.current = true;

        if (data.prepNotes) setPrepNotes(data.prepNotes);
        if (data.wishlist) setWishlist(data.wishlist);
        if (data.moodboard) setMoodboard(data.moodboard);
        if (data.expenses) setExpenses(data.expenses);
        if (data.contributions) setContributions(data.contributions);
        if (data.kasDeposits) setKasDeposits(data.kasDeposits);
        if (data.itinerary) setItinerary(data.itinerary);
        if (data.accommodations) setAccommodations(data.accommodations);
        if (data.essentialDocs) setEssentialDocs(data.essentialDocs);
        if (data.exchangeRate) setExchangeRate(data.exchangeRate);

        setIsCloudSynced(true);
        isInitialCloudLoadDone.current = true;
        setTimeout(() => {
          isUpdatingFromCloud.current = false;
        }, 300);
      } else {
        // Document does not exist yet -> populate with initial data
        syncToCloud({
          prepNotes: INITIAL_PREPARATION_NOTES,
          wishlist: INITIAL_WISHLIST,
          moodboard: INITIAL_MOODBOARD,
          expenses: INITIAL_EXPENSES,
          contributions: DEFAULT_MEMBERS_CONTRIBUTIONS,
          itinerary: INITIAL_ITINERARY,
          accommodations: INITIAL_ACCOMMODATION_OPTIONS,
          essentialDocs: INITIAL_ESSENTIAL_DOCUMENTS,
          exchangeRate: DEFAULT_EXCHANGE_RATE_IDR_PER_THB,
          updatedAt: new Date().toISOString()
        }).then(() => {
          isInitialCloudLoadDone.current = true;
        });
      }
    }, (error) => {
      console.warn('Firestore subscription notice:', error);
      isInitialCloudLoadDone.current = true;
    });

    return () => unsubscribe();
  }, []);

  // Save changes to localStorage & Firebase
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_member`, currentMember);
  }, [currentMember]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}currency`, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}exchange_rate`, exchangeRate.toString());
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ exchangeRate });
  }, [exchangeRate]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}prep_notes`, JSON.stringify(prepNotes));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ prepNotes });
  }, [prepNotes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}wishlist`, JSON.stringify(wishlist));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ wishlist });
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}moodboard`, JSON.stringify(moodboard));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ moodboard });
  }, [moodboard]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}expenses`, JSON.stringify(expenses));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ expenses });
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contributions`, JSON.stringify(contributions));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ contributions });
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}kas_deposits`, JSON.stringify(kasDeposits));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ kasDeposits });
    
    // Auto-update contributions for each member based on kasDeposits
    const memberTotals: Record<MemberName, number> = {
      Abit: 0, Aisha: 0, Alin: 0, Bila: 0, Risha: 0
    };
    kasDeposits.forEach(dep => {
      if (dep.source in memberTotals) {
        memberTotals[dep.source as MemberName] += dep.amountIDR;
      }
    });
    setContributions(ALL_MEMBERS.map(m => ({ memberName: m, totalDebitIDR: memberTotals[m] })));
  }, [kasDeposits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}itinerary`, JSON.stringify(itinerary));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ itinerary });
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}accommodations`, JSON.stringify(accommodations));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ accommodations });
  }, [accommodations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}essential_docs`, JSON.stringify(essentialDocs));
    if (isInitialCloudLoadDone.current && !isUpdatingFromCloud.current) syncToCloud({ essentialDocs });
  }, [essentialDocs]);

  // Actions
  const addPrepNote = (note: Omit<PreparationNote, 'id'>) => {
    const newNote: PreparationNote = {
      ...note,
      id: `prep-${Date.now()}`
    };
    setPrepNotes(prev => [newNote, ...prev]);
  };

  const editPrepNote = (id: string, updated: Partial<PreparationNote>) => {
    setPrepNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
  };

  const updatePrepNoteStatus = (id: string, status: PreparationNote['status']) => {
    setPrepNotes(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  const deletePrepNote = (id: string) => {
    setPrepNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePinPrepNote = (id: string) => {
    setPrepNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`
    };
    setWishlist(prev => [newItem, ...prev]);
  };

  const editWishlistItem = (id: string, updated: Partial<WishlistItem>) => {
    setWishlist(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
  };

  const toggleWishlistStatus = (id: string) => {
    setWishlist(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'Done' ? 'Want to Go' : 'Done';
        return { ...w, status: nextStatus };
      }
      return w;
    }));
  };

  const deleteWishlistItem = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };

  const voteWishlist = (id: string, member: MemberName) => {
    setWishlist(prev => prev.map(w => {
      if (w.id === id) {
        const votes = w.votes || [];
        const hasVoted = votes.includes(member);
        const updatedVotes = hasVoted
          ? votes.filter(v => v !== member)
          : [...votes, member];
        return { ...w, votes: updatedVotes };
      }
      return w;
    }));
  };

  const addMoodboardItem = (item: Omit<MoodboardItem, 'id' | 'createdAt'>) => {
    const newItem: MoodboardItem = {
      ...item,
      id: `mb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      likes: [currentMember]
    };
    setMoodboard(prev => [newItem, ...prev]);
  };

  const editMoodboardItem = (id: string, updated: Partial<MoodboardItem>) => {
    setMoodboard(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const toggleMoodboardLike = (id: string, member: MemberName) => {
    setMoodboard(prev => prev.map(m => {
      if (m.id === id) {
        const likes = m.likes || [];
        const hasLiked = likes.includes(member);
        const updatedLikes = hasLiked
          ? likes.filter(l => l !== member)
          : [...likes, member];
        return { ...m, likes: updatedLikes };
      }
      return m;
    }));
  };

  const deleteMoodboardItem = (id: string) => {
    setMoodboard(prev => prev.filter(m => m.id !== id));
  };

  const addExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateContribution = (member: MemberName, amountIDR: number) => {
    setContributions(prev => prev.map(c => c.memberName === member ? { ...c, totalDebitIDR: amountIDR } : c));
  };

  const addKasDeposit = (deposit: Omit<KasDepositEntry, 'id'>) => {
    const newDep: KasDepositEntry = {
      ...deposit,
      id: `dep-${Date.now()}`
    };
    setKasDeposits(prev => [newDep, ...prev]);
  };

  const editKasDeposit = (id: string, updated: Partial<KasDepositEntry>) => {
    setKasDeposits(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteKasDeposit = (id: string) => {
    setKasDeposits(prev => prev.filter(d => d.id !== id));
  };

  const addItineraryActivity = (dayNumber: number, activity: Omit<ItineraryActivity, 'id'>) => {
    const newAct: ItineraryActivity = {
      ...activity,
      id: `act-${dayNumber}-${Date.now()}`
    };
    setItinerary(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: [...day.activities, newAct].sort((a, b) => a.time.localeCompare(b.time))
        };
      }
      return day;
    }));
  };

  const editItineraryActivity = (dayNumber: number, activityId: string, updated: Partial<ItineraryActivity>) => {
    setItinerary(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities
            .map(a => a.id === activityId ? { ...a, ...updated } : a)
            .sort((a, b) => a.time.localeCompare(b.time))
        };
      }
      return day;
    }));
  };

  const deleteItineraryActivity = (dayNumber: number, activityId: string) => {
    setItinerary(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== activityId)
        };
      }
      return day;
    }));
  };

  const toggleItineraryActivityDone = (dayNumber: number, activityId: string) => {
    setItinerary(prev => prev.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          activities: day.activities.map(a => a.id === activityId ? { ...a, isDone: !a.isDone } : a)
        };
      }
      return day;
    }));
  };

  const voteAccommodation = (accId: string, member: MemberName) => {
    setAccommodations(prev => prev.map(acc => {
      if (acc.id === accId) {
        const hasVoted = acc.votes.includes(member);
        return {
          ...acc,
          votes: hasVoted ? acc.votes.filter(m => m !== member) : [...acc.votes, member]
        };
      }
      return acc;
    }));
  };

  const addAccommodation = (acc: Omit<AccommodationOption, 'id' | 'votes'>) => {
    const newAcc: AccommodationOption = {
      ...acc,
      id: `acc-${Date.now()}`,
      votes: [currentMember]
    };
    setAccommodations(prev => [...prev, newAcc]);
  };

  const editAccommodation = (id: string, updated: Partial<AccommodationOption>) => {
    setAccommodations(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteAccommodation = (id: string) => {
    setAccommodations(prev => prev.filter(a => a.id !== id));
  };

  const toggleDocumentMember = (docId: string, member: MemberName) => {
    setEssentialDocs(prev => prev.map(doc => {
      if (doc.id === docId) {
        const isReady = doc.readyMembers.includes(member);
        const updated = isReady
          ? doc.readyMembers.filter(m => m !== member)
          : [...doc.readyMembers, member];
        return { ...doc, readyMembers: updated };
      }
      return doc;
    }));
  };

  const addEssentialDoc = (doc: Omit<EssentialDocument, 'id' | 'readyMembers'>) => {
    const newDoc: EssentialDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      readyMembers: []
    };
    setEssentialDocs(prev => [...prev, newDoc]);
  };

  const editEssentialDoc = (id: string, updated: Partial<EssentialDocument>) => {
    setEssentialDocs(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteEssentialDoc = (id: string) => {
    setEssentialDocs(prev => prev.filter(d => d.id !== id));
  };

  const resetToDefault = () => {
    localStorage.clear();

    setPrepNotes(INITIAL_PREPARATION_NOTES);
    setWishlist(INITIAL_WISHLIST);
    setMoodboard(INITIAL_MOODBOARD);
    setExpenses(INITIAL_EXPENSES);
    setContributions(DEFAULT_MEMBERS_CONTRIBUTIONS);
    setKasDeposits(INITIAL_KAS_DEPOSITS);
    setItinerary(INITIAL_ITINERARY);
    setAccommodations(INITIAL_ACCOMMODATION_OPTIONS);
    setEssentialDocs(INITIAL_ESSENTIAL_DOCUMENTS);
    setExchangeRate(DEFAULT_EXCHANGE_RATE_IDR_PER_THB);
    setCurrency('IDR');

    syncToCloud({
      prepNotes: INITIAL_PREPARATION_NOTES,
      wishlist: INITIAL_WISHLIST,
      moodboard: INITIAL_MOODBOARD,
      expenses: INITIAL_EXPENSES,
      contributions: DEFAULT_MEMBERS_CONTRIBUTIONS,
      kasDeposits: INITIAL_KAS_DEPOSITS,
      itinerary: INITIAL_ITINERARY,
      accommodations: INITIAL_ACCOMMODATION_OPTIONS,
      essentialDocs: INITIAL_ESSENTIAL_DOCUMENTS,
      exchangeRate: DEFAULT_EXCHANGE_RATE_IDR_PER_THB,
      updatedAt: new Date().toISOString()
    });
  };

  // Helper formatting
  const formatCurrency = (amountTHB?: number, amountIDR?: number): string => {
    if (currency === 'THB') {
      const val = amountTHB !== undefined ? amountTHB : (amountIDR ? amountIDR / exchangeRate : 0);
      return `฿${Math.round(val).toLocaleString('id-ID')}`;
    } else {
      const val = amountIDR !== undefined ? amountIDR : (amountTHB ? amountTHB * exchangeRate : 0);
      return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
    }
  };

  // Kas calculations
  const getKasSummary = () => {
    const totalKasInputIDR = kasDeposits.reduce((sum, d) => sum + d.amountIDR, 0);
    // Expenses paid by "Shared Pocket"
    const totalExpensesIDR = expenses
      .filter(e => e.paidBy === 'Shared Pocket')
      .reduce((sum, e) => sum + e.totalIDR, 0);

    const saldoKasIDR = totalKasInputIDR - totalExpensesIDR;

    return {
      totalKasInputIDR,
      totalExpensesIDR,
      saldoKasIDR,
      totalKasInputTHB: totalKasInputIDR / exchangeRate,
      totalExpensesTHB: totalExpensesIDR / exchangeRate,
      saldoKasTHB: saldoKasIDR / exchangeRate
    };
  };

  // Personal Payment & Talangan Matrix
  const getMemberSettlements = (): MemberSettlement[] => {
    return ALL_MEMBERS.map(member => {
      const contr = contributions.find(c => c.memberName === member)?.totalDebitIDR || 0;

      // Total out-of-pocket paid by this member for group expenses
      const totalTalanganIDR = expenses
        .filter(e => e.paidBy === member)
        .reduce((sum, e) => sum + e.totalIDR, 0);

      // Fair share of group expenses (where member is included in splitBetween)
      let fairShareIDR = 0;
      expenses.forEach(e => {
        if (e.splitBetween && e.splitBetween.includes(member)) {
          fairShareIDR += e.totalIDR / e.splitBetween.length;
        }
      });

      // Net settlement: (Money put in Kas + Money spent out-of-pocket) - Fair Share of all group expenses
      // If Positive: Member has paid MORE than their fair share -> Owed refund
      // If Negative: Member has paid LESS than their fair share -> Needs to pay into settlement
      const netBalanceIDR = (contr + totalTalanganIDR) - fairShareIDR;

      return {
        memberName: member,
        totalDebitIDR: contr,
        totalTalanganIDR,
        fairShareIDR,
        netBalanceIDR
      };
    });
  };

  const getSettlementInstructions = (): SettlementInstruction[] => {
    const settlements = getMemberSettlements();
    const debtors = settlements.filter(s => s.netBalanceIDR < -100).map(s => ({ ...s }));
    const creditors = settlements.filter(s => s.netBalanceIDR > 100).map(s => ({ ...s }));

    const instructions: SettlementInstruction[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amountToPay = Math.min(Math.abs(debtor.netBalanceIDR), creditor.netBalanceIDR);

      if (amountToPay > 100) {
        instructions.push({
          from: debtor.memberName,
          to: creditor.memberName,
          amountIDR: Math.round(amountToPay),
          amountTHB: Math.round(amountToPay / exchangeRate)
        });
      }

      debtor.netBalanceIDR += amountToPay;
      creditor.netBalanceIDR -= amountToPay;

      if (Math.abs(debtor.netBalanceIDR) < 100) i++;
      if (creditor.netBalanceIDR < 100) j++;
    }

    return instructions;
  };

  return (
    <TripContext.Provider
      value={{
        currentMember,
        setCurrentMember,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        activeTab,
        setActiveTab,
        isCloudSynced,
        prepNotes,
        wishlist,
        moodboard,
        expenses,
        contributions,
        kasDeposits,
        itinerary,
        accommodations,
        essentialDocs,
        addPrepNote,
        editPrepNote,
        updatePrepNoteStatus,
        deletePrepNote,
        togglePinPrepNote,
        addWishlistItem,
        editWishlistItem,
        toggleWishlistStatus,
        deleteWishlistItem,
        voteWishlist,
        addMoodboardItem,
        editMoodboardItem,
        toggleMoodboardLike,
        deleteMoodboardItem,
        addExpense,
        deleteExpense,
        updateContribution,
        addKasDeposit,
        editKasDeposit,
        deleteKasDeposit,
        addItineraryActivity,
        editItineraryActivity,
        deleteItineraryActivity,
        toggleItineraryActivityDone,
        voteAccommodation,
        addAccommodation,
        editAccommodation,
        deleteAccommodation,
        toggleDocumentMember,
        addEssentialDoc,
        editEssentialDoc,
        deleteEssentialDoc,
        resetToDefault,
        formatCurrency,
        getKasSummary,
        getMemberSettlements,
        getSettlementInstructions
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
