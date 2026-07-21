import { RoomType } from "./types";

export interface SimulatedRoom {
  roomNumber: string;
  type: "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";
  pricePerNight: number;
  isAvailable: boolean;
  maxGuests: number;
}

export interface SimulatedBooking {
  bookingId: string;
  guestName: string;
  contactNumber: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  totalAmount: number;
  isCancelled: boolean;
}

export type SimulatorState =
  | "MAIN_MENU"
  | "SEARCH_ROOMS_TYPE"
  | "BOOK_NAME"
  | "BOOK_PHONE"
  | "BOOK_TYPE"
  | "BOOK_IN"
  | "BOOK_OUT"
  | "BOOK_GUESTS"
  | "VIEW_DETAILS"
  | "CANCEL_BOOKING"
  | "WAIT_ENTER";

export class JavaConsoleSimulator {
  public rooms: SimulatedRoom[] = [];
  public bookings: SimulatedBooking[] = [];
  public logs: string[] = [];
  public currentState: SimulatorState = "MAIN_MENU";
  public nextStateAfterEnter: SimulatorState = "MAIN_MENU";
  
  // Transient booking wizard data
  public wizardData = {
    guestName: "",
    contactNumber: "",
    roomType: "" as "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE" | "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1
  };

  // Temp storage for other inputs
  public tempSearchType = "";
  public tempViewId = "";
  public tempCancelId = "";

  constructor() {
    this.reset();
  }

  public reset() {
    this.rooms = [
      { roomNumber: "101", type: "SINGLE", pricePerNight: 120.0, isAvailable: true, maxGuests: 1 },
      { roomNumber: "102", type: "SINGLE", pricePerNight: 120.0, isAvailable: true, maxGuests: 1 },
      { roomNumber: "103", type: "SINGLE", pricePerNight: 120.0, isAvailable: true, maxGuests: 1 },
      { roomNumber: "201", type: "DOUBLE", pricePerNight: 180.0, isAvailable: true, maxGuests: 2 },
      { roomNumber: "202", type: "DOUBLE", pricePerNight: 180.0, isAvailable: true, maxGuests: 2 },
      { roomNumber: "203", type: "DOUBLE", pricePerNight: 180.0, isAvailable: true, maxGuests: 2 },
      { roomNumber: "301", type: "DELUXE", pricePerNight: 300.0, isAvailable: true, maxGuests: 3 },
      { roomNumber: "302", type: "DELUXE", pricePerNight: 300.0, isAvailable: true, maxGuests: 3 },
      { roomNumber: "401", type: "SUITE", pricePerNight: 600.0, isAvailable: true, maxGuests: 5 },
      { roomNumber: "402", type: "SUITE", pricePerNight: 600.0, isAvailable: true, maxGuests: 5 }
    ];

    // Some default booking logs to demonstrate history
    this.bookings = [
      {
        bookingId: "BK4829",
        guestName: "Jane Smith",
        contactNumber: "9876543210",
        roomNumber: "201",
        roomType: "Double Room",
        checkInDate: "2026-07-22",
        checkOutDate: "2026-07-25",
        numberOfNights: 3,
        numberOfGuests: 2,
        totalAmount: 540.0,
        isCancelled: false
      },
      {
        bookingId: "BK9104",
        guestName: "Arjun Sharma",
        contactNumber: "919988776655",
        roomNumber: "401",
        roomType: "Presidential Suite",
        checkInDate: "2026-08-10",
        checkOutDate: "2026-08-12",
        numberOfNights: 2,
        numberOfGuests: 4,
        totalAmount: 1200.0,
        isCancelled: true
      }
    ];

    // Occupy room 201 because of active booking
    this.rooms.forEach(r => {
      if (r.roomNumber === "201") {
        r.isAvailable = false;
      }
    });

    this.logs = [
      "=================================================",
      "   WELCOME TO LUXE HAVEN ROOM BOOKING SYSTEM     ",
      "=================================================",
      "[System] Mock JVM v21.0.1 successfully initialized.",
      "[System] Mounting file-based persistent storage: 'data/rooms.csv'",
      "[System] Loaded " + this.rooms.length + " rooms from flat-file database.",
      "[System] Loaded " + this.bookings.length + " bookings from 'data/bookings.csv'."
    ];

    this.currentState = "MAIN_MENU";
    this.printMainMenu();
  }

