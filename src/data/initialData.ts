import {
  PreparationNote,
  WishlistItem,
  MoodboardItem,
  ExpenseItem,
  ItineraryDay,
  AccommodationOption,
  MemberContribution,
  EssentialDocument,
  RandomNote
} from '../types';

export const DEFAULT_EXCHANGE_RATE_IDR_PER_THB = 561.12;

export const DEFAULT_MEMBERS_CONTRIBUTIONS: MemberContribution[] = [
  { memberName: 'Abit', totalDebitIDR: 3500000 },
  { memberName: 'Aisha', totalDebitIDR: 3500000 },
  { memberName: 'Alin', totalDebitIDR: 3500000 },
  { memberName: 'Bila', totalDebitIDR: 3500000 },
  { memberName: 'Risha', totalDebitIDR: 3500000 },
];

export const INITIAL_PREPARATION_NOTES: PreparationNote[] = [
  {
    id: 'prep-1',
    date: '02/08/2026',
    agenda: 'Online Kick-off Meeting',
    notes: 'Agenda: Finalize trip dates, flight reservations, and hotel bookings.',
    status: 'Done',
    assignee: 'All',
    category: 'Meeting'
  },
  {
    id: 'prep-2',
    date: '03/08/2026',
    agenda: 'Book Pace Walking Shoes',
    notes: 'Deposit of 2,000 THB paid via Shared Pocket.',
    status: 'Done',
    assignee: 'Aisha',
    category: 'Booking'
  },
  {
    id: 'prep-3',
    date: '08/08/2026',
    agenda: 'Purchase Flight Tickets',
    notes: 'Booking deadline: August 8 for all group members.',
    status: 'Upcoming',
    assignee: 'All',
    category: 'Booking'
  },
  {
    id: 'prep-4',
    date: '',
    agenda: 'Finalize Hotel / Airbnb Accommodation',
    notes: 'Compare Khlong Toei rental vs Pratunam studio apartment.',
    status: 'To Schedule',
    assignee: 'Alin',
    category: 'Booking'
  },
  {
    id: 'prep-5',
    date: '27/10/2026',
    agenda: 'Fill TDAC Arrival Form',
    notes: '⚠️ MUST BE COMPLETED WITHIN 3 DAYS BEFORE LANDING IN BANGKOK ⚠️',
    status: 'Upcoming',
    assignee: 'All',
    category: 'Document'
  },
  {
    id: 'prep-6',
    date: '28/10/2026',
    agenda: 'Offline Itinerary & Outfit Meeting',
    notes: 'Final review of color palette, baggage allowances, and currency exchange.',
    status: 'To Schedule',
    assignee: 'All',
    category: 'Meeting'
  },
  {
    id: 'prep-7',
    date: '30/09/2026',
    agenda: 'Apply for Work Leave',
    notes: 'Submit annual leave request for Oct 30 - Nov 4, 2026 at respective offices.',
    status: 'Upcoming',
    assignee: 'All',
    category: 'Preparation'
  },
  {
    id: 'prep-8',
    date: '',
    agenda: 'Currency Exchange (Cash Baht)',
    notes: 'Exchange IDR to THB cash for night markets and street food stalls.',
    status: 'To Schedule',
    assignee: 'Bila',
    category: 'Preparation'
  },
  {
    id: 'prep-9',
    date: '28/10/2026',
    agenda: 'Activate Roaming / Purchase 5-Day e-SIM',
    notes: 'Buy 5-day unlimited Thailand e-SIM data package (DTAC / AIS).',
    status: 'To Schedule',
    assignee: 'Risha',
    category: 'Preparation'
  },
  {
    id: 'prep-10',
    date: '',
    agenda: 'Self Care & Salon Session',
    notes: 'Nail art, spa, and hair styling before departure!',
    status: 'Upcoming',
    assignee: 'All',
    category: 'Preparation'
  }
];

