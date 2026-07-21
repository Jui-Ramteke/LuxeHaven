export interface HotelRoom {
  roomNumber: string;
  type: "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";
  pricePerNight: number;
  maxGuests: number;
  description: string;
  amenities: string[];
}

export interface HotelReview {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: "Goa" | "Mumbai" | "Delhi" | "Bangalore";
  rating: number;
  ratingText: string;
  ratingCount: number;
  area: string;
  distance: string;
  mainPhoto: string;
  photos: string[];
  description: string;
  tags: string[];
  amenities: { iconName: string; label: string }[];
  rooms: HotelRoom[];
  reviews: HotelReview[];
}

export const HOTELS_DATABASE: Hotel[] = [
  {
    id: "h1",
    name: "Luxe Haven Resort & Private Spa",
    city: "Goa",
    rating: 9.2,
    ratingText: "Superb",
    ratingCount: 1480,
    area: "Calangute Beach",
    distance: "50m from beach shoreline",
    mainPhoto: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Experience world-class tropical luxury at Goa's premier beachfront resort. Nestled directly on Calangute Beach, Luxe Haven features private plunge pools, five dining establishments, an ayurvedic wellness spa, and immediate ocean access. Perfect for families, couples, and premium business retreats seeking state-of-the-art hospitality.",
    tags: ["Free Breakfast included", "Free cancellation", "No prepayment needed", "Beachfront access"],
    amenities: [
      { iconName: "wifi", label: "High-speed Wi-Fi" },
      { iconName: "waves", label: "Infinity Pool" },
      { iconName: "wind", label: "Climate Control AC" },
      { iconName: "utensils", label: "4 Fine-Dining Restaurants" },
      { iconName: "sparkles", label: "Luxury Spa & Massage" },
      { iconName: "car", label: "Free Private Valet Parking" }
    ],
    rooms: [
      { roomNumber: "101", type: "SINGLE", pricePerNight: 120.0, maxGuests: 1, description: "Cozy private room featuring ocean glimpses, high-speed fiber Wi-Fi, and a rain shower.", amenities: ["Beach view", "Mini bar", "Smart TV"] },
      { roomNumber: "201", type: "DOUBLE", pricePerNight: 180.0, maxGuests: 2, description: "Elegant master bedroom fitted with double queen beds, wide-pan balcony, and climate control.", amenities: ["Balcony", "Coffee maker", "Desk"] },
      { roomNumber: "301", type: "DELUXE", pricePerNight: 300.0, maxGuests: 3, description: "Spacious premium room offering full panoramic vistas, separate lounge deck, and marble bath.", amenities: ["Panoramic View", "Jacuzzi", "Complimentary Lounge Access"] },
      { roomNumber: "401", type: "SUITE", pricePerNight: 600.0, maxGuests: 5, description: "Presidential signature flat with private jacuzzi pool, custom bar, kitchen, and dedicated butler service.", amenities: ["Private Pool", "Butler Service", "Walk-in Wardrobe"] }
    ],
    reviews: [
      { userName: "Siddharth Mehta", rating: 9.5, comment: "Absolutely breathtaking views and phenomenal hospitality. The Deluxe room was worth every rupee!", date: "2026-07-15" },
      { userName: "Emily Johnson", rating: 9.0, comment: "The beach access is unparalleled. Extremely clean rooms and highly professional staff.", date: "2026-07-10" }
    ]
  },
  {
    id: "h2",
    name: "The Royal Palace Hotel",
    city: "Delhi",
    rating: 8.8,
    ratingText: "Excellent",
    ratingCount: 924,
    area: "Connaught Place",
    distance: "0.2 km from City Center",
    mainPhoto: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Steeped in rich legacy and located in the historic heart of Delhi, Connaught Place, The Royal Palace Hotel presents a magnificent blend of classical Victorian architecture and cutting-edge modern comfort. It remains the destination of choice for diplomats, state dignitaries, and travelers who appreciate refined grandeur.",
    tags: ["Free Wi-Fi included", "Breakfast included", "Free cancellation", "Top Rated Location"],
    amenities: [
      { iconName: "wifi", label: "Complimentary High-speed Wi-Fi" },
      { iconName: "wind", label: "Centralized Air Conditioning" },
      { iconName: "utensils", label: "Royal Banquet Dinner" },
      { iconName: "briefcase", label: "24/7 Executive Business Hub" },
      { iconName: "dumbbell", label: "Fitness Gym & Sauna" },
      { iconName: "coffee", label: "Cafeteria & Lounge Bar" }
    ],
    rooms: [
      { roomNumber: "102", type: "SINGLE", pricePerNight: 120.0, maxGuests: 1, description: "Classic single room with colonial accents, executive desk, and walk-in wardrobe.", amenities: ["City view", "Writing desk", "HD TV"] },
      { roomNumber: "202", type: "DOUBLE", pricePerNight: 180.0, maxGuests: 2, description: "Comfortable double suite facing the historical city square, high ceiling, luxury beds.", amenities: ["Double bed", "Minibar", "Bathtub"] },
      { roomNumber: "302", type: "DELUXE", pricePerNight: 300.0, maxGuests: 3, description: "Royal-themed master suite, elegant antique decor, gold-plated fixtures, and soundproofing.", amenities: ["Vintage Bath", "Pillow Menu", "VIP Concierge"] },
      { roomNumber: "402", type: "SUITE", pricePerNight: 600.0, maxGuests: 5, description: "The Viceroy Presidential Suite with full executive dining room, state library, and lounge.", amenities: ["Dining Room", "Private Bar", "24/7 Airport Transfer"] }
    ],
    reviews: [
      { userName: "Rajesh K.", rating: 9.0, comment: "Pure class! The heritage design and high ceiling rooms make you feel like royalty.", date: "2026-07-18" },
      { userName: "Clara S.", rating: 8.5, comment: "Beautiful architecture, directly inside Connaught Place. Very convenient.", date: "2026-07-12" }
    ]
  },
  {
    id: "h3",
    name: "Coastal Breeze Suites",
    city: "Mumbai",
    rating: 8.7,
    ratingText: "Excellent",
    ratingCount: 742,
    area: "Marine Drive",
    distance: "100m from Marine Drive Promonade",
    mainPhoto: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Located along the famous Queen's Necklace at Marine Drive, Coastal Breeze Suites provides executive travelers with gorgeous Arabian Sea panoramas, modular modern rooms, and immediate proximity to Mumbai's primary financial hubs. Relax watching the golden sunsets from our rooftop pool and bar.",
    tags: ["Sea view rooms available", "Free cancellation", "No prepayment required", "Beachfront access", "Breakfast included"],
    amenities: [
      { iconName: "wifi", label: "Gigabit Wi-Fi" },
      { iconName: "waves", label: "Rooftop Ocean-view Pool" },
      { iconName: "glass", label: "Rooftop Sky Lounge" },
      { iconName: "coffee", label: "Complimentary Buffet Breakfast" },
      { iconName: "wind", label: "Silent climate control AC" },
      { iconName: "dumbbell", label: "Sea-facing Gym" }
    ],
    rooms: [
      { roomNumber: "103", type: "SINGLE", pricePerNight: 120.0, maxGuests: 1, description: "Compact single room with sea views, workspace, and smart temperature controls.", amenities: ["Partial sea view", "Espresso machine"] },
      { roomNumber: "203", type: "DOUBLE", pricePerNight: 180.0, maxGuests: 2, description: "Double suite featuring wide French windows looking out over Marine Drive, premium bedding.", amenities: ["Panoramic sea view", "Smart lighting"] }
    ],
    reviews: [
      { userName: "Vikram Sen", rating: 9.0, comment: "Stunning sunset from the rooftop lounge. Clean, quiet, and extremely convenient location.", date: "2026-07-19" }
    ]
  },
  {
    id: "h4",
    name: "Tech Park Executive Inn",
    city: "Bangalore",
    rating: 8.5,
    ratingText: "Very Good",
    ratingCount: 512,
    area: "Whitefield",
    distance: "Opposite to ITPL Main Gate",
    mainPhoto: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The premier hub for tech founders, business developers, and digital nomads. Tech Park Executive Inn offers hyper-modern smart rooms, dynamic hot-desking workspaces, gigabit connectivity, and ergonomic sleep quarters. Positioned right in Whitefield with seamless transit access.",
    tags: ["Gigabit Wi-Fi", "Free cancellation", "Smart Home Voice Controls", "Breakfast included"],
    amenities: [
      { iconName: "wifi", label: "10 Gbps Fiber Wi-Fi" },
      { iconName: "briefcase", label: "Co-working Desks & Boardrooms" },
      { iconName: "wind", label: "Heated AC / Intelligent vent" },
      { iconName: "coffee", label: "Artisan Coffee Bar & Breakfast" }
    ],
    rooms: [
      { roomNumber: "104", type: "SINGLE", pricePerNight: 95.0, maxGuests: 1, description: "Nomad pod featuring ergonomic standing desk, high-performance chair, and multi-display mounts.", amenities: ["Gigabit port", "Smart assistant"] }
    ],
    reviews: [
      { userName: "Devansh G.", rating: 8.8, comment: "The internet speeds are amazing! Best spot for remote developers in the city.", date: "2026-07-20" }
    ]
  },
  {
    id: "h5",
    name: "The Grand Taj Serenity Resort",
    city: "Goa",
    rating: 9.6,
    ratingText: "Exceptional",
    ratingCount: 1950,
    area: "Candolim Beach",
    distance: "On the beach sands",
    mainPhoto: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Nestled along the pristine dunes of Candolim, The Grand Taj Serenity offers visitors an exclusive luxury private beach club, spectacular sunset cruises, Michelin-starred coastal dining, and individual water-villas with bespoke plunge pools. Indulge in pure paradise.",
    tags: ["Beachfront access", "Breakfast included", "Free cancellation", "Luxury private beach"],
    amenities: [
      { iconName: "wifi", label: "Gigabit Wireless" },
      { iconName: "waves", label: "Private Lagoon Pool" },
      { iconName: "utensils", label: "Michelin-starred Dining" },
      { iconName: "sparkles", label: "Ayurvedic Spa Oasis" },
      { iconName: "car", label: "Complimentary Airport Limousine" }
    ],
    rooms: [
      { roomNumber: "501", type: "DOUBLE", pricePerNight: 240.0, maxGuests: 2, description: "Luxurious double-bed villa with private ocean balcony, custom teak wood furniture, and marble bathtub.", amenities: ["Ocean View Balcony", "Premium sound", "Mini-bar"] },
      { roomNumber: "502", type: "DELUXE", pricePerNight: 410.0, maxGuests: 3, description: "Deluxe ocean-facing haven with semi-private deck and direct ladder down to Candolim's calm shoreline.", amenities: ["Direct Beach Access", "Jacuzzi Bath", "Lounge privileges"] },
      { roomNumber: "503", type: "SUITE", pricePerNight: 780.0, maxGuests: 6, description: "Grand Sanctuary Pool Suite boasting a 15-meter private heated infinity pool and bespoke champagne bar.", amenities: ["Private Infinity Pool", "24/7 Chef", "Plush Daybeds"] }
    ],
    reviews: [
      { userName: "Ananya Sharma", rating: 10.0, comment: "Undoubtedly the most elegant luxury resort in India. The private beach access and sunset cruises were celestial!", date: "2026-07-16" },
      { userName: "Marcus Vance", rating: 9.3, comment: "Staff are outstandingly professional. The food was spectacular.", date: "2026-07-11" }
    ]
  },
  {
    id: "h6",
    name: "Heritage Diplomatic Mansion",
    city: "Delhi",
    rating: 9.3,
    ratingText: "Superb",
    ratingCount: 1120,
    area: "Chanakyapuri",
    distance: "1.5 km from India Gate",
    mainPhoto: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Located in the elite diplomatic heart of Chanakyapuri, this heritage luxury mansion stands amidst lush royal lawns. Featuring colonial-era high archways, Persian rugs, premium high-tea gardens, and smart modern tech suites, it is highly chosen by global aristocrats.",
    tags: ["Breakfast included", "Free cancellation", "Historic diplomatic enclave"],
    amenities: [
      { iconName: "wifi", label: "Ultra-fast Fiber" },
      { iconName: "wind", label: "Central Air purification" },
      { iconName: "utensils", label: "Classic High Tea Gardens" },
      { iconName: "briefcase", label: "State-of-the-art Boardrooms" },
      { iconName: "car", label: "VIP Armored Transport Options" }
    ],
    rooms: [
      { roomNumber: "601", type: "SINGLE", pricePerNight: 145.0, maxGuests: 1, description: "Elegant diplomat's study-style room, complete with library wall, Chesterfield desk chair, and secure safes.", amenities: ["Work desk", "Pre-stocked library"] },
      { roomNumber: "602", type: "DOUBLE", pricePerNight: 220.0, maxGuests: 2, description: "Regency double room overlooking the manicured rose gardens, fitted with premium Belgian linens.", amenities: ["Garden terrace", "Vintage bathtub"] },
      { roomNumber: "603", type: "SUITE", pricePerNight: 550.0, maxGuests: 4, description: "Presidential Viceroy Chamber with classical wood fireplace, private meeting room, and master hot tub.", amenities: ["Fireplace", "In-suite boardroom", "Butler call"] }
    ],
    reviews: [
      { userName: "Ambassador K. Prasad", rating: 9.8, comment: "Highly secure, deeply silent, and exquisite colonial aesthetic. The perfect sanctuary in the capital.", date: "2026-07-20" }
    ]
  },
  {
    id: "h7",
    name: "The Oberoi Skyline Marina",
    city: "Mumbai",
    rating: 9.5,
    ratingText: "Exceptional",
    ratingCount: 1654,
    area: "Nariman Point",
    distance: "Direct ocean frontage",
    mainPhoto: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rising high above Nariman Point, this architectural masterpiece overlooks the endless blue ocean. Known for its hyper-attentive 24-hour butler service, panoramic glass elevators, high-rise wellness lounges, and curated international art collection.",
    tags: ["Beachfront access", "Breakfast included", "Free cancellation", "High-rise infinity view"],
    amenities: [
      { iconName: "wifi", label: "1 Gbps Wi-Fi" },
      { iconName: "waves", label: "High-Rise Glass Infinity Pool" },
      { iconName: "utensils", label: "Japanese & French fine dining" },
      { iconName: "sparkles", label: "Sky Spa & Turkish Hammam" },
      { iconName: "dumbbell", label: "Panoromic Gym" }
    ],
    rooms: [
      { roomNumber: "701", type: "DOUBLE", pricePerNight: 290.0, maxGuests: 2, description: "Marina Double room featuring floor-to-ceiling double-glazed windows looking over the sea.", amenities: ["Skyline view", "Pillow menu", "Smart controls"] },
      { roomNumber: "702", type: "DELUXE", pricePerNight: 460.0, maxGuests: 3, description: "Deluxe Ocean Horizon retreat with floating platform bed, premium glass shower, and deep luxury tub.", amenities: ["Full Ocean Panorama", "Pre-filled private bar", "Spa bath"] },
      { roomNumber: "703", type: "SUITE", pricePerNight: 950.0, maxGuests: 6, description: "Skyline Penthouse suite occupying the top floors, complete with private wellness chamber and grand grand piano.", amenities: ["Grand Piano", "Personal sauna", "Helicopter pad transit"] }
    ],
    reviews: [
      { userName: "Vikrant Singhania", rating: 9.6, comment: "Unbelievable skyline vistas and pristine service. Truly the absolute crown of luxury hotels in Mumbai.", date: "2026-07-17" }
    ]
  },
  {
    id: "h8",
    name: "Silicon Valley Sanctuary & Spa",
    city: "Bangalore",
    rating: 8.9,
    ratingText: "Excellent",
    ratingCount: 780,
    area: "Indiranagar",
    distance: "Heart of Indiranagar",
    mainPhoto: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "An urban jungle escape hidden inside Bangalore's most vibrant lifestyle quarter. The Sanctuary boasts vertical green gardens, outdoor organic hydrotherapy pools, wellness juices bars, and custom high-comfort workspaces tailored for modern pioneers.",
    tags: ["Breakfast included", "Free cancellation", "Urban wellness garden"],
    amenities: [
      { iconName: "wifi", label: "High-speed Mesh" },
      { iconName: "waves", label: "Therapeutic Heated Pool" },
      { iconName: "coffee", label: "Organic Vegan Breakfast Buffet" },
      { iconName: "sparkles", label: "Zen Yoga & Mindfulness Deck" },
      { iconName: "dumbbell", label: "Calisthenics Outdoor Gym" }
    ],
    rooms: [
      { roomNumber: "801", type: "SINGLE", pricePerNight: 110.0, maxGuests: 1, description: "Zen single cabin featuring indoor foliage elements, premium air quality filters, and memory-foam sleep pad.", amenities: ["Foliage wall", "Smart air purifier"] },
      { roomNumber: "802", type: "DOUBLE", pricePerNight: 195.0, maxGuests: 2, description: "Comfort double studio with direct access to the central water cascade and bamboo sun-decks.", amenities: ["Garden patio", "Smart mood speaker"] },
      { roomNumber: "803", type: "SUITE", pricePerNight: 490.0, maxGuests: 5, description: "The Green Canopy Suite boasting an expansive private conservatory patio with a wooden hot-tub.", amenities: ["Private hot-tub", "Conservatory garden", "Wellness coaching"] }
    ],
    reviews: [
      { userName: "Pranav Iyer", rating: 9.2, comment: "Quiet, peaceful, and yet located right in Indiranagar. The vegan breakfast was incredibly delicious and healthy!", date: "2026-07-19" }
    ]
  }
];