  public getRoomTypeDisplayName(type: string): string {
    switch (type) {
      case "SINGLE": return "Single Room";
      case "DOUBLE": return "Double Room";
      case "DELUXE": return "Deluxe Room";
      case "SUITE": return "Presidential Suite";
      default: return type;
    }
  }

  public printMainMenu() {
    this.logs.push(
      "",
      "------------------ MAIN MENU ------------------",
      "1. View All Available Rooms",
      "2. Search Rooms by Category",
      "3. Place a Room Booking",
      "4. Retrieve Booking Details by ID",
      "5. Cancel an Existing Booking",
      "6. Retrieve Booking History logs",
      "7. Admin & Financial Insights Panel",
      "8. Exit Application Safely",
      "------------------------------------------------"
    );
  }

  public handleInput(input: string) {
    const cleanInput = input.trim();
    this.logs.push(`> ${input}`);

    if (this.currentState === "WAIT_ENTER") {
      this.currentState = this.nextStateAfterEnter;
      if (this.currentState === "MAIN_MENU") {
        this.printMainMenu();
      }
      return;
    }

    switch (this.currentState) {
      case "MAIN_MENU":
        this.processMainMenuChoice(cleanInput);
        break;

      case "SEARCH_ROOMS_TYPE":
        this.processSearchType(cleanInput);
        break;

      case "BOOK_NAME":
        this.wizardData.guestName = cleanInput;
        if (!cleanInput) {
          this.logs.push("[ERROR] Guest name cannot be empty. Please enter Name.");
        } else {
          this.currentState = "BOOK_PHONE";
          this.logs.push("Enter Contact Number (10-13 digits):");
        }
        break;

      case "BOOK_PHONE":
        const phoneRegex = /^[+]?[0-9]{10,13}$/;
        if (!phoneRegex.test(cleanInput)) {
          this.logs.push("[ERROR] Invalid contact number. Must be 10 to 13 digits. Re-enter:");
        } else {
          this.wizardData.contactNumber = cleanInput;
          this.currentState = "BOOK_TYPE";
          this.logs.push(
            "Select Room Class (SINGLE, DOUBLE, DELUXE, SUITE):"
          );
        }
        break;

      case "BOOK_TYPE":
        const typeUpper = cleanInput.toUpperCase();
        if (typeUpper !== "SINGLE" && typeUpper !== "DOUBLE" && typeUpper !== "DELUXE" && typeUpper !== "SUITE") {
          this.logs.push("[ERROR] Invalid room type. Enter SINGLE, DOUBLE, DELUXE, or SUITE:");
        } else {
          this.wizardData.roomType = typeUpper as any;
          this.currentState = "BOOK_IN";
          this.logs.push("Enter Check-In Date (YYYY-MM-DD):");
        }
        break;

      case "BOOK_IN":
        // Date parsing simulation
        const inDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!inDateRegex.test(cleanInput)) {
          this.logs.push("[ERROR] Invalid format. Use YYYY-MM-DD (e.g., 2026-07-21). Re-enter:");
        } else {
          this.wizardData.checkInDate = cleanInput;
          this.currentState = "BOOK_OUT";
          this.logs.push("Enter Check-Out Date (YYYY-MM-DD):");
        }
        break;

      case "BOOK_OUT":
        const outDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!outDateRegex.test(cleanInput)) {
          this.logs.push("[ERROR] Invalid format. Use YYYY-MM-DD (e.g., 2026-07-22). Re-enter:");
        } else {
          // Check date sequence logic
          try {
            const checkIn = new Date(this.wizardData.checkInDate);
            const checkOut = new Date(cleanInput);
            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
              throw new Error("Date parse exception");
            }
            if (checkOut <= checkIn) {
              this.logs.push("[ERROR] Check-out date must be after check-in date. Re-enter Check-Out:");
            } else {
              this.wizardData.checkOutDate = cleanInput;
              this.currentState = "BOOK_GUESTS";
              this.logs.push("Enter Total Number of Guests:");
            }
          } catch {
            this.logs.push("[ERROR] Error parsing dates. Re-enter Check-Out Date (YYYY-MM-DD):");
          }
        }
        break;

      case "BOOK_GUESTS":
        const guestsNum = parseInt(cleanInput, 10);
        if (isNaN(guestsNum) || guestsNum <= 0) {
          this.logs.push("[ERROR] Guest count must be a positive number. Re-enter:");
        } else {
          // Validate room capacity limit
          const maxCapacityMap = { SINGLE: 1, DOUBLE: 2, DELUXE: 3, SUITE: 5 };
          const limit = maxCapacityMap[this.wizardData.roomType as "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE"];
          if (guestsNum > limit) {
            this.logs.push(`[ERROR] Over-occupancy! ${this.getRoomTypeDisplayName(this.wizardData.roomType)} accommodates a maximum of ${limit} guests. Re-enter:`);
          } else {
            this.wizardData.numberOfGuests = guestsNum;
            this.completeRoomBooking();
          }
        }
        break;

      case "VIEW_DETAILS":
        this.processViewBooking(cleanInput);
        break;

      case "CANCEL_BOOKING":
        this.processCancelBooking(cleanInput);
        break;
    }
  }

  private processMainMenuChoice(choice: string) {
    switch (choice) {
      case "1":
        this.displayAvailableRooms();
        this.promptPressEnter();
        break;
      case "2":
        this.currentState = "SEARCH_ROOMS_TYPE";
        this.logs.push(
          "====== ROOM CATEGORY EXPLORER ======",
          "Available categories: SINGLE, DOUBLE, DELUXE, SUITE",
          "Enter room type:"
        );
        break;
      case "3":
        this.currentState = "BOOK_NAME";
        // Reset wizard
        this.wizardData = {
          guestName: "",
          contactNumber: "",
          roomType: "",
          checkInDate: "",
          checkOutDate: "",
          numberOfGuests: 1
        };
        this.logs.push(
          "====== PLACE NEW ROOM BOOKING ======",
          "Enter Guest's Full Name:"
        );
        break;
      case "4":
        this.currentState = "VIEW_DETAILS";
        this.logs.push(
          "====== BOOKING RETRIEVAL ENGINE ======",
          "Enter Booking ID (e.g. BK4829):"
        );
        break;
      case "5":
        this.currentState = "CANCEL_BOOKING";
        this.logs.push(
          "====== CANCELLATION REQUEST OFFICE ======",
          "Enter Booking ID to cancel:"
        );
        break;
      case "6":
        this.viewBookingHistory();
        this.promptPressEnter();
        break;
      case "7":
        this.showAdminInsights();
        this.promptPressEnter();
        break;
      case "8":
        this.logs.push(
          "Thank you for choosing Luxe Haven. Safely exiting application...",
          "[Mock JVM] Process finished with exit code 0."
        );
        this.currentState = "WAIT_ENTER";
        this.nextStateAfterEnter = "MAIN_MENU";
        break;
      default:
        this.logs.push("[ERROR] Invalid choice. Please enter a choice between 1 and 8.");
        this.printMainMenu();
    }
  }

  private displayAvailableRooms() {
    this.logs.push("====== CURRENTLY AVAILABLE ROOMS ======");
    const available = this.rooms.filter(r => r.isAvailable);
    if (available.length === 0) {
      this.logs.push("No rooms available at the moment! Hotel is completely full.");
    } else {
      available.forEach(r => {
        this.logs.push(this.formatRoomString(r));
      });
    }
  }

  private formatRoomString(r: SimulatedRoom): string {
    const status = r.isAvailable ? "AVAILABLE" : "OCCUPIED";
    return `Room #${r.roomNumber.padEnd(4)} | ${this.getRoomTypeDisplayName(r.type).padEnd(18)} | $${r.pricePerNight.toFixed(2)}/night | ${status}`;
  }

  private processSearchType(input: string) {
    const category = input.toUpperCase();
    if (category !== "SINGLE" && category !== "DOUBLE" && category !== "DELUXE" && category !== "SUITE") {
      this.logs.push(`[ERROR] '${input}' is not a valid room category.`);
      this.promptPressEnter();
      return;
    }

    this.logs.push(`\nResults for '${this.getRoomTypeDisplayName(category)}':`);
    const results = this.rooms.filter(r => r.type === category);
    results.forEach(r => {
      this.logs.push(this.formatRoomString(r));
    });

    this.promptPressEnter();
  }

  private completeRoomBooking() {
    // Check room availability for selected class
    const selectedType = this.wizardData.roomType;
    const availableRoom = this.rooms.find(r => r.isAvailable && r.type === selectedType);

    if (!availableRoom) {
      this.logs.push(
        `Booking Refused: No rooms of type ${this.getRoomTypeDisplayName(selectedType)} are currently available.`,
        "Transaction aborted."
      );
      this.promptPressEnter();
      return;
    }

    // Set occupied
    availableRoom.isAvailable = false;

    // Calculate dates & nights
    const start = new Date(this.wizardData.checkInDate);
    const end = new Date(this.wizardData.checkOutDate);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const total = nights * availableRoom.pricePerNight;
    const bookingId = "BK" + (Math.floor(Math.random() * 9000) + 1000);

    const booking: SimulatedBooking = {
      bookingId,
      guestName: this.wizardData.guestName,
      contactNumber: this.wizardData.contactNumber,
      roomNumber: availableRoom.roomNumber,
      roomType: this.getRoomTypeDisplayName(selectedType),
      checkInDate: this.wizardData.checkInDate,
      checkOutDate: this.wizardData.checkOutDate,
      numberOfNights: nights,
      numberOfGuests: this.wizardData.numberOfGuests,
      totalAmount: total,
      isCancelled: false
    };

    this.bookings.push(booking);

    this.logs.push(
      "",
      "🎉 BOOKING CONFIRMED SUCCESSFULLY! 🎉",
      "----------------------------------------------",
      "Booking ID      : " + booking.bookingId,
      "Room Number     : " + booking.roomNumber,
      "Room Type       : " + booking.roomType,
      "Stay Duration   : " + booking.numberOfNights + " nights",
      "Total Amount    : $" + booking.totalAmount.toFixed(2),
      "Check-In Date   : " + booking.checkInDate,
      "Check-Out Date  : " + booking.checkOutDate,
      "----------------------------------------------",
      "[System] Syncing with rooms.csv database...",
      "[System] Appending receipt log row to bookings.csv database..."
    );

    this.promptPressEnter();
  }

  private processViewBooking(bookingId: string) {
    const booking = this.bookings.find(b => b.bookingId.equalsIgnoreCase(bookingId));
    if (!booking) {
      this.logs.push(`[ERROR] Booking with ID '${bookingId}' not found.`);
    } else {
      const status = booking.isCancelled ? "CANCELLED" : "CONFIRMED";
      this.logs.push(
        "\n------ RECORD LOCATED ------",
        `Booking ID : ${booking.bookingId}`,
        `Guest Name : ${booking.guestName}`,
        `Phone Num  : ${booking.contactNumber}`,
        `Room #     : ${booking.roomNumber} (${booking.roomType})`,
        `Stay Dates : ${booking.checkInDate} to ${booking.checkOutDate} (${booking.numberOfNights} nights)`,
        `Total Paid : $${booking.totalAmount.toFixed(2)}`,
        `Guests     : ${booking.numberOfGuests}`,
        `Status     : ${status}`,
        "----------------------------"
      );
    }
    this.promptPressEnter();
  }

  private processCancelBooking(bookingId: string) {
    const booking = this.bookings.find(b => b.bookingId.equalsIgnoreCase(bookingId));
    if (!booking) {
      this.logs.push(`Cancellation Refused: Booking with ID '${bookingId}' not found.`);
    } else if (booking.isCancelled) {
      this.logs.push("Cancellation Refused: Booking is already cancelled.");
    } else {
      booking.isCancelled = true;
      // Release room
      const room = this.rooms.find(r => r.roomNumber === booking.roomNumber);
      if (room) {
        room.isAvailable = true;
      }
      this.logs.push(
        `\n✅ Success: Booking '${bookingId}' has been cancelled.`,
        "The corresponding room #" + booking.roomNumber + " is now released back into the available pool.",
        "[System] Overwriting bookings.csv with updated cancellation tags...",
        "[System] Overwriting rooms.csv with updated room vacancy flags..."
      );
    }
    this.promptPressEnter();
  }

  private viewBookingHistory() {
    this.logs.push("====== BOOKING ARCHIVE LOGS ======");
    if (this.bookings.length === 0) {
      this.logs.push("Booking registry is completely empty. No historical logs.");
    } else {
      this.bookings.forEach(b => {
        const status = b.isCancelled ? "CANCELLED" : "CONFIRMED";
        this.logs.push(
          `ID: ${b.bookingId.padEnd(7)} | Guest: ${b.guestName.padEnd(15)} | Room: #${b.roomNumber.padEnd(4)} (${b.roomType.slice(0, 8)}) | Nights: ${String(b.numberOfNights).padEnd(2)} | Total: $${b.totalAmount.toFixed(2).padEnd(7)} | Status: ${status}`
        );
      });
    }
  }

  private showAdminInsights() {
    this.logs.push("====== ADMIN STRATEGIC PANEL ======");
    const totalBookings = this.bookings.length;
    const cancelled = this.bookings.filter(b => b.isCancelled).length;
    const activeRevenue = this.bookings
      .filter(b => !b.isCancelled)
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const vacantRooms = this.rooms.filter(r => r.isAvailable).length;

    this.logs.push(
      "----------------------------------------------",
      "Total Volume of Bookings : " + totalBookings,
      "Cancelled Registrations  : " + cancelled,
      "Gross Settled Revenue    : $" + activeRevenue.toFixed(2),
      "Current Vacant Rooms     : " + vacantRooms + " rooms",
      "----------------------------------------------"
    );
  }

  private promptPressEnter() {
    this.logs.push("\nPress ENTER to return to Main Menu...");
    this.currentState = "WAIT_ENTER";
    this.nextStateAfterEnter = "MAIN_MENU";
  }

  public placeVisualBooking(data: {
    guestName: string;
    contactNumber: string;
    roomType: "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    discountApplied?: boolean;
    hotelName?: string;
    roomNumber?: string;
  }): SimulatedBooking | string {
    const availableRoom = data.roomNumber
      ? this.rooms.find(r => r.isAvailable && r.roomNumber === data.roomNumber)
      : this.rooms.find(r => r.isAvailable && r.type === data.roomType);

    if (!availableRoom) {
      return "No vacant rooms of this type are available.";
    }

    availableRoom.isAvailable = false;

    const start = new Date(data.checkInDate);
    const end = new Date(data.checkOutDate);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    let total = nights * availableRoom.pricePerNight;
    if (data.discountApplied) {
      total = total * 0.9; // 10% off
    }
    total = total * 1.12; // 12% tax & local tourism fees

    const bookingId = "BK" + (Math.floor(Math.random() * 9000) + 1000);

    const booking: SimulatedBooking = {
      bookingId,
      guestName: data.guestName,
      contactNumber: data.contactNumber,
      roomNumber: availableRoom.roomNumber,
      roomType: this.getRoomTypeDisplayName(data.roomType),
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      numberOfNights: nights,
      numberOfGuests: data.numberOfGuests,
      totalAmount: total,
      isCancelled: false
    };

    this.bookings.push(booking);

    this.logs.push(
      "",
      `[JVM External] Visual Client Event: Room booking placed at '${data.hotelName || "Luxe Haven"}'`,
      "🎉 BOOKING REGISTERED IN JVM MEMORY 🎉",
      "----------------------------------------------",
      "Booking ID      : " + booking.bookingId,
      "Room Number     : " + booking.roomNumber,
      "Room Type       : " + booking.roomType,
      "Stay Duration   : " + booking.numberOfNights + " nights",
      "Total Amount    : $" + booking.totalAmount.toFixed(2) + (data.discountApplied ? " (10% Discount Applied)" : ""),
      "Check-In Date   : " + booking.checkInDate,
      "Check-Out Date  : " + booking.checkOutDate,
      "----------------------------------------------",
      "[System] Syncing state to data/rooms.csv database...",
      "[System] Appending persistent row to data/bookings.csv database..."
    );

    return booking;
  }

  public cancelVisualBooking(bookingId: string): boolean {
    const booking = this.bookings.find(b => b.bookingId.equalsIgnoreCase(bookingId));
    if (!booking || booking.isCancelled) {
      return false;
    }

    booking.isCancelled = true;
    const room = this.rooms.find(r => r.roomNumber === booking.roomNumber);
    if (room) {
      room.isAvailable = true;
    }

    this.logs.push(
      "",
      `[JVM External] Visual Client Event: Request to cancel booking '${bookingId}'`,
      `✅ Success: Booking '${bookingId}' has been cancelled.`,
      "Corresponding room #" + booking.roomNumber + " is now released back to the available pool.",
      "[System] Syncing changes with rooms.csv and bookings.csv databases..."
    );

    return true;
  }
}

// Inline polyfill for equalsIgnoreCase
declare global {
  interface String {
    equalsIgnoreCase(other: string): boolean;
  }
}

if (!String.prototype.equalsIgnoreCase) {
  String.prototype.equalsIgnoreCase = function (other: string): boolean {
    return this.toLowerCase() === other.toLowerCase();
  };
}