export const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'wish-1',
    title: 'Chatuchak Weekend Market',
    category: 'Shopping',
    estimatedPriceTHB: 1500,
    estimatedPriceIDR: 841000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Aisha',
    notes: 'Banyak thrift vintage, baju lucu, souvenir & mango sticky rice',
    location: 'Kamphaeng Phet 2 Rd, Chatuchak, Bangkok'
  },
  {
    id: 'wish-2',
    title: 'Slow Living, Bikes & Picnic @ Benjakitti Park',
    category: 'Photo Spot',
    estimatedPriceTHB: 200,
    estimatedPriceIDR: 112000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Abit',
    notes: 'Sewa sepeda & foto-foto aesthetic sore hari dekat lake bridge',
    location: 'Sukhumvit Rd, Khlong Toei, Bangkok'
  },
  {
    id: 'wish-3',
    title: 'Morning Run @ Lumpini / Benjakitti',
    category: 'Activity',
    estimatedPriceTHB: 0,
    estimatedPriceIDR: 0,
    rating: 2,
    status: 'Want to Go',
    proposedBy: 'Alin',
    notes: 'Jogging santai jam 6 pagi ngeliat monitor lizard',
    location: 'Lumpini Park, Bangkok'
  },
  {
    id: 'wish-4',
    title: 'Iconsiam Mall & Apple Store View',
    category: 'Shopping',
    estimatedPriceTHB: 1000,
    estimatedPriceIDR: 561000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Bila',
    notes: 'Indoor floating market (SookSiam) & foto riverfront terrace',
    location: 'Charoen Nakhon Rd, Khlong San, Bangkok'
  },
  {
    id: 'wish-5',
    title: 'Songwat Road Walking Tour',
    category: 'Shopping',
    estimatedPriceTHB: 500,
    estimatedPriceIDR: 280000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Risha',
    notes: 'Hipster art galleries, coffee shops, & vintage aesthetics',
    location: 'Song Wat Rd, Samphanthawong, Bangkok'
  },
  {
    id: 'wish-6',
    title: 'Thai Cooking Class',
    category: 'Activity',
    estimatedPriceTHB: 1200,
    estimatedPriceIDR: 673000,
    rating: 4,
    status: 'Want to Go',
    proposedBy: 'Aisha',
    notes: 'Sompong Thai Cooking School - bikin Tom Yum & Pad Thai',
    location: 'Silom, Bangkok'
  },
  {
    id: 'wish-7',
    title: 'FV Cafe (Old Town Heritage)',
    category: 'Café',
    estimatedPriceTHB: 300,
    estimatedPriceIDR: 168000,
    rating: 4,
    status: 'Want to Go',
    proposedBy: 'Alin',
    notes: 'Traditional Thai herb drinks & desserts in heritage shophouse',
    location: 'Song Wat Rd, Bangkok'
  },
  {
    id: 'wish-8',
    title: 'Thrift Shopping @ December’s & Platinum',
    category: 'Shopping',
    estimatedPriceTHB: 2000,
    estimatedPriceIDR: 1122000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Bila',
    notes: 'Beli baju lucu & matching outfits untuk grup',
    location: 'Pratunam Market, Bangkok'
  },
  {
    id: 'wish-9',
    title: 'Siam Square & Gentle Woman Store',
    category: 'Shopping',
    estimatedPriceTHB: 1800,
    estimatedPriceIDR: 1009000,
    rating: 4,
    status: 'Want to Go',
    proposedBy: 'Abit',
    notes: 'Streetwear, Gentlewoman tote bags, Casetify flagship',
    location: 'Siam Square, Pathum Wan, Bangkok'
  },
  {
    id: 'wish-10',
    title: 'Jodd Fairs / Srinakarin Night Market',
    category: 'Dining',
    estimatedPriceTHB: 600,
    estimatedPriceIDR: 336000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Risha',
    notes: 'Makan Leng Saab (spicy pork rib volcano) & seafood bowl',
    location: 'Rama IX Rd, Huai Khwang, Bangkok'
  },
  {
    id: 'wish-11',
    title: 'Thai Stamp Museum',
    category: 'Activity',
    estimatedPriceTHB: 100,
    estimatedPriceIDR: 56000,
    rating: 3,
    status: 'Want to Go',
    proposedBy: 'Aisha',
    notes: 'Museum prangko aesthetic & postcard souvenir',
    location: 'Phaya Thai, Bangkok'
  },
  {
    id: 'wish-12',
    title: 'Temple Hopping (Wat Arun & Wat Pho)',
    category: 'Activity',
    estimatedPriceTHB: 400,
    estimatedPriceIDR: 224000,
    rating: 4,
    status: 'Want to Go',
    proposedBy: 'Alin',
    notes: 'Sewa baju adat Thailand (Chut Thai) foto di Wat Arun',
    location: 'Bangkok Old City'
  },
  {
    id: 'wish-13',
    title: 'Talat Noi Street Art & Mother Roaster',
    category: 'Activity',
    estimatedPriceTHB: 250,
    estimatedPriceIDR: 140000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Bila',
    notes: 'Graffiti alleyways, old vintage car photospot & drip coffee',
    location: 'Talat Noi, Samphanthawong, Bangkok'
  },
  {
    id: 'wish-14',
    title: '8 Hours of Quality Sleep',
    category: 'Activity',
    estimatedPriceTHB: 0,
    estimatedPriceIDR: 0,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Risha',
    notes: 'Tidur cukup pas malam biar ga gampang tepar pas jalan-jalan!',
    location: 'Hotel Airbnb'
  },
  {
    id: 'wish-15',
    title: 'Wallflowers Cafe / Upstairs Bar',
    category: 'Café',
    estimatedPriceTHB: 350,
    estimatedPriceIDR: 196000,
    rating: 5,
    status: 'Want to Go',
    proposedBy: 'Abit',
    notes: 'Rustic floral cafe with signature artisan cakes & rooftop drinks',
    location: 'Chai Chana Songkhram, Pom Prap, Bangkok'
  }
];

