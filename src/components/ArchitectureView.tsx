import React, { useState } from "react";
import { Cpu, Network, GitPullRequest, Database, ShieldAlert, Key, CheckCircle, Info } from "lucide-react";

export default function ArchitectureView() {
  const [activeSubSection, setActiveSubSection] = useState<"architecture" | "uml" | "booking_flow" | "data_flow">("architecture");

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
      {/* Sub tabs */}
      <div className="bg-slate-50 border-b border-slate-100 p-2 shrink-0">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSubSection("architecture")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubSection === "architecture"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            3-Tier Architecture
          </button>
          <button
            onClick={() => setActiveSubSection("uml")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubSection === "uml"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Class Relationships (UML)
          </button>
          <button
            onClick={() => setActiveSubSection("booking_flow")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubSection === "booking_flow"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Booking Execution Flow
          </button>
          <button
            onClick={() => setActiveSubSection("data_flow")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubSection === "data_flow"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Data Lifecycle & Persistence
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeSubSection === "architecture" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span>3-Tier Modular Console Architecture</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-normal">
                Standard industry decoupling ensures that formatting choices in the CLI console do not interfere with the transactional logic or I/O streaming.
              </p>
            </div>

            {/* ASCII Layer Diagram */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 leading-normal overflow-x-auto">
{`+-------------------------------------------------------------------------+
|                  1. PRESENTATION LAYER (Boundary / CLI)                 |
|  - Main.java (App entry point, controls CLI loops, formats user menus)  |
|  - Accepts user scanner strings and prints formatted CLI receipts      |
+------------------------------------+------------------------------------+
                                     |  DTOs / Input Parameters
                                     v
+------------------------------------+------------------------------------+
|                2. APPLICATION SERVICE LAYER (Business Rules)            |
|  - BookingService.java [Interface] (Abstraction & Decoupling Contract)  |
|  - BookingServiceImpl.java (Validates occupancy, sequences stays,       |
|                            calculates prices, performs atomicity)      |
|  - ValidationUtils.java (Centralizes Regex & Date sequences checking)   |
|  - com.hotel.exception.* (Checked exceptions: BookingException, etc.)   |
+------------------------------------+------------------------------------+
                                     |  Aggregated Objects / CSV Strings
                                     v
+------------------------------------+------------------------------------+
|               3. DATA PERSISTENCE LAYER (Infrastructure)                |
|  - FileHandler.java (Disk operations, manages safe Try-With-Resources)  |
|  - flat-file databases: "data/rooms.csv" and "data/bookings.csv"        |
+-------------------------------------------------------------------------+`}
            </div>

            {/* Layer description cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider font-mono text-indigo-600">
                  Presentation Layer
                </h4>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Contained inside <code>Main.java</code>. Deals exclusively with user menus, screen prints, and standard <code>Scanner(System.in)</code>. It delegates all operational triggers to the service layer and elegantly formats thrown checked exceptions.
                </p>
              </div>

              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider font-mono text-emerald-600">
                  Business Service Layer
                </h4>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Decoupled behind <code>BookingService</code>. Enforces rules: ensures checked-out dates are strictly after checked-in dates, verifies room capacity constraints, calculates the pricing multiplier, and updates the state.
                </p>
              </div>

              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider font-mono text-cyan-600">
                  Data Persistence Layer
                </h4>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  Managed by <code>FileHandler</code>. Executes physical disk writing and formatting. Reads CSV files and maps raw data strings back into state objects on JVM boot, guaranteeing local persistence across runs.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubSection === "uml" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg flex items-center space-x-2">
                <Network className="w-5 h-5 text-cyan-500" />
                <span>Class Relationship Diagram (UML Representation)</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-normal">
                Visualizing how models, enums, interfaces, custom exceptions, and helpers aggregate and associate to build a cohesive OOP model.
              </p>
            </div>

            {/* UML Diagram in Code block */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 leading-normal overflow-x-auto">
{`                        +-------------------+
                        |     Main.java     | (Boundary Controller)
                        +---------+---------+
                                  |
                                  | Uses Contract (Abstraction)
                                  v
                    +-------------+-------------+
                    | BookingService [Interface]|
                    +-------------+-------------+
                                  ^
                                  | Implements
                                  v
                    +-------------+-------------+
                    |    BookingServiceImpl     |
                    +------+-------------+------+
                           |             |
           Holds List      |             | Uses I/O
           of Bookings     v             v
       +-------------------+--+       +---------------+
       |      Booking         |       |  FileHandler  | <-----+ Reads/Writes
       +---+--------------+---+       +---------------+       | flat CSV data
           |              |                                   v
           | Aggregates   | Aggregates                 +-------------+
           v              v                            |  CSV Files  |
    +------+-----+  +-----+------+                     +-------------+
    |    Guest   |  |    Room    |
    +------------+  +-----+------+
                          |
                          | Aggregates Enum
                          v
                    +-----+------+
                    |  RoomType  | (SINGLE, DOUBLE, DELUXE, SUITE)
                    +------------+`}
            </div>

            {/* Design Patterns Callout */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-xs leading-relaxed text-slate-600">
              <h4 className="text-slate-900 font-bold flex items-center space-x-1.5 font-mono">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>OOP & Clean Code Principles Applied:</span>
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Abstraction & Interface Separation:</strong> <code>Main</code> interacts solely with the <code>BookingService</code> interface. The concrete <code>BookingServiceImpl</code> class is fully interchangeable, isolating interface execution from its controller.
                </li>
                <li>
                  <strong>Object Aggregation:</strong> The <code>Booking</code> object aggregates a <code>Guest</code> and a <code>Room</code>, modeling a real-world booking receipt without replicating guest/room attributes inside booking classes.
                </li>
                <li>
                  <strong>Single Responsibility Principle (SRP):</strong> Input validation is separated out into <code>ValidationUtils</code>, and file operations are exclusively the duty of <code>FileHandler</code>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeSubSection === "booking_flow" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg flex items-center space-x-2">
                <GitPullRequest className="w-5 h-5 text-emerald-500" />
                <span>Interactive Booking Execution Sequence</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-normal">
                Follow the operational sequence of a room booking transaction inside the Java Virtual Machine (JVM).
              </p>
            </div>

            {/* Step sequence layout */}
            <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">1</div>
                <h4 className="text-slate-900 font-bold text-sm">Input Ingestion (Boundary)</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  The client inputs data into the CLI scanner. The input variables are: Guest Name, Contact Number, Room Type Enum, Check-In Date, Check-Out Date, and Guest Count.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">2</div>
                <h4 className="text-slate-900 font-bold text-sm text-indigo-600">Defensive Syntactic Validation</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  <code>ValidationUtils</code> evaluates input syntactically: verifies the Phone Number against regular expressions (REGEX) and makes sure name values aren't empty.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">3</div>
                <h4 className="text-slate-900 font-bold text-sm text-indigo-600">Date-Time Logic Checks</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Validates date patterns (<code>YYYY-MM-DD</code>). Verifies sequence using <code>java.time.LocalDate</code>: check-in must be today or in the future, and check-out must be at least 1 day after check-in. Throws <code>InvalidDateException</code> if validation fails.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">4</div>
                <h4 className="text-slate-900 font-bold text-sm text-emerald-600">Room Availability Lookup</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Queries active Rooms using Java Streams (filtering by <code>Room::isAvailable</code> and <code>RoomType</code> match). If no room matches, immediately throws a checked <code>BookingException</code>.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">5</div>
                <h4 className="text-slate-900 font-bold text-sm text-cyan-600">Capacity Constraints Verification</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Checks that the booking guest count does not exceed the maximum allowed for the requested <code>RoomType</code>. This prevents over-occupancy violations.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">6</div>
                <h4 className="text-slate-900 font-bold text-sm">State Mutation & Calculations</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Calculates stay duration (using <code>ChronoUnit.DAYS</code>) and booking total price. Flags the assigned room as unavailable (<code>isAvailable = false</code>), instantiates Guest and Booking objects, and updates JVM memory.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-white border-2 border-indigo-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-indigo-600">7</div>
                <h4 className="text-slate-900 font-bold text-sm text-indigo-600">CSV Database Synchronization</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Delegates serialization to <code>FileHandler</code>. Appends the structured booking row to <code>bookings.csv</code> and saves the updated room list back to <code>rooms.csv</code>.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] font-bold text-white">✓</div>
                <h4 className="text-slate-900 font-bold text-sm text-emerald-600">Visual confirmation receipt emission</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">
                  Returns successfully back to the controller (<code>Main</code>), printing a gorgeous receipt summary outlining booking details, stay nights, and room rates, before returning the thread back to the main menu loop.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubSection === "data_flow" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-500" />
                <span>JVM Memory Stack/Heap vs Physical Data Persistence</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-normal">
                How variables, reference pointers, and files interact to preserve state during application lifecycles.
              </p>
            </div>

            {/* Structured Table mapping Data states */}
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-mono text-slate-500 text-[10px] uppercase font-semibold">
                    <th className="p-3">Data Element</th>
                    <th className="p-3">JVM Area / Memory Block</th>
                    <th className="p-3">Persistence Level</th>
                    <th className="p-3">Persistence Representation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 leading-relaxed">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">User Input Buffer</td>
                    <td className="p-3">JVM Stack (Scanner instance thread bytes)</td>
                    <td className="p-3 text-rose-600 font-semibold">Transient / Volatile</td>
                    <td className="p-3">Keyboard scan character streams</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">Room Categories</td>
                    <td className="p-3">Method Area (Static values inside RoomType Enum)</td>
                    <td className="p-3 text-slate-500">Immutable Class Area</td>
                    <td className="p-3">Fixed static metadata definitions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">Active Bookings List</td>
                    <td className="p-3">JVM Heap (In-memory <code>ArrayList&lt;Booking&gt;</code> reference pointers)</td>
                    <td className="p-3 text-amber-600 font-semibold">Session-Bound</td>
                    <td className="p-3">Live collection during program execution</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">Rooms Vacancy States</td>
                    <td className="p-3">JVM Heap (Boolean flags inside Room class instance)</td>
                    <td className="p-3 text-emerald-600 font-semibold">Durable Persistence</td>
                    <td className="p-3">Updated rows inside <code>data/rooms.csv</code> flat database</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">Booking History Log</td>
                    <td className="p-3">Disk File Storage (Appended Comma-Separated Values)</td>
                    <td className="p-3 text-emerald-600 font-semibold">Durable Persistence</td>
                    <td className="p-3">Text rows inside <code>data/bookings.csv</code> flat database</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Educational content on File Handling block */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
              <h4 className="text-slate-900 font-bold font-mono">🔧 Serialization & Exception Safety Tip:</h4>
              <p>
                A common mistake in course projects is not flushing the stream, or forgetting to safely close descriptors which locks system file handles. This implementation uses <strong>Java Try-with-Resources</strong> which wraps stream initialization and guarantees that whether or not an <code>IOException</code> is thrown during write, the file descriptor closes automatically!
              </p>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded font-mono text-[10px] overflow-x-auto leading-normal">
{`// Safe try-with-resources auto-closure pattern
try (BufferedWriter bw = new BufferedWriter(new FileWriter(ROOMS_FILE))) {
    for (Room room : rooms) {
        bw.write(room.getRoomNumber() + "," + room.getType().name() + "...");
        bw.newLine();
    }
} catch (IOException e) {
    System.err.println("File write failed safely: " + e.getMessage());
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
