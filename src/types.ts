export type MemberName = 'Abit' | 'Aisha' | 'Alin' | 'Bila' | 'Risha';

export const ALL_MEMBERS: MemberName[] = ['Abit', 'Aisha', 'Alin', 'Bila', 'Risha'];

export type Currency = 'THB' | 'IDR';

export type NoteStatus = 'Done' | 'Upcoming' | 'To Schedule';

export interface PreparationNote {
  id: string;
  date: string; // e.g. "02/08/26"
  agenda: string;
  notes?: string;
  status: NoteStatus;
  assignee?: MemberName | 'All';
  category?: 'Document' | 'Booking' | 'Meeting' | 'Preparation';
}

export type WishlistCategory = 'Shopping' | 'Photo Spot' | 'Activity' | 'Café' | 'Dining';

export interface WishlistItem {
  id: string;
  title: string;
  category: WishlistCategory;
  estimatedPriceTHB?: number;
  estimatedPriceIDR?: number;
  rating?: number; // 1 to 5 stars
  status?: 'Want to Go' | 'Scheduled' | 'Done';
  proposedBy: MemberName;
  notes?: string;
  location?: string;
  imageUrl?: string;
  linkUrl?: string;
  votes?: MemberName[];
}

export type MoodboardCategory = 'Sleep Over' | 'Outfit' | 'Video' | 'Color Hunt' | 'Food' | 'Inspiration';

export interface MoodboardItem {
  id: string;
  title: string;
  category: MoodboardCategory;
  mediaType: 'image' | 'video' | 'tiktok' | 'instagram';
  mediaUrl: string; // Direct image URL or TikTok/IG URL
  thumbnailUrl?: string;
  caption?: string;
  addedBy: MemberName;
  createdAt: string;
  likes?: MemberName[];
}

export type ExpenseCategory = 'Shopping' | 'Food' | 'Accommodation' | 'Transport' | 'Activity' | 'Miscellaneous';

export interface ExpenseItem {
  id: string;
  date: string;
  item: string;
  category: ExpenseCategory;
  totalTHB: number;
  totalIDR: number;
  paidBy: 'Shared Pocket' | MemberName;
  notes?: string;
  splitBetween: MemberName[]; // default: all 5 members
  receiptUrl?: string;
}

export interface MemberContribution {
  memberName: MemberName;
  totalDebitIDR: number; // Cash contributed to Shared Pocket
}

export interface MemberSettlement {
  memberName: MemberName;
  totalDebitIDR: number; // Contribution to Kas
  totalTalanganIDR: number; // Paid out-of-pocket for group expenses
  fairShareIDR: number; // Individual share of group expenses
  netBalanceIDR: number; // Positive = refund owed to them, Negative = owes money
}

export interface SettlementInstruction {
  from: MemberName;
  to: MemberName | 'Shared Pocket';
  amountIDR: number;
  amountTHB: number;
}

export interface ItineraryActivity {
  id: string;
  time: string; // e.g. "07:00", "12:00"
  title: string;
  description?: string;
  category: 'Food' | 'Sightseeing' | 'Transport' | 'Activity' | 'Rest' | 'Shopping';
  locationName?: string;
  mapsUrl?: string;
  estimatedBudgetTHB?: number;
  isDone?: boolean;
}

export interface ItineraryDay {
  dayNumber: number; // 1 to 5
  date: string; // e.g. "Friday, 30 Oct 2026"
  title: string; // e.g. "Arrival & First Impression"
  themeSubtitle: string;
  activities: ItineraryActivity[];
}

export interface AccommodationOption {
  id: string;
  name: string;
  location: string;
  rating: number;
  totalPriceIDR: number;
  pricePerNightPerPersonIDR: number;
  details: string; // e.g. "3 bedrooms · 3 beds · 1 bath"
  pros: string[];
  cons: string[];
  photos: string[];
  bookingLink?: string;
  votes: MemberName[];
}

export interface EssentialDocument {
  id: string;
  name: string;
  description: string;
  readyMembers: MemberName[];
  criticalNotice?: string;
  targetDate?: string;
}