export const INITIAL_MOODBOARD: MoodboardItem[] = [
  {
    id: 'mb-1',
    title: 'Sleep Over Aesthetics & Face Mask Night',
    category: 'Sleep Over',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    caption: 'Hotel room sleepover energy with face masks, snacks, and matching pajamas! 💖',
    addedBy: 'Aisha',
    createdAt: '2026-08-01',
    likes: ['Abit', 'Alin', 'Bila', 'Risha']
  },
  {
    id: 'mb-2',
    title: 'Thailand Outfits & Street Style Lookbook',
    category: 'Outfit',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    caption: 'Color-coordinated linen outfits for Bangkok heat & temple dresscode compliance 👗✨',
    addedBy: 'Bila',
    createdAt: '2026-08-02',
    likes: ['Aisha', 'Alin']
  },
  {
    id: 'mb-3',
    title: 'Can I try your drink? TikTok Reel',
    category: 'Video',
    mediaType: 'tiktok',
    mediaUrl: 'https://www.tiktok.com/@lyiee__/video/7497543459532836117',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
    caption: 'Trend video "Can I try your drink?" lucu pas nongkrong di cafe Bangkok 🍸',
    addedBy: 'Risha',
    createdAt: '2026-08-03',
    likes: ['Abit', 'Aisha', 'Bila']
  },
  {
    id: 'mb-4',
    title: 'Color Hunt Challenge (Bangkok Edition)',
    category: 'Color Hunt',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200&auto=format&fit=crop',
    caption: 'Bikin reel nyari barang/spot sesuai palet warna group kita! 🎨',
    addedBy: 'Abit',
    createdAt: '2026-08-04',
    likes: ['Alin', 'Risha']
  },
  {
    id: 'mb-5',
    title: 'OOTD Photo Strip Dump',
    category: 'Outfit',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1200&auto=format&fit=crop',
    caption: 'Photo booth session pose ideas & photostrip memories 📸',
    addedBy: 'Alin',
    createdAt: '2026-08-04',
    likes: ['Aisha', 'Bila']
  },
  {
    id: 'mb-6',
    title: 'Vacation Vlog & Food Mam Content',
    category: 'Food',
    mediaType: 'tiktok',
    mediaUrl: 'https://www.tiktok.com/@lyiee__/video/7497543459532836117',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    caption: 'Video mukbang street food & mango sticky rice aesthetic montage 🥭🍜',
    addedBy: 'Aisha',
    createdAt: '2026-08-05',
    likes: ['Abit', 'Alin', 'Bila', 'Risha']
  },
  {
    id: 'mb-7',
    title: 'Alcohol Free Challenge / Mocktail Vibe',
    category: 'Inspiration',
    mediaType: 'instagram',
    mediaUrl: 'https://www.instagram.com/reel/C-example1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    caption: 'Nongkrong rooftop pake mocktail lucu & sunset views 🍹',
    addedBy: 'Bila',
    createdAt: '2026-08-05',
    likes: ['Abit', 'Risha']
  },
  {
    id: 'mb-8',
    title: 'Control Your Alcohol Reel Idea',
    category: 'Inspiration',
    mediaType: 'instagram',
    mediaUrl: 'https://www.instagram.com/reel/C-example2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800&auto=format&fit=crop',
    caption: 'Funny POV video: "You need to control your alcohol" reel template 🤪',
    addedBy: 'Risha',
    createdAt: '2026-08-05',
    likes: ['Aisha', 'Alin']
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    date: '08/03/2026',
    item: 'DP Pace Shoes',
    category: 'Shopping',
    totalTHB: 2000,
    totalIDR: 1122243,
    paidBy: 'Shared Pocket',
    notes: 'Down payment sepatu Pace untuk trip',
    splitBetween: ['Abit', 'Aisha', 'Alin', 'Bila', 'Risha']
  }
];

