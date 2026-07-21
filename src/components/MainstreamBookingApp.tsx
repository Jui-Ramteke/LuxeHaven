import React, { useState, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  Heart,
  ArrowLeft,
  Wifi,
  Coffee,
  Wind,
  Waves,
  Sparkles,
  Car,
  Utensils,
  Briefcase,
  Dumbbell,
  Clock,
  Tag,
  ShieldCheck,
  Check,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Ban,
  Eye,
  X,
  ChevronDown,
  Info,
  Gift,
  Copy,
  Sun,
  CloudRain,
  CloudSun,
  TrendingUp
} from "lucide-react";
import { HOTELS_DATABASE, Hotel, HotelRoom } from "../hotelData";
import { JavaConsoleSimulator, SimulatedBooking } from "../javaSimulator";

interface MainstreamBookingAppProps {
  simulator: JavaConsoleSimulator;
  onBookingCreated: () => void;
}

export default function MainstreamBookingApp({ simulator, onBookingCreated }: MainstreamBookingAppProps) {
  // Screens: "HOME" | "RESULTS" | "DETAILS" | "MY_BOOKINGS"
  const [screen, setScreen] = useState<"HOME" | "RESULTS" | "DETAILS" | "MY_BOOKINGS">("HOME");
  
  // Search parameters
  const [destination, setDestination] = useState<"Goa" | "Mumbai" | "Delhi" | "Bangalore">("Goa");
  const [checkIn, setCheckIn] = useState("2026-07-22");
  const [checkOut, setCheckOut] = useState("2026-07-25");
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  // Results & details selection
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(HOTELS_DATABASE[0]);
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "rooms" | "amenities" | "reviews">("overview");
  const [hotelPhotoIdx, setHotelPhotoIdx] = useState(0);

  // Filters
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high">("rating");
  const [filterType, setFilterType] = useState<string>("ALL"); // ALL, SINGLE, DOUBLE, DELUXE, SUITE
  const [favoriteHotels, setFavoriteHotels] = useState<string[]>([]);
  const [filterFreeCancellation, setFilterFreeCancellation] = useState(false);
  const [filterBeachfront, setFilterBeachfront] = useState(false);
  const [filterBreakfast, setFilterBreakfast] = useState(false);

  // Premium extra features state
  const [compareRoomsActive, setCompareRoomsActive] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);
  const [selectedReviewRatingFilter, setSelectedReviewRatingFilter] = useState<number | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  // Booking process wizard state
  const [bookingRoom, setBookingRoom] = useState<HotelRoom | null>(null);
  const [bookingGuestName, setBookingGuestName] = useState("");
  const [bookingGuestPhone, setBookingGuestPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentStep, setPaymentStep] = useState<"FORM" | "PAYMENT" | "CONFIRMED">("FORM");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [activeBookingReceipt, setActiveBookingReceipt] = useState<SimulatedBooking | null>(null);
  const [bookingValidationError, setBookingValidationError] = useState("");

  // Recent Searches Mock
  const recentSearches = [
    { city: "Goa", dates: "Jul 22 - 25, 2 guests" },
    { city: "Mumbai", dates: "Aug 1 - 4, 1 guest" }
  ];

  // Top Deals Mock
  const topDeals = [
    {
      id: "h1",
      name: "Luxe Haven Beach Resort",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
      city: "Goa",
      price: "₹10,080",
      discount: "10% Off",
      badge: "Deal of the Day"
    },
    {
      id: "h2",
      name: "The Royal Palace Delhi",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
      city: "Delhi",
      price: "₹15,120",
      discount: "Last Minute",
      badge: "Top Seller"
    }
  ];

  // Filtered hotels logic
  const filteredHotels = useMemo(() => {
    let result = HOTELS_DATABASE.filter(h => h.city.toLowerCase() === destination.toLowerCase());
    
    if (filterFreeCancellation) {
      result = result.filter(h => h.tags.some(t => t.toLowerCase().includes("free cancellation")));
    }
    if (filterBeachfront) {
      result = result.filter(h => h.tags.some(t => t.toLowerCase().includes("beachfront")) || h.area.toLowerCase().includes("beach"));
    }
    if (filterBreakfast) {
      result = result.filter(h => h.tags.some(t => t.toLowerCase().includes("breakfast")) || h.amenities.some(a => a.label.toLowerCase().includes("breakfast")));
    }

    // Sort logic
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-low") {
      result = [...result].sort((a, b) => {
        const pA = a.rooms[0]?.pricePerNight || 999;
        const pB = b.rooms[0]?.pricePerNight || 999;
        return pA - pB;
      });
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => {
        const pA = a.rooms[a.rooms.length - 1]?.pricePerNight || 0;
        const pB = b.rooms[b.rooms.length - 1]?.pricePerNight || 0;
        return pB - pA;
      });
    }

    return result;
  }, [destination, sortBy, filterFreeCancellation, filterBeachfront, filterBreakfast]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterFreeCancellation(false);
    setFilterBeachfront(false);
    setFilterBreakfast(false);
    setScreen("RESULTS");
  };

  const selectHotelForView = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHotelPhotoIdx(0);
    setActiveDetailTab("overview");
    setScreen("DETAILS");
  };

  const toggleFavorite = (hotelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteHotels.includes(hotelId)) {
      setFavoriteHotels(prev => prev.filter(id => id !== hotelId));
    } else {
      setFavoriteHotels(prev => [...prev, hotelId]);
    }
  };

  const calculateStayNights = (inDate: string, outDate: string): number => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = end.getTime() - start.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  };

  const nightsCount = useMemo(() => {
    return calculateStayNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  // Handle room booking button trigger
  const handleInitiateBooking = (room: HotelRoom) => {
    setBookingRoom(room);
    setBookingGuestName("");
    setBookingGuestPhone("");
    setCouponCode("");
    setCouponApplied(false);
    setCouponError("");
    setPaymentStep("FORM");
    setBookingValidationError("");
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
  };

  // Check custom dates validation
  const validateBookingDates = (): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setBookingValidationError("Invalid check-in or check-out date values.");
      return false;
    }
    if (start < today) {
      setBookingValidationError("Check-in date cannot be in the past.");
      return false;
    }
    if (end <= start) {
      setBookingValidationError("Check-out date must be at least 1 day after check-in.");
      return false;
    }
    return true;
  };

  const applyDiscountCoupon = (codeOverride?: string) => {
    const targetCode = (codeOverride || couponCode).trim().toUpperCase();
    if (codeOverride) {
      setCouponCode(targetCode);
    }
    
    if (targetCode === "JAVAOOP10" || targetCode === "LUXESAVE") {
      setCouponApplied(true);
      setDiscountPercentage(10);
      setCouponError("");
    } else if (targetCode === "HAVEN20") {
      setCouponApplied(true);
      setDiscountPercentage(20);
      setCouponError("");
    } else if (targetCode === "LUXURY25") {
      setCouponApplied(true);
      setDiscountPercentage(25);
      setCouponError("");
    } else if (targetCode === "BREAKFAST") {
      setCouponApplied(true);
      setDiscountPercentage(15);
      setCouponError("");
    } else {
      setCouponError("Invalid promo code. Try 'JAVAOOP10', 'HAVEN20', or 'LUXURY25'!");
      setCouponApplied(false);
      setDiscountPercentage(0);
    }
  };

  // Submit Guest Details Form
  const handleGuestFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingValidationError("");

    if (!bookingGuestName.trim()) {
      setBookingValidationError("Guest name is required.");
      return;
    }
    const phoneRegex = /^[+]?[0-9]{10,13}$/;
    if (!phoneRegex.test(bookingGuestPhone.trim())) {
      setBookingValidationError("Contact number must be a valid 10-13 digit phone number.");
      return;
    }
    if (!validateBookingDates()) {
      return;
    }
    if (bookingRoom && guests > bookingRoom.maxGuests) {
      setBookingValidationError(`Over-occupancy warning: ${bookingRoom.type} only supports a maximum of ${bookingRoom.maxGuests} guests.`);
      return;
    }

    setPaymentStep("PAYMENT");
  };

  // Submit payment form and run booking simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;

    // Call simulated JVM block in background!
    const result = simulator.placeVisualBooking({
      guestName: bookingGuestName,
      contactNumber: bookingGuestPhone,
      roomType: bookingRoom.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: guests,
      discountApplied: couponApplied,
      hotelName: selectedHotel.name,
      roomNumber: bookingRoom.roomNumber
    });

    if (typeof result === "string") {
      setBookingValidationError(result);
      setPaymentStep("FORM");
    } else {
      // Booking succeeded!
      setActiveBookingReceipt(result);
      setPaymentStep("CONFIRMED");
      onBookingCreated(); // Trigger reload of simulator state / lists in main app
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const success = simulator.cancelVisualBooking(bookingId);
    if (success) {
      onBookingCreated(); // re-sync UI
    }
  };

  const getAmenityIcon = (name: string) => {
    switch (name) {
      case "wifi": return <Wifi className="w-4 h-4" />;
      case "waves": return <Waves className="w-4 h-4" />;
      case "wind": return <Wind className="w-4 h-4" />;
      case "utensils": return <Utensils className="w-4 h-4" />;
      case "sparkles": return <Sparkles className="w-4 h-4" />;
      case "car": return <Car className="w-4 h-4" />;
      case "briefcase": return <Briefcase className="w-4 h-4" />;
      case "dumbbell": return <Dumbbell className="w-4 h-4" />;
      case "glass": return <Coffee className="w-4 h-4" />;
      case "coffee": return <Coffee className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  const getWeatherDataForCity = (city: string) => {
    switch(city) {
      case "Goa":
        return {
          temp: "31°C",
          desc: "Warm Sunshine & Sea Breeze",
          icon: <Sun className="w-5 h-5 text-amber-500" />,
          forecast: [
            { day: "Wed", temp: "31°C", desc: "Sunny", icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { day: "Thu", temp: "30°C", desc: "Humid", icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { day: "Fri", temp: "29°C", desc: "Rain Showers", icon: <CloudRain className="w-4 h-4 text-blue-400" /> },
          ],
          packing: ["Linen Shirts", "Polarized Sunglasses", "Waterproof Sunscreen", "Comfy Beach Sandals"]
        };
      case "Mumbai":
        return {
          temp: "29°C",
          desc: "Tropical Monsoons & Warm Wind",
          icon: <CloudRain className="w-5 h-5 text-blue-400" />,
          forecast: [
            { day: "Wed", temp: "29°C", desc: "Rainy", icon: <CloudRain className="w-4 h-4 text-blue-400" /> },
            { day: "Thu", temp: "28°C", desc: "Breezy", icon: <Wind className="w-4 h-4 text-slate-400" /> },
            { day: "Fri", temp: "30°C", desc: "Partly Cloudy", icon: <CloudSun className="w-4 h-4 text-amber-400" /> },
          ],
          packing: ["Compact Travel Umbrella", "Moisture-wicking Wear", "Anti-skid Sandals", "Light Windbreaker"]
        };
      case "Delhi":
        return {
          temp: "34°C",
          desc: "Bright & Sunny Capital Skies",
          icon: <Sun className="w-5 h-5 text-amber-500" />,
          forecast: [
            { day: "Wed", temp: "34°C", desc: "Very Hot", icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { day: "Thu", temp: "33°C", desc: "Sunny", icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { day: "Fri", temp: "32°C", desc: "Hazy Sun", icon: <CloudSun className="w-4 h-4 text-amber-400" /> },
          ],
          packing: ["Breathable Cotton Tops", "Wide Sunglasses", "Walking Sneakers", "Insulated Water Flask"]
        };
      case "Bangalore":
      default:
        return {
          temp: "24°C",
          desc: "Pleasant Valley Autumn Breeze",
          icon: <Wind className="w-5 h-5 text-emerald-500" />,
          forecast: [
            { day: "Wed", temp: "24°C", desc: "Ideal Climate", icon: <Wind className="w-4 h-4 text-emerald-500" /> },
            { day: "Thu", temp: "25°C", desc: "Mild Sunshine", icon: <CloudSun className="w-4 h-4 text-amber-400" /> },
            { day: "Fri", temp: "23°C", desc: "Light Drizzle", icon: <CloudRain className="w-4 h-4 text-blue-300" /> },
          ],
          packing: ["Light Cardigan / Blazer", "Premium Leather Sneakers", "Denim Jacket", "Travel Backpack"]
        };
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-[600px] flex flex-col font-sans text-[#1F2933] pb-10 rounded-2xl overflow-hidden border border-slate-200">
      
      {/* Top Main Navigation Bar for Client App */}
      <nav className="bg-[#0D6EFD] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <span className="font-serif font-extrabold text-white text-base tracking-tight">LH</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight">LuxeHaven.com</h3>
            <span className="text-[10px] text-blue-100 block -mt-1">Real-time Hotel search engine</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setScreen("HOME")}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
              screen === "HOME" ? "bg-white text-[#0D6EFD]" : "hover:bg-white/10 text-white"
            }`}
          >
            Find Stays
          </button>
          <button
            onClick={() => setScreen("MY_BOOKINGS")}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition flex items-center space-x-1 ${
              screen === "MY_BOOKINGS" ? "bg-white text-[#0D6EFD]" : "hover:bg-white/10 text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Bookings ({simulator.bookings.filter(b => !b.isCancelled).length})</span>
          </button>
        </div>
      </nav>

      {/* 1. HOME SCREEN VIEW */}
      {screen === "HOME" && (
        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Hero Prompt */}
          <div className="text-center space-y-1 my-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#111827] tracking-tight md:text-3xl">Where are you going next?</h1>
            <p className="text-xs text-slate-500 md:text-sm">Discover premium accommodations with guaranteed rates and instant booking confirmation.</p>
          </div>

          {/* Big Search Module */}
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-4 md:p-5 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 relative">
            
            {/* Destination Selection */}
            <div className="md:col-span-4 border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 focus-within:border-[#0D6EFD] transition">
              <MapPin className="text-[#0D6EFD] w-5 h-5 shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block leading-tight">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value as any)}
                  className="w-full text-xs font-bold text-[#1F2933] bg-transparent outline-none cursor-pointer"
                >
                  <option value="Goa">Goa, India</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="Delhi">Delhi, India</option>
                  <option value="Bangalore">Bangalore, India</option>
                </select>
              </div>
            </div>

            {/* Check-In Date */}
            <div className="md:col-span-3 border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 focus-within:border-[#0D6EFD] transition">
              <Calendar className="text-[#0D6EFD] w-5 h-5 shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block leading-tight">Check-In</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-xs font-bold text-[#1F2933] outline-none"
                />
              </div>
            </div>

            {/* Check-Out Date */}
            <div className="md:col-span-3 border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 focus-within:border-[#0D6EFD] transition">
              <Calendar className="text-[#0D6EFD] w-5 h-5 shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block leading-tight">Check-Out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-xs font-bold text-[#1F2933] outline-none"
                />
              </div>
            </div>

            {/* Guests Input */}
            <div className="md:col-span-2 border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 focus-within:border-[#0D6EFD] transition">
              <Users className="text-[#0D6EFD] w-5 h-5 shrink-0" />
              <div className="flex-1">
                <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block leading-tight">Guests</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="w-full text-xs font-bold text-[#1F2933] outline-none"
                />
              </div>
            </div>

            {/* Search CTA */}
            <div className="md:col-span-12 mt-2">
              <button
                type="submit"
                className="w-full bg-[#0D6EFD] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search Accommodations</span>
              </button>
            </div>
          </form>

          {/* Recent Searches */}
          <div className="max-w-3xl mx-auto space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-mono">Your Recent Searches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentSearches.map((rs, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setDestination(rs.city as any);
                    setFilterFreeCancellation(false);
                    setFilterBeachfront(false);
                    setFilterBreakfast(false);
                    setScreen("RESULTS");
                  }}
                  className="bg-white rounded-xl border border-slate-200/60 p-3 flex items-center justify-between hover:border-slate-300 transition cursor-pointer shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <MapPin className="text-slate-500 w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rs.city}, India</h4>
                      <p className="text-[10px] text-slate-400">{rs.dates}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular Nearby */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-mono">Popular Nearby Destinations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Goa", count: "48 properties", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&q=80" },
                { name: "Mumbai", count: "32 properties", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=150&q=80" },
                { name: "Delhi", count: "21 properties", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80" },
                { name: "Bangalore", count: "18 properties", img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=150&q=80" }
              ].map((dest, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setDestination(dest.name as any);
                    setFilterFreeCancellation(false);
                    setFilterBeachfront(false);
                    setFilterBreakfast(false);
                    setScreen("RESULTS");
                  }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200/60 hover:shadow-md hover:border-slate-300 transition cursor-pointer"
                >
                  <img src={dest.img} alt={dest.name} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-slate-800">{dest.name}</h4>
                    <p className="text-[9px] text-slate-400">{dest.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Deals Block */}
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] font-mono">Top Summer Deals</h3>
              <span className="text-[10px] text-[#0D6EFD] font-bold">See all deals</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => {
                    const found = HOTELS_DATABASE.find(h => h.id === deal.id);
                    if (found) selectHotelForView(found);
                  }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex hover:shadow-md transition cursor-pointer"
                >
                  <img src={deal.img} alt={deal.name} className="w-28 object-cover shrink-0" />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="bg-[#FF7A00] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{deal.badge}</span>
                        <span className="text-[9px] text-[#1BA675] font-bold">{deal.discount}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{deal.name}</h4>
                      <p className="text-[9px] text-slate-400">{deal.city}, India</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] text-slate-400">from</span>
                      <span className="text-sm font-extrabold text-slate-900">{deal.price}/night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SEARCH RESULTS VIEW */}
      {screen === "RESULTS" && (
        <div className="flex-1 p-4 md:p-6 space-y-4">
          
          {/* Navigation Path */}
          <button
            onClick={() => setScreen("HOME")}
            className="flex items-center space-x-2 text-[#0D6EFD] hover:text-blue-700 text-xs font-bold transition self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify search / Return Home</span>
          </button>

          {/* Results Summary Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Stays in {destination}, India</h2>
              <p className="text-xs text-slate-500">
                {checkIn} to {checkOut} • {nightsCount} night{nightsCount > 1 ? "s" : ""} • {guests} guest{guests > 1 ? "s" : ""}
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#6B7280]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1.5 px-2.5 text-slate-800 focus:border-[#0D6EFD]"
              >
                <option value="rating">Rating: Excellent first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Filter Chips Row */}
          <div className="flex flex-wrap gap-1.5 py-1">
            <button
              onClick={() => {
                setFilterFreeCancellation(false);
                setFilterBeachfront(false);
                setFilterBreakfast(false);
              }}
              title="Clear all active filters"
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 px-3 py-1 rounded-full font-bold cursor-pointer transition flex items-center space-x-1 shadow-sm"
            >
              <span>All Available ({filteredHotels.length})</span>
              {(filterFreeCancellation || filterBeachfront || filterBreakfast) && (
                <X className="w-3 h-3 text-white/90 stroke-[3]" />
              )}
            </button>
            <button
              onClick={() => setFilterFreeCancellation(prev => !prev)}
              className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition font-semibold ${
                filterFreeCancellation
                  ? "bg-[#0D6EFD] border-[#0D6EFD] text-white shadow-sm font-bold"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              Free Cancellation
            </button>
            <button
              onClick={() => setFilterBeachfront(prev => !prev)}
              className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition font-semibold ${
                filterBeachfront
                  ? "bg-[#0D6EFD] border-[#0D6EFD] text-white shadow-sm font-bold"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              Beachfront Location
            </button>
            <button
              onClick={() => setFilterBreakfast(prev => !prev)}
              className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition font-semibold ${
                filterBreakfast
                  ? "bg-[#0D6EFD] border-[#0D6EFD] text-white shadow-sm font-bold"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              Breakfast Included
            </button>
          </div>

          {/* Hotel list card loop */}
          <div className="space-y-4 max-w-4xl">
            {filteredHotels.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No properties located in '{destination}'</h3>
                <p className="text-xs text-slate-500">We do not currently hold registered rooms in this city. Try Goa, Mumbai, Delhi, or Bangalore!</p>
              </div>
            ) : (
              filteredHotels.map((hotel) => {
                // Get the starting price of hotel rooms
                const startingPrice = hotel.rooms[0]?.pricePerNight || 120.0;
                const startingPriceInRupees = Math.round(startingPrice * 84); // mock conversion to rupees

                return (
                  <div
                    key={hotel.id}
                    onClick={() => selectHotelForView(hotel)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/65 shadow-sm hover:shadow-md transition grid grid-cols-1 md:grid-cols-12 cursor-pointer relative"
                  >
                    
                    {/* Hotel Main Image */}
                    <div className="md:col-span-5 relative h-48 md:h-full min-h-[160px]">
                      <img src={hotel.mainPhoto} alt={hotel.name} className="w-full h-full object-cover" />
                      
                      {/* Heart icon bookmark */}
                      <button
                        onClick={(e) => toggleFavorite(hotel.id, e)}
                        className="absolute top-3 right-3 bg-white hover:bg-slate-100 p-1.5 rounded-full shadow-md text-slate-600 transition"
                      >
                        <Heart className={`w-4 h-4 ${favoriteHotels.includes(hotel.id) ? "text-rose-500 fill-rose-500" : ""}`} />
                      </button>
                    </div>

                    {/* Hotel Details Column */}
                    <div className="md:col-span-7 p-4 flex flex-col justify-between space-y-3">
                      
                      {/* Header Name & Rating */}
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight pr-2">{hotel.name}</h3>
                          
                          {/* Rating badge pill */}
                          <div className="flex items-center space-x-1.5 shrink-0 bg-[#0D6EFD]/10 text-[#0D6EFD] px-2 py-0.5 rounded-lg text-[10px] font-extrabold font-mono uppercase">
                            <span>{hotel.ratingText}</span>
                            <span className="bg-[#0D6EFD] text-white px-1 py-0.5 rounded text-[10px] font-bold">{hotel.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{hotel.area} • {hotel.distance}</span>
                        </div>
                      </div>

                      {/* key Tags */}
                      <div className="flex flex-wrap gap-1">
                        {hotel.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                              tag.toLowerCase().includes("free cancellation")
                                ? "bg-[#1BA675]/10 text-[#1BA675]"
                                : "bg-slate-100 text-[#6B7280]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom row: Pricing & select button */}
                      <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#6B7280] block">Price per night</span>
                          <span className="text-base font-extrabold text-[#1F2933]">₹{startingPriceInRupees.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block leading-none">+ taxes & charges</span>
                        </div>

                        <button className="bg-[#0D6EFD] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-sm">
                          Select Room
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. HOTEL DETAILS SCREEN VIEW */}
      {screen === "DETAILS" && (
        <div className="flex-1 p-4 md:p-6 space-y-6">
          
          {/* Navigation breadcrumb */}
          <button
            onClick={() => setScreen("RESULTS")}
            className="flex items-center space-x-1 text-[#0D6EFD] hover:text-blue-700 text-xs font-bold transition self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Search Results</span>
          </button>

          {/* Hotel Title Header Area */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{selectedHotel.name}</h1>
                  <div className="flex text-[#F4B400] shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedHotel.area}, {selectedHotel.city}, India • {selectedHotel.distance}</span>
                </div>
              </div>

              {/* Rating metrics info block */}
              <div className="flex items-center space-x-2 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-right leading-tight">
                  <span className="font-extrabold text-xs block text-slate-800">{selectedHotel.ratingText}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedHotel.ratingCount} reviews</span>
                </div>
                <div className="bg-[#0D6EFD] text-white px-2.5 py-1.5 rounded-lg text-sm font-extrabold font-mono">
                  {selectedHotel.rating.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Photo Carousel Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                <img
                  src={selectedHotel.photos[hotelPhotoIdx] || selectedHotel.mainPhoto}
                  alt={selectedHotel.name}
                  className="w-full h-full object-cover transition duration-300"
                />

                {/* Left/Right controls */}
                {selectedHotel.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setHotelPhotoIdx(prev => (prev === 0 ? selectedHotel.photos.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow-md text-slate-800 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setHotelPhotoIdx(prev => (prev === selectedHotel.photos.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-2 rounded-full shadow-md text-slate-800 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full">
                  {selectedHotel.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHotelPhotoIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === hotelPhotoIdx ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Smaller grids side cards */}
              <div className="md:col-span-4 hidden md:flex flex-col gap-3">
                {selectedHotel.photos.map((ph, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setHotelPhotoIdx(pIdx)}
                    className={`h-28 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                      pIdx === hotelPhotoIdx ? "border-[#0D6EFD] shadow-md" : "border-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <img src={ph} alt="Side room perspective" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details sections tabs bar */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-100 p-2 bg-slate-50 shrink-0">
              <button
                onClick={() => setActiveDetailTab("overview")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeDetailTab === "overview"
                    ? "bg-[#0D6EFD] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveDetailTab("rooms")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
                  activeDetailTab === "rooms"
                    ? "bg-[#0D6EFD] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Select Rooms</span>
                <span className="bg-red-500 text-white font-mono font-extrabold text-[9px] px-1 rounded">Deal</span>
              </button>
              <button
                onClick={() => setActiveDetailTab("amenities")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeDetailTab === "amenities"
                    ? "bg-[#0D6EFD] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Amenities
              </button>
              <button
                onClick={() => setActiveDetailTab("reviews")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeDetailTab === "reviews"
                    ? "bg-[#0D6EFD] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Guest Reviews ({selectedHotel.reviews.length})
              </button>
            </div>

            <div className="p-5 md:p-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeDetailTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider font-mono text-[#0D6EFD]">About this property</h3>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{selectedHotel.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    <div className="bg-[#1BA675]/5 rounded-xl p-3 border border-[#1BA675]/20 text-xs space-y-1.5">
                      <h4 className="text-[#1BA675] font-bold flex items-center space-x-1.5 uppercase font-mono tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Cancellation Policy:</span>
                      </h4>
                      <p className="text-slate-600 leading-normal">
                        This property offers <strong>FREE cancellation</strong> up to 24 hours prior to check-in. No credit card pre-payment is required—you pay upon arrival.
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs space-y-1.5">
                      <h4 className="text-amber-800 font-bold flex items-center space-x-1.5 uppercase font-mono tracking-wider">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span>Exclusive Welcome Promo:</span>
                      </h4>
                      <p className="text-slate-600 leading-normal">
                        Enter promo code <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-700">JAVAOOP10</code> in the checkout panel to get an automatic <strong>10% OFF</strong> your entire stay.
                      </p>
                    </div>
                  </div>

                  {/* Weather Station & Packing Advisor widget */}
                  <div className="border-t border-slate-150 pt-4 mt-2">
                    <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider font-mono mb-2.5 text-[#0D6EFD] flex items-center space-x-1.5">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Destination Climate & Packing Advisor</span>
                    </h4>
                    
                    {(() => {
                      const weather = getWeatherDataForCity(selectedHotel.city);
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                          {/* Left: Weather Dashboard */}
                          <div className="md:col-span-7 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Climate ({selectedHotel.city})</span>
                                <strong className="text-slate-800 text-sm block">{weather.desc}</strong>
                              </div>
                              <div className="flex items-center space-x-2 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/40">
                                {weather.icon}
                                <span className="text-sm font-extrabold text-slate-900 font-mono">{weather.temp}</span>
                              </div>
                            </div>

                            {/* 3-day forecast preview */}
                            <div className="border-t border-slate-200/60 pt-2 grid grid-cols-3 gap-2">
                              {weather.forecast.map((fc, idx) => (
                                <div key={idx} className="bg-white/65 rounded-lg p-2 text-center border border-slate-200/25 space-y-1">
                                  <span className="text-[10px] text-slate-400 font-bold block">{fc.day}</span>
                                  <div className="flex justify-center">{fc.icon}</div>
                                  <span className="text-[10px] font-extrabold text-slate-700 block font-mono">{fc.temp}</span>
                                  <span className="text-[8px] text-slate-400 block leading-none">{fc.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Smart Packing Checklist */}
                          <div className="md:col-span-5 bg-gradient-to-br from-blue-50/40 to-blue-50 rounded-xl p-3 border border-blue-100 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-blue-800 font-bold uppercase block tracking-wide">Luxe Packing Checklist</span>
                              <p className="text-[10px] text-slate-500 mb-2">Curated luxury items based on local conditions:</p>
                              <div className="grid grid-cols-1 gap-1.5">
                                {weather.packing.map((item, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D6EFD] shrink-0" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-[8px] text-blue-500/80 italic mt-2 text-right">
                              *Updated live 5 mins ago
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 2: ROOMS LISTING (The core feature mapped to Java simulator) */}
              {activeDetailTab === "rooms" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                    <div className="flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <strong>Real-time availability status:</strong> Select your preferred room category below. Room inventory is tracked live, and your selected room will be instantly secured.
                      </div>
                    </div>
                  </div>

                  {/* Side-by-Side Room Comparison Feature */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Interactive Room Comparison</span>
                      </h4>
                      <p className="text-[10px] text-slate-500">Need help deciding? View structural perks and premium inclusions side-by-side.</p>
                    </div>
                    <button
                      onClick={() => setCompareRoomsActive(prev => !prev)}
                      className={`text-[10px] font-bold px-3.5 py-2 rounded-lg border transition cursor-pointer shrink-0 uppercase tracking-wider font-mono ${
                        compareRoomsActive 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm animate-pulse" 
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {compareRoomsActive ? "Hide comparison grid" : "Show comparison grid"}
                    </button>
                  </div>

                  {compareRoomsActive && (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/60 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[
                          {
                            type: "SINGLE",
                            displayName: "Single Business Pod",
                            badge: "Tech Workstation",
                            capacity: "1 Guest max",
                            bath: "Private rain shower",
                            view: "City / courtyard views",
                            perk: "Ergonomic standing desk & smart assistant voice controls"
                          },
                          {
                            type: "DOUBLE",
                            displayName: "Double Comfort Room",
                            badge: "Cozy Balcony",
                            capacity: "2 Guests max",
                            bath: "Glass walk-in shower",
                            view: "Partial sea / garden views",
                            perk: "Pre-stocked mini espresso bar & French balcony sunbed"
                          },
                          {
                            type: "DELUXE",
                            displayName: "Deluxe Ocean Panorama",
                            badge: "Horizon Terrace",
                            capacity: "3 Guests max",
                            bath: "Deep freestanding bath",
                            view: "Full unobstructed panorama",
                            perk: "Bespoke lounge access with complimentary evening drinks"
                          },
                          {
                            type: "SUITE",
                            displayName: "Viceroy Grand Suite",
                            badge: "Ultimate Prestige",
                            capacity: "5-6 Guests max",
                            bath: "In-room dual jacuzzi tub",
                            view: "Top tier sky penthouses",
                            perk: "24/7 dedicated butler service & VIP airport transfers"
                          }
                        ].map((comp, idx) => {
                          const matchingRoom = selectedHotel.rooms.find(r => r.type === comp.type);
                          const jvmRoom = simulator.rooms.find(r => r.type === comp.type && r.isAvailable);
                          const isVacant = !!jvmRoom && !!matchingRoom;

                          return (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200/85 p-3 flex flex-col justify-between shadow-sm relative overflow-hidden">
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[8px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">{comp.badge}</span>
                                  <h5 className="font-bold text-xs text-slate-800 mt-1.5 leading-tight">{comp.displayName}</h5>
                                </div>
                                
                                <div className="space-y-1.5 border-t border-slate-100 pt-2 text-[9px] text-slate-600">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Capacity:</span>
                                    <span className="font-bold text-slate-700">{comp.capacity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Bathroom:</span>
                                    <span className="font-semibold text-slate-700 truncate max-w-[100px]">{comp.bath}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Vibe/View:</span>
                                    <span className="font-semibold text-slate-700 truncate max-w-[100px]">{comp.view}</span>
                                  </div>
                                </div>

                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                                  <span className="text-[8px] text-slate-400 uppercase font-bold block">Prime Inclusion:</span>
                                  <p className="text-[9px] text-slate-600 leading-normal font-medium">{comp.perk}</p>
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-slate-100 text-center space-y-2">
                                {matchingRoom ? (
                                  <>
                                    <div className="leading-none">
                                      <span className="text-[8px] text-slate-400">Starting from</span>
                                      <strong className="text-xs text-slate-800 block">₹{Math.round(matchingRoom.pricePerNight * 84).toLocaleString()}/N</strong>
                                    </div>
                                    <button
                                      disabled={!isVacant}
                                      onClick={() => handleInitiateBooking(matchingRoom)}
                                      className={`w-full text-[9px] font-bold py-1.5 rounded transition ${
                                        isVacant
                                          ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                      }`}
                                    >
                                      {isVacant ? "Choose Category" : "Sold Out"}
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-mono italic block py-2">Not at this property</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {selectedHotel.rooms.map((room) => {
                      // Lookup availability in simulator rooms list
                      const jvmRoom = simulator.rooms.find(r => r.type === room.type && r.isAvailable);
                      const isVacant = !!jvmRoom;
                      const priceInRupees = Math.round(room.pricePerNight * 84);

                      return (
                        <div
                          key={room.roomNumber}
                          className={`bg-white rounded-xl border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                            isVacant ? "border-slate-200 shadow-sm" : "border-slate-100 bg-slate-50/50 opacity-75"
                          }`}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm md:text-base font-bold text-slate-900">{simulator.getRoomTypeDisplayName(room.type)}</h4>
                              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                                Limit: {room.maxGuests} Guest{room.maxGuests > 1 ? "s" : ""}
                              </span>
                              
                              {isVacant ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 font-extrabold px-2 py-0.5 rounded-full">
                                  ● Room #{jvmRoom.roomNumber} is Available
                                </span>
                              ) : (
                                <span className="text-[10px] bg-red-50 text-red-600 border border-red-200/50 font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                                  <Ban className="w-3 h-3" />
                                  <span>Fully booked for selected dates</span>
                                </span>
                              )}
                            </div>

                            <p className="text-slate-600 text-xs leading-relaxed">{room.description}</p>
                            
                            {/* Room specific amenities */}
                            <div className="flex flex-wrap gap-1.5">
                              {room.amenities.map((am, idx) => (
                                <span key={idx} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-semibold font-mono">
                                  ✓ {am}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-stretch justify-center gap-1.5 shrink-0 w-full md:w-auto md:border-l md:border-slate-100 md:pl-5">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Rate per night</span>
                              <span className="text-base font-extrabold text-slate-900 leading-tight">₹{priceInRupees.toLocaleString()}</span>
                              <span className="text-[9px] text-slate-400 block leading-none">₹{(priceInRupees * nightsCount).toLocaleString()} total ({nightsCount} nights)</span>
                            </div>

                            <button
                              disabled={!isVacant}
                              onClick={() => handleInitiateBooking(room)}
                              className={`w-full text-xs font-bold px-3 py-2.5 rounded-lg transition text-center shadow-sm cursor-pointer ${
                                isVacant
                                  ? "bg-[#0D6EFD] hover:bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              {isVacant ? "Instant Book" : "Sold Out"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: AMENITIES */}
              {activeDetailTab === "amenities" && (
                <div className="space-y-4">
                  <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider font-mono text-[#0D6EFD]">General Amenities & Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedHotel.amenities.map((am, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 p-3 rounded-xl flex items-center space-x-3 text-slate-700 shadow-sm">
                        <div className="text-[#0D6EFD] bg-[#0D6EFD]/10 p-2 rounded-lg">
                          {getAmenityIcon(am.iconName)}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{am.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeDetailTab === "reviews" && (
                <div className="space-y-4">
                  <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider font-mono text-[#0D6EFD]">Guest Satisfaction & Verified Feedback</h3>
                  
                  {/* Rating distribution & Sentiment highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    {/* Overall rating */}
                    <div className="md:col-span-3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3 shrink-0">
                      <span className="text-[36px] font-black text-slate-800 leading-none">{selectedHotel.rating.toFixed(1)}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full mt-2 uppercase tracking-wide">
                        {selectedHotel.rating >= 9.0 ? "Exceptional" : selectedHotel.rating >= 8.0 ? "Very Good" : "Highly Rated"}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">Based on {selectedHotel.reviews.length} check-ins</span>
                    </div>

                    {/* Star distribution */}
                    <div className="md:col-span-5 space-y-1.5 justify-center flex flex-col">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Feedback distribution:</div>
                      
                      {/* Elite 9-10 */}
                      <button
                        type="button"
                        onClick={() => setSelectedReviewRatingFilter(selectedReviewRatingFilter === 10 ? null : 10)}
                        className={`w-full flex items-center space-x-2 text-[10px] p-1 rounded-md transition cursor-pointer ${
                          selectedReviewRatingFilter === 10 ? "bg-blue-100/50" : "hover:bg-slate-100/80"
                        }`}
                      >
                        <span className="w-16 text-left font-semibold text-slate-600">Excellent (9+)</span>
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#1BA675] h-full rounded-full" style={{ width: `${(selectedHotel.reviews.filter(r => r.rating >= 9.0).length / selectedHotel.reviews.length) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right text-slate-500 font-bold font-mono">{selectedHotel.reviews.filter(r => r.rating >= 9.0).length}</span>
                      </button>

                      {/* Very Good 7-9 */}
                      <button
                        type="button"
                        onClick={() => setSelectedReviewRatingFilter(selectedReviewRatingFilter === 8 ? null : 8)}
                        className={`w-full flex items-center space-x-2 text-[10px] p-1 rounded-md transition cursor-pointer ${
                          selectedReviewRatingFilter === 8 ? "bg-blue-100/50" : "hover:bg-slate-100/80"
                        }`}
                      >
                        <span className="w-16 text-left font-semibold text-slate-600">Good (7-9)</span>
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#0D6EFD] h-full rounded-full" style={{ width: `${(selectedHotel.reviews.filter(r => r.rating >= 7.0 && r.rating < 9.0).length / selectedHotel.reviews.length) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right text-slate-500 font-bold font-mono">{selectedHotel.reviews.filter(r => r.rating >= 7.0 && r.rating < 9.0).length}</span>
                      </button>

                      {/* Fair <7 */}
                      <button
                        type="button"
                        onClick={() => setSelectedReviewRatingFilter(selectedReviewRatingFilter === 6 ? null : 6)}
                        className={`w-full flex items-center space-x-2 text-[10px] p-1 rounded-md transition cursor-pointer ${
                          selectedReviewRatingFilter === 6 ? "bg-blue-100/50" : "hover:bg-slate-100/80"
                        }`}
                      >
                        <span className="w-16 text-left font-semibold text-slate-600">Fair (&lt;7)</span>
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(selectedHotel.reviews.filter(r => r.rating < 7.0).length / selectedHotel.reviews.length) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right text-slate-500 font-bold font-mono">{selectedHotel.reviews.filter(r => r.rating < 7.0).length}</span>
                      </button>
                    </div>

                    {/* Sentiment highlight terms */}
                    <div className="md:col-span-4 flex flex-col justify-center space-y-1.5 md:pl-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Key Guest Highlights:</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded-full">✓ Exemplary Staff</span>
                        <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-100 font-bold px-2 py-0.5 rounded-full">✓ Pristine Cleanliness</span>
                        <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-100 font-bold px-2 py-0.5 rounded-full">✓ Scenic Sunsets</span>
                        <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded-full">✓ Smooth Check-in</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter notice */}
                  {selectedReviewRatingFilter !== null && (
                    <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 px-3.5 py-2 rounded-xl text-xs text-blue-800">
                      <span>Showing reviews filtered by selected score bucket.</span>
                      <button
                        onClick={() => setSelectedReviewRatingFilter(null)}
                        className="text-[10px] font-extrabold text-[#0D6EFD] underline uppercase tracking-wide cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  )}

                  {/* Review Cards list */}
                  <div className="space-y-3">
                    {(() => {
                      const list = selectedReviewRatingFilter 
                        ? selectedHotel.reviews.filter(r => {
                            if (selectedReviewRatingFilter === 10) return r.rating >= 9.0;
                            if (selectedReviewRatingFilter === 8) return r.rating >= 7.0 && r.rating < 9.0;
                            if (selectedReviewRatingFilter === 6) return r.rating < 7.0;
                            return true;
                          })
                        : selectedHotel.reviews;

                      if (list.length === 0) {
                        return (
                          <div className="text-center py-6 bg-white border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                            No reviews in this category. Click 'Reset Filter' above.
                          </div>
                        );
                      }

                      return list.map((rev, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-150 p-4 shadow-sm space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 font-extrabold text-slate-700 flex items-center justify-center text-xs font-mono uppercase border border-slate-200">
                                {rev.userName.slice(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{rev.userName}</h4>
                                <span className="text-[10px] text-slate-400 block leading-none">Reviewed on {rev.date}</span>
                              </div>
                            </div>

                            <span className="bg-[#0D6EFD]/10 text-[#0D6EFD] font-extrabold px-2.5 py-1 rounded text-xs font-mono">
                              {rev.rating.toFixed(1)} / 10
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 4. MY BOOKINGS VIEW */}
      {screen === "MY_BOOKINGS" && (
        <div className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Your Confirmed Bookings</h2>
              <p className="text-xs text-slate-500">Manage your active itineraries and travel invoices.</p>
            </div>
            <button
              onClick={() => setScreen("HOME")}
              className="bg-[#0D6EFD] hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Book Another Room
            </button>
          </div>

          <div className="space-y-4 max-w-3xl">
            {simulator.bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <Clock className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">No active bookings registered yet</h3>
                <p className="text-xs text-slate-500">Start by exploring hotels and selecting rooms to complete your first booking transaction!</p>
              </div>
            ) : (
              [...simulator.bookings].reverse().map((bk) => (
                <div
                  key={bk.bookingId}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition space-y-4 ${
                    bk.isCancelled ? "border-slate-200 bg-slate-50/50 opacity-70" : "border-slate-200"
                  }`}
                >
                  {/* Receipt Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-[#1F2937] bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-xs">
                          {bk.bookingId}
                        </span>
                        <h3 className="font-bold text-xs text-[#4B5563]">Official Luxe Haven Receipt</h3>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{bk.guestName}</h4>
                    </div>

                    <div className="text-right">
                      {bk.isCancelled ? (
                        <span className="bg-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-1 rounded-lg">
                          Cancelled & Released
                        </span>
                      ) : (
                        <span className="bg-[#1BA675]/10 text-[#1BA675] text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-1 rounded-lg">
                          ✓ Paid & Confirmed
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">Room Number: #{bk.roomNumber}</span>
                    </div>
                  </div>

                  {/* Receipt details columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Stay Category</span>
                      <strong className="text-slate-800 font-extrabold block">{bk.roomType}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Stay Duration</span>
                      <strong className="text-slate-800 font-extrabold block">{bk.numberOfNights} Nights</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Check-In</span>
                      <strong className="text-slate-800 font-extrabold block">{bk.checkInDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Check-Out</span>
                      <strong className="text-slate-800 font-extrabold block">{bk.checkOutDate}</strong>
                    </div>
                  </div>

                  {/* Financial & Cancel row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Settled Bill:</span>
                      <strong className="text-base font-extrabold text-[#1F2933]">
                        ₹{Math.round(bk.totalAmount * 84).toLocaleString()}
                      </strong>
                    </div>

                    {!bk.isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(bk.bookingId)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Booking Safely</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* INSTANT BOOKING MODAL (WIZARD OVERLAY) */}
      {bookingRoom && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0D6EFD] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">Secure Booking Gateway</h3>
                <span className="text-[10px] text-blue-100 leading-tight block">Room {bookingRoom.roomNumber} • {selectedHotel.name}</span>
              </div>
              <button
                onClick={() => setBookingRoom(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form body */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Step indicator breadcrumbs */}
              <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-wider font-semibold text-[#6B7280] border-b border-slate-100 pb-2">
                <span className={paymentStep === "FORM" ? "text-[#0D6EFD]" : ""}>1. Guest Registration</span>
                <span>/</span>
                <span className={paymentStep === "PAYMENT" ? "text-[#0D6EFD]" : ""}>2. Payment</span>
                <span>/</span>
                <span className={paymentStep === "CONFIRMED" ? "text-[#0D6EFD]" : ""}>3. Receipt</span>
              </div>

              {bookingValidationError && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-xs flex items-start space-x-2">
                  <Ban className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{bookingValidationError}</span>
                </div>
              )}

              {/* STEP 1: REGISTRATION DETAILS FORM */}
              {paymentStep === "FORM" && (
                <form onSubmit={handleGuestFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Primary Guest Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Mehta"
                      value={bookingGuestName}
                      onChange={(e) => setBookingGuestName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] transition font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Contact Number (10-13 digits)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={bookingGuestPhone}
                      onChange={(e) => setBookingGuestPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] transition font-mono font-semibold"
                    />
                  </div>

                  {/* Dates recap */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">CHECK-IN</span>
                      <strong className="text-slate-800">{checkIn}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">CHECK-OUT</span>
                      <strong className="text-slate-800">{checkOut}</strong>
                    </div>
                  </div>

                  {/* Coupon Area */}
                  <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Promo / Voucher Code</label>
                      <span className="text-[10px] text-blue-600 font-bold flex items-center space-x-1">
                        <Gift className="w-3.5 h-3.5 text-blue-500" />
                        <span>Exclusive Privilege Club</span>
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#0D6EFD]"
                      />
                      <button
                        type="button"
                        onClick={() => applyDiscountCoupon()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shrink-0"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Interactive Clickable Vouchers Book */}
                    <div className="space-y-1.5 border-t border-slate-200/50 pt-2">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">Available Club Vouchers (Tap to Apply):</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            applyDiscountCoupon("HAVEN20");
                          }}
                          className={`text-left p-1.5 rounded-lg border text-[10px] transition cursor-pointer ${
                            couponApplied && couponCode.toUpperCase() === "HAVEN20"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 hover:border-blue-300 text-slate-700"
                          }`}
                        >
                          <div className="font-extrabold flex items-center justify-between">
                            <span className="font-mono">HAVEN20</span>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">20% Off</span>
                          </div>
                          <p className="text-[8px] text-slate-400 truncate">Elite club guest discount</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            applyDiscountCoupon("LUXURY25");
                          }}
                          className={`text-left p-1.5 rounded-lg border text-[10px] transition cursor-pointer ${
                            couponApplied && couponCode.toUpperCase() === "LUXURY25"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 hover:border-blue-300 text-slate-700"
                          }`}
                        >
                          <div className="font-extrabold flex items-center justify-between">
                            <span className="font-mono">LUXURY25</span>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">25% Off</span>
                          </div>
                          <p className="text-[8px] text-slate-400 truncate">Premium suites & deluxe only</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            applyDiscountCoupon("BREAKFAST");
                          }}
                          className={`text-left p-1.5 rounded-lg border text-[10px] transition cursor-pointer ${
                            couponApplied && couponCode.toUpperCase() === "BREAKFAST"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 hover:border-blue-300 text-slate-700"
                          }`}
                        >
                          <div className="font-extrabold flex items-center justify-between">
                            <span className="font-mono">BREAKFAST</span>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">15% Off</span>
                          </div>
                          <p className="text-[8px] text-slate-400 truncate">Dining & stay combo pack</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            applyDiscountCoupon("JAVAOOP10");
                          }}
                          className={`text-left p-1.5 rounded-lg border text-[10px] transition cursor-pointer ${
                            couponApplied && couponCode.toUpperCase() === "JAVAOOP10"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                              : "bg-white border-slate-200 hover:border-blue-300 text-slate-700"
                          }`}
                        >
                          <div className="font-extrabold flex items-center justify-between">
                            <span className="font-mono">JAVAOOP10</span>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">10% Off</span>
                          </div>
                          <p className="text-[8px] text-slate-400 truncate">Standard welcome voucher</p>
                        </button>
                      </div>
                    </div>

                    {couponApplied && (
                      <span className="text-[10px] text-[#1BA675] font-extrabold flex items-center space-x-1 bg-emerald-50 p-1.5 rounded border border-emerald-200/50">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Voucher Verified! ({discountPercentage}% discount applied successfully)</span>
                      </span>
                    )}
                    {couponError && (
                      <span className="text-[10px] text-red-500 font-semibold block bg-red-50 p-1.5 rounded border border-red-200/50">{couponError}</span>
                    )}
                  </div>

                  {/* Price Summary Panel */}
                  <div className="border border-slate-100/80 p-4 rounded-xl bg-slate-50 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Rate ({nightsCount} nights)</span>
                      <span>₹{(Math.round(bookingRoom.pricePerNight * 84) * nightsCount).toLocaleString()}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-xs text-[#1BA675] font-semibold">
                        <span>{discountPercentage}% Promo Discount</span>
                        <span>-₹{Math.round((Math.round(bookingRoom.pricePerNight * 84) * nightsCount) * (discountPercentage / 100)).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>GST & Local Tourism Taxes</span>
                      <span>₹{Math.round((Math.round(bookingRoom.pricePerNight * 84) * nightsCount) * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-extrabold text-sm text-slate-900">
                      <span>Total Amount Payable:</span>
                      <span>
                        ₹{Math.round(
                          (Math.round(bookingRoom.pricePerNight * 84) * nightsCount) * 
                          ((100 - (couponApplied ? discountPercentage : 0)) / 100) * 1.12
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow shadow-blue-500/25 flex items-center justify-center space-x-2 text-xs"
                  >
                    <span>Proceed to Secured Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: SECURED PAYMENT SIMULATION */}
              {paymentStep === "PAYMENT" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="bg-[#1BA675]/10 border border-[#1BA675]/20 p-3 rounded-xl text-[11px] text-slate-600 space-y-1 flex items-start space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#1BA675] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#1BA675] font-bold uppercase tracking-wider font-mono">Secured SSL Checkout Terminal</h4>
                      <p>Enter mock billing details below to finalize your booking reservation. Your details are transmitted over a secured visual portal sandbox.</p>
                    </div>
                  </div>

                  {/* Visual Credit Card Preview */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-2xl p-4 shadow-lg font-mono relative overflow-hidden h-36 flex flex-col justify-between border border-slate-700/50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-slate-400 tracking-wider block">PREMIUM SECURED CARD</span>
                        <div className="w-8 h-6 bg-amber-500/90 rounded-md mt-1.5 border border-amber-400 flex items-center justify-center opacity-80 shadow-inner">
                          <span className="text-[8px] font-bold text-amber-950 font-sans">CHIP</span>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold italic tracking-tight font-serif text-slate-100">Luxe Haven</span>
                    </div>
                    
                    <div className="text-center font-bold tracking-widest text-sm py-1 font-mono text-slate-100">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    
                    <div className="flex justify-between items-end text-[9px]">
                      <div>
                        <span className="text-slate-500 block uppercase font-sans text-[7px] leading-none mb-1">Cardholder</span>
                        <span className="font-bold tracking-wider truncate block max-w-[160px] text-slate-200">
                          {cardHolder.toUpperCase() || "YOUR FULL NAME"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block uppercase font-sans text-[7px] leading-none mb-1">Expires</span>
                        <span className="font-bold tracking-wider text-slate-200">{cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Mehta"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Credit / Debit Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] font-mono"
                      />
                      <CreditCard className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="***"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#0D6EFD] font-mono text-center"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setPaymentStep("FORM")}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl transition text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow shadow-blue-500/25 flex items-center justify-center space-x-1.5 text-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Transact</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: BOOKING CONFIRMED RECEIPT DISPLAY */}
              {paymentStep === "CONFIRMED" && activeBookingReceipt && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Room Booking Confirmed!</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">Your room reservation is secured. A copy of the receipt has been prepared below.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left font-mono text-xs text-slate-700 divide-y divide-slate-200/80 space-y-2 max-w-sm mx-auto shadow-sm">
                    <div className="flex justify-between pb-1.5 pt-1">
                      <span className="text-slate-400">BOOKING ID:</span>
                      <span className="font-extrabold text-slate-900">{activeBookingReceipt.bookingId}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">ASSIGNED ROOM:</span>
                      <span className="font-bold text-slate-900">Room #{activeBookingReceipt.roomNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">ROOM CLASS:</span>
                      <span className="font-bold text-slate-900">{activeBookingReceipt.roomType}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">CHECK-IN:</span>
                      <span className="text-slate-900">{activeBookingReceipt.checkInDate}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">STAY NIGHTS:</span>
                      <span className="text-slate-900">{activeBookingReceipt.numberOfNights} Nights</span>
                    </div>
                    <div className="flex justify-between pt-1.5 font-bold text-slate-900">
                      <span className="text-slate-400">TOTAL PAID:</span>
                      <span className="text-[#1F2933]">₹{Math.round(activeBookingReceipt.totalAmount * 84).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingRoom(null);
                      setScreen("MY_BOOKINGS");
                    }}
                    className="w-full bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow text-xs"
                  >
                    View My Registered Bookings
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
