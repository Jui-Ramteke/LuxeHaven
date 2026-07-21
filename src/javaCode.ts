export interface JavaFile {
  path: string;
  name: string;
  code: string;
  description: string;
}

export const JAVA_PROJECT_FILES: JavaFile[] = [
  {
    path: "com/hotel/model/RoomType.java",
    name: "RoomType.java",
    description: "Enum representing room categories, pricing, and guest capacity limits.",
    code: `package com.hotel.model;

/**
 * Enum representing different types of hotel rooms with their fixed rates and max guest limits.
 * Demonstrates clean usage of Java Enums with custom fields, constructor, and helper methods.
 * This pattern enforces strong typing and centralizes room properties.
 */
public enum RoomType {
    SINGLE("Single Room", 120.0, 1),
    DOUBLE("Double Room", 180.0, 2),
    DELUXE("Deluxe Room", 300.0, 3),
    SUITE("Presidential Suite", 600.0, 5);

    private final String displayName;
    private final double pricePerNight;
    private final int maxGuests;

    RoomType(String displayName, double pricePerNight, int maxGuests) {
        this.displayName = displayName;
        this.pricePerNight = pricePerNight;
        this.maxGuests = maxGuests;
    }

    public String getDisplayName() {
        return displayName;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public int getMaxGuests() {
        return maxGuests;
    }
    
    public static RoomType fromString(String text) {
        for (RoomType b : RoomType.values()) {
            if (b.name().equalsIgnoreCase(text) || b.displayName.equalsIgnoreCase(text)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
}`
  },
  {
    path: "com/hotel/model/Room.java",
    name: "Room.java",
    description: "Model class for a hotel room demonstrating pure Encapsulation.",
    code: `package com.hotel.model;

/**
 * Represents a Hotel Room in the system. 
 * Demonstrates standard Encapsulation principles with private fields,
 * public accessors/mutators, and a custom formatted string representation.
 */
public class Room {
    private final String roomNumber;
    private final RoomType type;
    private double pricePerNight;
    private boolean isAvailable;

    public Room(String roomNumber, RoomType type) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.pricePerNight = type.getPricePerNight();
        this.isAvailable = true;
    }

    // Overloaded constructor for loading state from CSV database files
    public Room(String roomNumber, RoomType type, double pricePerNight, boolean isAvailable) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.pricePerNight = pricePerNight;
        this.isAvailable = isAvailable;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public RoomType getType() {
        return type;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    @Override
    public String toString() {
        return String.format("Room #%-4s | %-18s | $%-6.2f/night | %s", 
            roomNumber, type.getDisplayName(), pricePerNight, isAvailable ? "AVAILABLE" : "OCCUPIED");
    }
}`
  },
  {
    path: "com/hotel/model/Guest.java",
    name: "Guest.java",
    description: "Model representing guest details (name and contact number).",
    code: `package com.hotel.model;

/**
 * Represents a Hotel Guest. Holds personal attributes of the person 
 * placing the booking. Enforces Encapsulation and validates consistency.
 */
public class Guest {
    private String name;
    private String contactNumber;

    public Guest(String name, String contactNumber) {
        this.name = name;
        this.contactNumber = contactNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    @Override
    public String toString() {
        return name + " (Phone: " + contactNumber + ")";
    }
}`
  },
  {
    path: "com/hotel/model/Booking.java",
    name: "Booking.java",
    description: "Aggregation model tying guest, room, stay duration, and financial receipts.",
    code: `package com.hotel.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Represents a completed Room Booking transaction.
 * Integrates Guest, Room, Date calculations, and tracks transaction statuses.
 * Demonstrates Object Aggregation and defensive state tracking.
 */
public class Booking {
    private final String bookingId;
    private final Guest guest;
    private final Room room;
    private final LocalDate checkInDate;
    private final LocalDate checkOutDate;
    private final int numberOfGuests;
    private final double totalAmount;
    private boolean isCancelled;

    public Booking(String bookingId, Guest guest, Room room, LocalDate checkInDate, LocalDate checkOutDate, int numberOfGuests) {
        this.bookingId = bookingId;
        this.guest = guest;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.isCancelled = false;
        this.totalAmount = calculateBillAmount();
    }

    // Constructor with manual total and cancellation state (used for CSV reading)
    public Booking(String bookingId, Guest guest, Room room, LocalDate checkInDate, LocalDate checkOutDate, int numberOfGuests, double totalAmount, boolean isCancelled) {
        this.bookingId = bookingId;
        this.guest = guest;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.totalAmount = totalAmount;
        this.isCancelled = isCancelled;
    }

    public long getNumberOfNights() {
        return ChronoUnit.DAYS.between(checkInDate, checkOutDate);
    }

    private double calculateBillAmount() {
        long nights = getNumberOfNights();
        // Fallback to at least 1 night if check-in and check-out are on the same day (rare but safe)
        if (nights <= 0) nights = 1;
        return nights * room.getPricePerNight();
    }

    public String getBookingId() {
        return bookingId;
    }

    public Guest getGuest() {
        return guest;
    }

    public Room getRoom() {
        return room;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public int getNumberOfGuests() {
        return numberOfGuests;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public boolean isCancelled() {
        return isCancelled;
    }

    public void setCancelled(boolean cancelled) {
        isCancelled = cancelled;
    }

    @Override
    public String toString() {
        String status = isCancelled ? "CANCELLED" : "CONFIRMED";
        return String.format("ID: %-10s | Guest: %-15s | Room: #%-4s (%-6s) | Nights: %-2d | Total: $%-7.2f | Status: %s",
            bookingId, guest.getName(), room.getRoomNumber(), room.getType().name(), getNumberOfNights(), totalAmount, status);
    }
}`
  },
  {
    path: "com/hotel/exception/BookingException.java",
    name: "BookingException.java",
    description: "Custom Checked Exception demonstrating proper Java Exception architecture.",
    code: `package com.hotel.exception;

/**
 * Custom Checked Exception representing failures in the business layer 
 * (e.g., room occupied, invalid occupancy, file loading issues).
 * Encourages robust exception mapping in professional applications.
 */
public class BookingException extends Exception {
    public BookingException(String message) {
        super(message);
    }

    public BookingException(String message, Throwable cause) {
        super(message, cause);
    }
}`
  },
  {
    path: "com/hotel/exception/InvalidDateException.java",
    name: "InvalidDateException.java",
    description: "Specific checked exception for date conflicts and parse errors.",
    code: `package com.hotel.exception;

/**
 * Custom checked exception specialized for date validations, 
 * such as check-out occurring before check-in or booking in the past.
 */
public class InvalidDateException extends BookingException {
    public InvalidDateException(String message) {
        super(message);
    }
}`
  },
  {
    path: "com/hotel/util/ValidationUtils.java",
    name: "ValidationUtils.java",
    description: "Utility class for user input validations using Regular Expressions and LocalDate logic.",
    code: `package com.hotel.util;

import com.hotel.exception.InvalidDateException;
import com.hotel.exception.BookingException;
import com.hotel.model.RoomType;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Utility class containing static validations.
 * Demonstrates high-quality defensive coding, date arithmetic, and pattern validation.
 */
public class ValidationUtils {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final String PHONE_REGEX = "^[+]?[0-9]{10,13}$";

    /**
     * Validates date sequence and string format (yyyy-MM-dd).
     * @return Parsed LocalDate object if valid
     */
    public static LocalDate validateDates(String checkInStr, String checkOutStr) throws InvalidDateException {
        try {
            LocalDate checkIn = LocalDate.parse(checkInStr, DATE_FORMATTER);
            LocalDate checkOut = LocalDate.parse(checkOutStr, DATE_FORMATTER);
            LocalDate today = LocalDate.now();

            if (checkIn.isBefore(today)) {
                throw new InvalidDateException("Check-in date cannot be in the past (" + checkInStr + ")");
            }

            if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
                throw new InvalidDateException("Check-out date must be at least 1 day after check-in");
            }

            return checkIn; // or return checkIn; here we typically parse both in service.
        } catch (DateTimeParseException e) {
            throw new InvalidDateException("Invalid date format. Please use YYYY-MM-DD (e.g., 2026-07-21)");
        }
    }

    /**
     * Parse a date safely
     */
    public static LocalDate parseDate(String dateStr) throws InvalidDateException {
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new InvalidDateException("Invalid date format: '" + dateStr + "'. Use YYYY-MM-DD.");
        }
    }

    /**
     * Validates contact number matches standard phone format.
     */
    public static void validatePhoneNumber(String phone) throws BookingException {
        if (phone == null || !phone.matches(PHONE_REGEX)) {
            throw new BookingException("Invalid contact number: '" + phone + "'. Must be 10 to 13 digits optionally starting with +.");
        }
    }

    /**
     * Validates that guest count does not exceed room capacity.
     */
    public static void validateGuestCapacity(RoomType roomType, int guestCount) throws BookingException {
        if (guestCount <= 0) {
            throw new BookingException("Number of guests must be at least 1.");
        }
        if (guestCount > roomType.getMaxGuests()) {
            throw new BookingException(String.format("Over-occupancy! %s accommodates a maximum of %d guests.",
                roomType.getDisplayName(), roomType.getMaxGuests()));
        }
    }
}`
  },
  {
    path: "com/hotel/util/FileHandler.java",
    name: "FileHandler.java",
    description: "Database persistence layer using Java I/O streams and CSV files.",
    code: `package com.hotel.util;

import com.hotel.model.*;
import java.io.*;
import java.time.LocalDate;
import java.util.*;

/**
 * FileHandler manages CSV database reading and writing operations.
 * Demonstrates high-quality Java I/O techniques including:
 * - Try-with-resources statement for safe stream closure.
 * - BufferedReader and BufferedWriter for highly efficient disk streaming.
 * - Custom parsing rules mapping raw strings to complex aggregated structures.
 */
public class FileHandler {
    private static final String ROOMS_FILE = "data/rooms.csv";
    private static final String BOOKINGS_FILE = "data/bookings.csv";
    private static final String DATA_DIR = "data";

    /**
     * Ensures directories and database CSV files exist. Seeds mock rooms if empty.
     */
    public static void initializeDatabase() {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File roomsFile = new File(ROOMS_FILE);
            if (!roomsFile.exists()) {
                roomsFile.createNewFile();
                seedDefaultRooms();
            }

            File bookingsFile = new File(BOOKINGS_FILE);
            if (!bookingsFile.exists()) {
                bookingsFile.createNewFile();
            }
        } catch (IOException e) {
            System.err.println("Database initialization failed: " + e.getMessage());
        }
    }

    private static void seedDefaultRooms() {
        List<Room> defaultRooms = Arrays.asList(
            new Room("101", RoomType.SINGLE),
            new Room("102", RoomType.SINGLE),
            new Room("103", RoomType.SINGLE),
            new Room("201", RoomType.DOUBLE),
            new Room("202", RoomType.DOUBLE),
            new Room("203", RoomType.DOUBLE),
            new Room("301", RoomType.DELUXE),
            new Room("302", RoomType.DELUXE),
            new Room("401", RoomType.SUITE),
            new Room("402", RoomType.SUITE)
        );
        saveRooms(defaultRooms);
    }

    /**
     * Reads rooms from rooms.csv database file.
     */
    public static List<Room> loadRooms() {
        List<Room> rooms = new ArrayList<>();
        File file = new File(ROOMS_FILE);
        if (!file.exists()) return rooms;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] tokens = line.split(",");
                if (tokens.length == 4) {
                    String roomNumber = tokens[0];
                    RoomType type = RoomType.valueOf(tokens[1]);
                    double price = Double.parseDouble(tokens[2]);
                    boolean isAvailable = Boolean.parseBoolean(tokens[3]);
                    rooms.add(new Room(roomNumber, type, price, isAvailable));
                }
            }
        } catch (IOException | IllegalArgumentException e) {
            System.err.println("Error reading room database: " + e.getMessage());
        }
        return rooms;
    }

    /**
     * Saves rooms collection back into rooms.csv file.
     */
    public static void saveRooms(List<Room> rooms) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(ROOMS_FILE))) {
            for (Room room : rooms) {
                bw.write(String.format("%s,%s,%.2f,%b", 
                    room.getRoomNumber(),
                    room.getType().name(),
                    room.getPricePerNight(),
                    room.isAvailable()
                ));
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error writing room database: " + e.getMessage());
        }
    }

    /**
     * Appends a single booking entry to bookings.csv.
     */
    public static void saveBooking(Booking booking) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(BOOKINGS_FILE, true))) {
            bw.write(serializeBooking(booking));
            bw.newLine();
        } catch (IOException e) {
            System.err.println("Error appending booking details: " + e.getMessage());
        }
    }

    /**
     * Overwrites bookings.csv file with the complete list (crucial for cancellations).
     */
    public static void rewriteBookings(List<Booking> bookings) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(BOOKINGS_FILE))) {
            for (Booking booking : bookings) {
                bw.write(serializeBooking(booking));
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error overwriting booking logs: " + e.getMessage());
        }
    }

    /**
     * Reads and parses all bookings from bookings.csv.
     */
    public static List<Booking> loadBookings(List<Room> activeRooms) {
        List<Booking> bookings = new ArrayList<>();
        File file = new File(BOOKINGS_FILE);
        if (!file.exists()) return bookings;

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] t = line.split(",");
                if (t.length == 8) {
                    String id = t[0];
                    String guestName = t[1];
                    String contact = t[2];
                    String roomNum = t[3];
                    LocalDate in = LocalDate.parse(t[4]);
                    LocalDate out = LocalDate.parse(t[5]);
                    int guestCount = Integer.parseInt(t[6]);
                    double total = Double.parseDouble(t[7]);
                    boolean cancelled = Boolean.parseBoolean(t[8]);

                    // Associate with correct room reference from list
                    Room bookedRoom = activeRooms.stream()
                        .filter(r -> r.getRoomNumber().equals(roomNum))
                        .findFirst()
                        .orElse(new Room(roomNum, RoomType.SINGLE)); // fallback reference

                    Guest guest = new Guest(guestName, contact);
                    bookings.add(new Booking(id, guest, bookedRoom, in, out, guestCount, total, cancelled));
                }
            }
        } catch (Exception e) {
            System.err.println("Error loading booking database: " + e.getMessage());
        }
        return bookings;
    }

    private static String serializeBooking(Booking b) {
        return String.format("%s,%s,%s,%s,%s,%s,%d,%.2f,%b",
            b.getBookingId(),
            b.getGuest().getName(),
            b.getGuest().getContactNumber(),
            b.getRoom().getRoomNumber(),
            b.getCheckInDate(),
            b.getCheckOutDate(),
            b.getNumberOfGuests(),
            b.getTotalAmount(),
            b.isCancelled()
        );
    }
}`
  },
  {
    path: "com/hotel/service/BookingService.java",
    name: "BookingService.java",
    description: "Service Interface detailing the system's operational contract.",
    code: `package com.hotel.service;

import com.hotel.model.*;
import com.hotel.exception.BookingException;
import java.util.List;

/**
 * Service Contract defining core hotel booking capabilities.
 * Demonstrates Abstraction and Interface Separation, decoupling the 
 * presentation layer from actual backend database and persistence workflows.
 */
public interface BookingService {
    
    List<Room> getAvailableRooms();
    
    List<Room> searchRoomsByType(RoomType type);
    
    Booking bookRoom(String guestName, String contactNumber, RoomType roomType, 
                     String checkInDate, String checkOutDate, int numberOfGuests) throws BookingException;
                     
    Booking viewBookingDetails(String bookingId) throws BookingException;
    
    boolean cancelBooking(String bookingId) throws BookingException;
    
    List<Booking> getBookingHistory();
}`
  },
  {
    path: "com/hotel/service/BookingServiceImpl.java",
    name: "BookingServiceImpl.java",
    description: "Concrete business logic service implementation maintaining records and enforcing constraints.",
    code: `package com.hotel.service;

import com.hotel.model.*;
import com.hotel.exception.*;
import com.hotel.util.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Concrete implementation of the BookingService contract.
 * Leverages Java Stream APIs, synchronizes list memory, and communicates
 * with the I/O layer via FileHandler to guarantee transactional durability.
 */
public class BookingServiceImpl implements BookingService {
    private List<Room> rooms;
    private List<Booking> bookings;

    public BookingServiceImpl() {
        FileHandler.initializeDatabase();
        this.rooms = FileHandler.loadRooms();
        this.bookings = FileHandler.loadBookings(rooms);
    }

    @Override
    public List<Room> getAvailableRooms() {
        return rooms.stream()
            .filter(Room::isAvailable)
            .collect(Collectors.toList());
    }

    @Override
    public List<Room> searchRoomsByType(RoomType type) {
        return rooms.stream()
            .filter(r -> r.getType() == type)
            .collect(Collectors.toList());
    }

    @Override
    public synchronized Booking bookRoom(String guestName, String contactNumber, RoomType roomType, 
                                        String checkInStr, String checkOutStr, int numberOfGuests) throws BookingException {
        
        // 1. Validate inputs defensively
        if (guestName == null || guestName.trim().isEmpty()) {
            throw new BookingException("Guest name cannot be empty.");
        }
        ValidationUtils.validatePhoneNumber(contactNumber);
        ValidationUtils.validateGuestCapacity(roomType, numberOfGuests);
        
        LocalDate checkIn = ValidationUtils.parseDate(checkInStr);
        LocalDate checkOut = ValidationUtils.parseDate(checkOutStr);
        ValidationUtils.validateDates(checkInStr, checkOutStr);

        // 2. Locate available rooms matching the category
        Room allocatedRoom = rooms.stream()
            .filter(Room::isAvailable)
            .filter(r -> r.getType() == roomType)
            .findFirst()
            .orElseThrow(() -> new BookingException("No rooms of type " + roomType.getDisplayName() + " are currently available."));

        // 3. Complete structural state transitions
        allocatedRoom.setAvailable(false);
        FileHandler.saveRooms(rooms); // Save room status updates

        String bookingId = generateUniqueBookingId();
        Guest guest = new Guest(guestName, contactNumber);
        
        Booking booking = new Booking(bookingId, guest, allocatedRoom, checkIn, checkOut, numberOfGuests);
        bookings.add(booking);
        
        // 4. Record to permanent flat-file database
        FileHandler.saveBooking(booking);

        return booking;
    }

    @Override
    public Booking viewBookingDetails(String bookingId) throws BookingException {
        return bookings.stream()
            .filter(b -> b.getBookingId().equalsIgnoreCase(bookingId))
            .findFirst()
            .orElseThrow(() -> new BookingException("Booking with ID '" + bookingId + "' not found."));
    }

    @Override
    public synchronized boolean cancelBooking(String bookingId) throws BookingException {
        Booking booking = viewBookingDetails(bookingId);
        
        if (booking.isCancelled()) {
            throw new BookingException("Booking is already cancelled.");
        }

        // Return room to pool
        booking.setCancelled(true);
        booking.getRoom().setAvailable(true);

        // Synchronize persistent database state
        FileHandler.saveRooms(rooms);
        FileHandler.rewriteBookings(bookings);

        return true;
    }

    @Override
    public List<Booking> getBookingHistory() {
        return new ArrayList<>(bookings);
    }

    private String generateUniqueBookingId() {
        int rand = new Random().nextInt(9000) + 1000;
        return "BK" + System.currentTimeMillis() % 100000 + rand;
    }
}`
  },
  {
    path: "com/hotel/Main.java",
    name: "Main.java",
    description: "Application entry point hosting the interactive CLI user interface.",
    code: `package com.hotel;

import com.hotel.model.*;
import com.hotel.service.*;
import com.hotel.exception.BookingException;
import java.util.Scanner;
import java.util.List;

/**
 * Main application console controller.
 * Establishes standard I/O reader loops, routes choices to services, 
 * catches Custom Checked Exceptions elegantly, and implements safe system exits.
 */
public class Main {
    private static final BookingService service = new BookingServiceImpl();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("   WELCOME TO LUXE HAVEN ROOM BOOKING SYSTEM     ");
        System.out.println("=================================================");

        boolean exit = false;
        while (!exit) {
            printMainMenu();
            System.out.print("Enter your choice (1-8): ");
            String input = scanner.nextLine().trim();
            System.out.println();

            switch (input) {
                case "1":
                    displayAvailableRooms();
                    break;
                case "2":
                    searchRoomsByType();
                    break;
                case "3":
                    bookRoom();
                    break;
                case "4":
                    viewBookingDetails();
                    break;
                case "5":
                    cancelBooking();
                    break;
                case "6":
                    viewBookingHistory();
                    break;
                case "7":
                    showAdminInsights();
                    break;
                case "8":
                    exit = true;
                    System.out.println("Thank you for choosing Luxe Haven. Safely exiting application...");
                    break;
                default:
                    System.err.println("Invalid input! Please enter a number between 1 and 8.");
            }
            System.out.println("\\nPress ENTER to return to Main Menu...");
            scanner.nextLine();
        }
    }

    private static void printMainMenu() {
        System.out.println("\\n------------------ MAIN MENU ------------------");
        System.out.println("1. View All Available Rooms");
        System.out.println("2. Search Rooms by Category");
        System.out.println("3. Place a Room Booking");
        System.out.println("4. Retrieve Booking Details by ID");
        System.out.println("5. Cancel an Existing Booking");
        System.out.println("6. Retrieve Booking History logs");
        System.out.println("7. Admin & Financial Insights Panel");
        System.out.println("8. Exit Application Safely");
        System.out.println("------------------------------------------------");
    }

    private static void displayAvailableRooms() {
        System.out.println("====== CURRENTLY AVAILABLE ROOMS ======");
        List<Room> rooms = service.getAvailableRooms();
        if (rooms.isEmpty()) {
            System.out.println("No rooms available at the moment! Hotel is completely full.");
        } else {
            rooms.forEach(System.out::println);
        }
    }

    private static void searchRoomsByType() {
        System.out.println("====== ROOM CATEGORY EXPLORER ======");
        System.out.println("Available categories: SINGLE, DOUBLE, DELUXE, SUITE");
        System.out.print("Enter room type: ");
        String typeStr = scanner.nextLine().trim().toUpperCase();

        try {
            RoomType type = RoomType.valueOf(typeStr);
            List<Room> rooms = service.searchRoomsByType(type);
            System.out.println("\\nResults for '" + type.getDisplayName() + "':");
            if (rooms.isEmpty()) {
                System.out.println("No rooms listed in this category.");
            } else {
                rooms.forEach(System.out::println);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Error: '" + typeStr + "' is not a valid room category.");
        }
    }

    private static void bookRoom() {
        System.out.println("====== PLACE NEW ROOM BOOKING ======");
        try {
            System.out.print("Enter Guest's Full Name: ");
            String name = scanner.nextLine().trim();

            System.out.print("Enter Contact Number (10-13 digits): ");
            String contact = scanner.nextLine().trim();

            System.out.println("Select Room Class (SINGLE, DOUBLE, DELUXE, SUITE): ");
            String typeStr = scanner.nextLine().trim().toUpperCase();
            RoomType type = RoomType.valueOf(typeStr);

            System.out.print("Enter Check-In Date (YYYY-MM-DD): ");
            String checkIn = scanner.nextLine().trim();

            System.out.print("Enter Check-Out Date (YYYY-MM-DD): ");
            String checkOut = scanner.nextLine().trim();

            System.out.print("Enter Total Number of Guests: ");
            int guests = Integer.parseInt(scanner.nextLine().trim());

            // Process booking creation in service business layer
            Booking booking = service.bookRoom(name, contact, type, checkIn, checkOut, guests);
            
            System.out.println("\\n🎉 BOOKING CONFIRMED SUCCESSFULLY! 🎉");
            System.out.println("----------------------------------------------");
            System.out.println("Booking ID      : " + booking.getBookingId());
            System.out.println("Room Number     : " + booking.getRoom().getRoomNumber());
            System.out.println("Room Type       : " + booking.getRoom().getType().getDisplayName());
            System.out.println("Stay Duration   : " + booking.getNumberOfNights() + " nights");
            System.out.println("Total Amount    : $" + String.format("%.2f", booking.getTotalAmount()));
            System.out.println("Check-In Date   : " + booking.getCheckInDate());
            System.out.println("Check-Out Date  : " + booking.getCheckOutDate());
            System.out.println("----------------------------------------------");
            System.out.println("A confirmation receipt CSV entry has been persisted.");

        } catch (IllegalArgumentException e) {
            System.err.println("Error: Invalid room category entered.");
        } catch (NumberFormatException e) {
            System.err.println("Error: Guest count must be a numeric integer value.");
        } catch (BookingException e) {
            System.err.println("Booking Refused: " + e.getMessage());
        }
    }

    private static void viewBookingDetails() {
        System.out.println("====== BOOKING RETRIEVAL ENGINE ======");
        System.out.print("Enter 10-digit Booking ID (e.g., BKXXXX): ");
        String id = scanner.nextLine().trim();

        try {
            Booking booking = service.viewBookingDetails(id);
            System.out.println("\\n------ RECORD LOCATED ------");
            System.out.println(booking);
            System.out.println("Guest Name : " + booking.getGuest().getName());
            System.out.println("Phone Num  : " + booking.getGuest().getContactNumber());
            System.out.println("Stay Dates : " + booking.getCheckInDate() + " to " + booking.getCheckOutDate());
            System.out.println("----------------------------");
        } catch (BookingException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    private static void cancelBooking() {
        System.out.println("====== CANCELLATION REQUEST OFFICE ======");
        System.out.print("Enter Booking ID to cancel: ");
        String id = scanner.nextLine().trim();

        try {
            boolean success = service.cancelBooking(id);
            if (success) {
                System.out.println("\\n✅ Success: Booking '" + id + "' has been cancelled.");
                System.out.println("The corresponding room is now released back into the available pool.");
            }
        } catch (BookingException e) {
            System.err.println("Cancellation Refused: " + e.getMessage());
        }
    }

    private static void viewBookingHistory() {
        System.out.println("====== BOOKING ARCHIVE LOGS ======");
        List<Booking> history = service.getBookingHistory();
        if (history.isEmpty()) {
            System.out.println("Booking registry is completely empty. No historical logs.");
        } else {
            history.forEach(System.out::println);
        }
    }

    private static void showAdminInsights() {
        System.out.println("====== ADMIN STRATEGIC PANEL ======");
        List<Booking> history = service.getBookingHistory();
        long totalBookings = history.size();
        long cancelledBookings = history.stream().filter(Booking::isCancelled).count();
        double activeRevenue = history.stream()
            .filter(b -> !b.isCancelled())
            .mapToDouble(Booking::getTotalAmount)
            .sum();

        List<Room> allRooms = service.getAvailableRooms(); // currently free rooms
        
        System.out.println("----------------------------------------------");
        System.out.println("Total Volume of Bookings : " + totalBookings);
        System.out.println("Cancelled Registrations  : " + cancelledBookings);
        System.out.println("Gross Settled Revenue    : $" + String.format("%.2f", activeRevenue));
        System.out.println("Current Vacant Rooms     : " + allRooms.size() + " rooms");
        System.out.println("----------------------------------------------");
    }
}`
  }
];