export const INITIAL_ITINERARY: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: 'Friday, 30 Oct 2026',
    title: 'Arrival & "First Impression"',
    themeSubtitle: 'Touchdown Bangkok & Low-key Evening',
    activities: [
      {
        id: 'act-1-1',
        time: '07:00',
        title: 'Arrive in BKK & Drop Bags',
        description: 'Landing at Suvarnabhumi / Don Mueang, taxi / Grab to Airbnb, drop luggage.',
        category: 'Transport',
        locationName: 'Airbnb Pratunam / Khlong Toei',
        estimatedBudgetTHB: 400
      },
      {
        id: 'act-1-2',
        time: '12:00',
        title: 'Local Hole-in-the-Wall Lunch',
        description: 'Find a highly-rated local Pad Thai / Boat Noodles spot nearby.',
        category: 'Food',
        locationName: 'Local Noodle Shop',
        estimatedBudgetTHB: 150
      },
      {
        id: 'act-1-3',
        time: '13:00',
        title: 'Light Walking Tour & Landmark',
        description: 'Keep low energy after travel. Explore neighborhood cafes & massage shop.',
        category: 'Sightseeing',
        locationName: 'Sukhumvit / Pratunam area',
        estimatedBudgetTHB: 350
      },
      {
        id: 'act-1-4',
        time: '18:00',
        title: 'Welcome Dinner & Sunset Rooftop View',
        description: 'Rooftop bar dinner along Chao Phraya river or Tichuca / Above Eleven.',
        category: 'Food',
        locationName: 'Riverfront / Rooftop Bar',
        estimatedBudgetTHB: 1200
      }
    ]
  },
  {
    dayNumber: 2,
    date: 'Saturday, 31 Oct 2026',
    title: 'Deep Dive (Bucket List)',
    themeSubtitle: 'Cultural Landmarks, Parks & Nightlife',
    activities: [
      {
        id: 'act-2-1',
        time: '07:00',
        title: 'Early Start: Wat Arun & Wat Pho',
        description: 'Beat the heat and crowds! Rent traditional Thai costume (Chut Thai) for photos.',
        category: 'Sightseeing',
        locationName: 'Wat Arun, Bangkok',
        estimatedBudgetTHB: 500
      },
      {
        id: 'act-2-2',
        time: '12:00',
        title: 'Park Picnic & Bikes @ Benjakitti Park',
        description: 'Picnic in the park with refreshing Thai milk tea and quick bites.',
        category: 'Activity',
        locationName: 'Benjakitti Park',
        mapsUrl: 'https://maps.app.goo.gl/C9r2Rwpasjnkq1QW8',
        estimatedBudgetTHB: 200
      },
      {
        id: 'act-2-3',
        time: '13:00',
        title: 'Museum, Workshop & Cooking Class',
        description: 'Sompong Thai Cooking Class or Pottery Workshop in Silom.',
        category: 'Activity',
        locationName: 'Silom Cooking School',
        estimatedBudgetTHB: 1200
      },
      {
        id: 'act-2-4',
        time: '18:00',
        title: 'Jodd Fairs / Nightlife District',
        description: 'Explore Jodd Fairs night market, Leng Saab dinner & local live performance.',
        category: 'Food',
        locationName: 'Jodd Fairs Rama IX',
        estimatedBudgetTHB: 800
      }
    ]
  },
  {
    dayNumber: 3,
    date: 'Sunday, 1 Nov 2026',
    title: 'Off the Beaten Path',
    themeSubtitle: 'Songwat Road, Cafe Hopping & Pace',
    activities: [
      {
        id: 'act-3-1',
        time: '11:00',
        title: 'Brunch & Songwat Road Aesthetics',
        description: 'Slow morning brunch at FV Cafe / Mother Roaster, explore heritage shophouses.',
        category: 'Food',
        locationName: 'Songwat Road',
        estimatedBudgetTHB: 450
      },
      {
        id: 'act-3-2',
        time: '12:00',
        title: 'OTW Pace & Casa de Pace',
        description: 'Visit Pace store / Casa de Pace for shoes and lifestyle aesthetic.',
        category: 'Shopping',
        locationName: 'Casa de Pace',
        mapsUrl: 'https://maps.app.goo.gl/C9r2Rwpasjnkq1QW8',
        estimatedBudgetTHB: 2000
      },
      {
        id: 'act-3-3',
        time: '18:00',
        title: 'Leisurely Final "Fancy" Dinner',
        description: 'Celebrate the trip with a special group dinner at Wallflowers or Supanniga.',
        category: 'Food',
        locationName: 'Wallflowers / Supanniga Eating Room',
        estimatedBudgetTHB: 1500
      }
    ]
  },
  {
    dayNumber: 4,
    date: 'Monday, 2 Nov 2026',
    title: 'Relax & Souvenirs',
    themeSubtitle: 'Iconsiam, Pratunam & Final Shopping',
    activities: [
      {
        id: 'act-4-1',
        time: '07:00',
        title: 'Slow Brunch & Chatuchak / Pratunam Market',
        description: 'Souvenir shopping: Thai tea mixes, snacks, Gentlewoman bags & clothes.',
        category: 'Shopping',
        locationName: 'Chatuchak / Pratunam Market',
        estimatedBudgetTHB: 1500
      },
      {
        id: 'act-4-2',
        time: '12:00',
        title: 'Iconsiam SookSiam Lunch & River Stroll',
        description: 'Final feast at Iconsiam floating market hall.',
        category: 'Food',
        locationName: 'Iconsiam',
        estimatedBudgetTHB: 600
      },
      {
        id: 'act-4-3',
        time: '14:00',
        title: 'Last-minute Photos & Head to Airport',
        description: 'Pack luggage, check out, grab final boba, and ride to Suvarnabhumi.',
        category: 'Transport',
        locationName: 'BKK Airport',
        estimatedBudgetTHB: 350
      }
    ]
  },
  {
    dayNumber: 5,
    date: 'Tuesday, 3 Nov 2026',
    title: 'Free Time / Flight Home',
    themeSubtitle: 'Duty Free & Return to Jakarta',
    activities: [
      {
        id: 'act-5-1',
        time: '08:00',
        title: 'Duty Free & Boarding',
        description: 'Airport duty free shopping, coffee, and flight back to Jakarta!',
        category: 'Rest',
        locationName: 'Suvarnabhumi International Airport'
      }
    ]
  }
];

export const INITIAL_ACCOMMODATION_OPTIONS: AccommodationOption[] = [
  {
    id: 'acc-1',
    name: 'Rental unit in Khlong Toei',
    location: 'Khlong Toei, Bangkok (Near Sukhumvit)',
    rating: 4.94,
    totalPriceIDR: 6775255,
    pricePerNightPerPersonIDR: 271010,
    details: '3 bedrooms · 3 beds · 1 bath (Capacity 5-6)',
    pros: [
      'MURAH & hemat kantong',
      'Dekat daerah gaul Sukhumvit & BTS',
      '3 kamar tidur terpisah'
    ],
    cons: [
      'Cukup jauh dari Siam Shopping District',
      'Kamar mandi hanya 1 (harus gantian)',
      'Ukuran relatif sempit'
    ],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'
    ],
    votes: ['Abit', 'Alin']
  },
  {
    id: 'acc-2',
    name: 'Phayathai / Pratunam Apartment',
    location: 'Phayathai / Pratunam (400m to BTS)',
    rating: 4.97,
    totalPriceIDR: 6387833,
    pricePerNightPerPersonIDR: 255513,
    details: '1 BR Studio Loft for 6 @ 3rd Floor',
    pros: [
      'Sangat dekat pasar Pratunam & Platinum Mall',
      'Hanya 400 meter ke stasiun BTS Phaya Thai',
      'Harga total lebih murah per malam!'
    ],
    cons: [
      'Hanya 1 BR studio (tidur bareng di 1 area)',
      'Desain standar ala condo perkotaan'
    ],
    photos: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop'
    ],
    votes: ['Aisha', 'Bila', 'Risha']
  }
];

export const INITIAL_ESSENTIAL_DOCUMENTS: EssentialDocument[] = [
  {
    id: 'doc-1',
    name: 'Passport (Min. 6 Months)',
    description: 'Paspor aktif minimal 6 bulan sebelum kedatangan di Thailand.',
    readyMembers: ['Abit', 'Aisha', 'Alin', 'Bila', 'Risha']
  },
  {
    id: 'doc-2',
    name: 'Flight Tickets (PP)',
    description: 'Tiket penerbangan pergi & pulang (Target booking 5 Sept).',
    readyMembers: ['Abit', 'Aisha', 'Alin', 'Risha'],
    targetDate: '5 Sept 2026'
  },
  {
    id: 'doc-3',
    name: 'TDAC Form (Thailand Digital Arrival)',
    description: 'Form kedatangan Thailand digital.',
    criticalNotice: 'Maksimal diisi H-3 sebelum landing BKK!',
    readyMembers: []
  },
  {
    id: 'doc-4',
    name: 'e-SIM / Roaming Thailand 5 Days',
    description: 'Koneksi internet e-SIM / SIM card lokal Thailand.',
    readyMembers: ['Abit', 'Aisha', 'Alin', 'Risha']
  },
  {
    id: 'doc-5',
    name: 'Asuransi Perjalanan & Booking Hotel',
    description: 'Bukti reservasi akomodasi & asuransi perjalanan.',
    readyMembers: ['Abit', 'Aisha', 'Alin', 'Bila']
  }
];

export const INITIAL_RANDOM_NOTES: RandomNote[] = [
  {
    id: 'note-1',
    title: 'Emergency Contact Bangkok',
    content: '1. KBRI Bangkok: +66 2 247 0123\n2. Tourist Police: 1155\n3. Ambulans / Darurat: 1669\n4. CS e-SIM / Roaming Support: +62 811 1234 5678',
    category: 'Emergency & Contacts',
    color: 'pink',
    author: 'Abit',
    isPinned: true,
    createdAt: '2026-08-01',
    tags: ['Darurat', 'Kontak', 'Penting']
  },
  {
    id: 'note-2',
    title: 'Tips Naik TukTuk & Transportasi',
    content: '• Nawar TukTuk minimal 30-40% dari harga penawaran awal supir.\n• Pakai aplikasi Grab / Bolt / InDrive untuk cek estimasi harga wajar.\n• Naik BTS / MRT lebih cepat bebas macet jam sibuk sore (17.00 - 19.00).',
    category: 'Tips & Packing',
    color: 'yellow',
    author: 'Aisha',
    isPinned: true,
    createdAt: '2026-08-03',
    tags: ['Transport', 'TukTuk', 'Tips']
  },
  {
    id: 'note-3',
    title: 'Ide Palette Warna Baju (OOTD Group)',
    content: 'Day 1 (Wat Arun): Whites & Earthy Cream\nDay 2 (Chatuchak & Cafe): Bright Colorful Casual / Pastel\nDay 3 (Yaowarat Night Market): Chic Neon / Streetwear Black',
    category: 'Ideas',
    color: 'purple',
    author: 'Alin',
    isPinned: false,
    createdAt: '2026-08-05',
    tags: ['OOTD', 'Outfit', 'Foto']
  },
  {
    id: 'note-4',
    title: 'Colokan Listrik & Powerbank',
    content: 'Thailand pakai colokan Tipe A, B, dan C (220V). Colokan Indonesia 2 kaki bulat (Tipe C) BISA dipakai langsung, tapi wajib bawa terminal colokan cabang biar bisa charge 5 HP + powerbank barengan di hotel!',
    category: 'Tips & Packing',
    color: 'blue',
    author: 'Bila',
    isPinned: false,
    createdAt: '2026-08-06',
    tags: ['Elektronik', 'Packing']
  },
  {
    id: 'note-5',
    title: 'Catatan Titipan Oleh-oleh',
    content: '• Thai Tea Chatramue pouch merah & hijau\n• Snack rumput laut Tao Kae Noi jumbo\n• Inhaler Poy-Sian / Pastel Brand (1 pack isi 6)\n• Kaos gajah Chatuchak & Baju Bangkok',
    category: 'General',
    color: 'green',
    author: 'Risha',
    isPinned: false,
    createdAt: '2026-08-08',
    tags: ['Belanja', 'Oleh-oleh']
  }
];


