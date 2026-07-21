import React, { useState, useRef, useEffect } from "react";
import { JavaConsoleSimulator, SimulatedRoom, SimulatedBooking } from "../javaSimulator";
import { Terminal, RotateCcw, FileText, Database, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";

interface TerminalSimulatorProps {
  simulator: JavaConsoleSimulator;
  onUpdate: () => void;
}

export default function TerminalSimulator({ simulator, onUpdate }: TerminalSimulatorProps) {
  const [inputText, setInputText] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"terminal" | "csv_files">("terminal");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to terminal bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simulator.logs, activeSubTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      // Simulate enter key press
      simulator.handleInput("");
    } else {
      simulator.handleInput(inputText);
    }
    setInputText("");
    onUpdate();
  };

  const handleShortcutClick = (val: string) => {
    simulator.handleInput(val);
    onUpdate();
  };

  const handleReset = () => {
    simulator.reset();
    onUpdate();
  };

  // Convert current simulated state to CSV format
  const getRoomsCSV = () => {
    return "roomNumber,roomType,pricePerNight,isAvailable\n" +
      simulator.rooms.map(r => `${r.roomNumber},${r.type},${r.pricePerNight},${r.isAvailable}`).join("\n");
  };

  const getBookingsCSV = () => {
    return "bookingId,guestName,contactNumber,roomNumber,checkInDate,checkOutDate,numberOfGuests,totalAmount,isCancelled\n" +
      simulator.bookings.map(b => `${b.bookingId},${b.guestName},${b.contactNumber},${b.roomNumber},${b.checkInDate},${b.checkOutDate},${b.numberOfGuests},${b.totalAmount},${b.isCancelled}`).join("\n");
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-[650px]" id="terminal-simulator-root">
      {/* Tab Selector bar */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="text-emerald-400 w-5 h-5 animate-pulse" />
          <span className="text-white font-mono text-sm font-semibold">LuxeHaven_JVM_v21.0.1</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveSubTab("terminal")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeSubTab === "terminal"
                  ? "bg-slate-700 text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Interactive Console
            </button>
            <button
              onClick={() => setActiveSubTab("csv_files")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center space-x-1.5 ${
                activeSubTab === "csv_files"
                  ? "bg-slate-700 text-cyan-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Database className="w-3 h-3" />
              <span>Simulated I/O Files</span>
            </button>
          </div>
          <button
            onClick={handleReset}
            title="Reset JVM State"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeSubTab === "terminal" ? (
        <>
          {/* Main Terminal Output Stream */}
          <div className="bg-slate-950 p-4 font-mono text-xs overflow-y-auto flex-1 text-slate-200 leading-relaxed selection:bg-emerald-500 selection:text-black">
            <div className="space-y-1">
              {simulator.logs.map((log, idx) => {
                let textClass = "text-slate-300";
                if (log.startsWith(">")) {
                  textClass = "text-emerald-400 font-bold text-sm mt-2";
                } else if (log.includes("[ERROR]")) {
                  textClass = "text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30 font-semibold";
                } else if (log.includes("🎉 CONFIRMED")) {
                  textClass = "text-yellow-400 font-bold text-sm";
                } else if (log.includes("SUCCESS")) {
                  textClass = "text-emerald-400 font-bold";
                } else if (log.startsWith("======") || log.startsWith("------")) {
                  textClass = "text-cyan-400 font-semibold";
                } else if (log.startsWith("[System]")) {
                  textClass = "text-slate-500 italic";
                }
                return (
                  <div key={idx} className={`${textClass} whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Quick Helper Shortcut Inputs */}
          <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex flex-wrap gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 font-mono self-center mr-1">CLI Shortcuts:</span>
            {simulator.currentState === "MAIN_MENU" && (
              <>
                <button
                  onClick={() => handleShortcutClick("1")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [1] View Available Rooms
                </button>
                <button
                  onClick={() => handleShortcutClick("2")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [2] Search Category
                </button>
                <button
                  onClick={() => handleShortcutClick("3")}
                  className="px-2 py-1 text-[10px] bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 rounded border border-emerald-900 font-mono transition"
                >
                  [3] Place Booking Wizard
                </button>
                <button
                  onClick={() => handleShortcutClick("4")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [4] Find Booking
                </button>
                <button
                  onClick={() => handleShortcutClick("5")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [5] Cancel Booking
                </button>
                <button
                  onClick={() => handleShortcutClick("6")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [6] View History
                </button>
                <button
                  onClick={() => handleShortcutClick("7")}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-mono transition"
                >
                  [7] Admin Insights
                </button>
              </>
            )}

            {simulator.currentState === "SEARCH_ROOMS_TYPE" && (
              <>
                <button onClick={() => handleShortcutClick("SINGLE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">SINGLE</button>
                <button onClick={() => handleShortcutClick("DOUBLE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">DOUBLE</button>
                <button onClick={() => handleShortcutClick("DELUXE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">DELUXE</button>
                <button onClick={() => handleShortcutClick("SUITE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">SUITE</button>
              </>
            )}

            {simulator.currentState === "BOOK_TYPE" && (
              <>
                <button onClick={() => handleShortcutClick("SINGLE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">SINGLE</button>
                <button onClick={() => handleShortcutClick("DOUBLE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">DOUBLE</button>
                <button onClick={() => handleShortcutClick("DELUXE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">DELUXE</button>
                <button onClick={() => handleShortcutClick("SUITE")} className="px-2 py-1 text-[10px] bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded border border-slate-700 font-mono">SUITE</button>
              </>
            )}

            {simulator.currentState === "BOOK_NAME" && (
              <button onClick={() => handleShortcutClick("Alex Rodriguez")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">Fill: Alex Rodriguez</button>
            )}

            {simulator.currentState === "BOOK_PHONE" && (
              <button onClick={() => handleShortcutClick("9876543210")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">Fill: 9876543210</button>
            )}

            {simulator.currentState === "BOOK_IN" && (
              <>
                <button onClick={() => handleShortcutClick("2026-07-21")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">Today (2026-07-21)</button>
                <button onClick={() => handleShortcutClick("2026-08-01")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">2026-08-01</button>
              </>
            )}

            {simulator.currentState === "BOOK_OUT" && (
              <>
                <button onClick={() => handleShortcutClick("2026-07-24")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">3 Nights (2026-07-24)</button>
                <button onClick={() => handleShortcutClick("2026-08-05")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">2026-08-05</button>
              </>
            )}

            {simulator.currentState === "BOOK_GUESTS" && (
              <>
                <button onClick={() => handleShortcutClick("1")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">1 Guest</button>
                <button onClick={() => handleShortcutClick("2")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">2 Guests</button>
                <button onClick={() => handleShortcutClick("4")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">4 Guests (Pres. Suite)</button>
              </>
            )}

            {simulator.currentState === "VIEW_DETAILS" && (
              <button onClick={() => handleShortcutClick("BK4829")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">Fill: BK4829</button>
            )}

            {simulator.currentState === "CANCEL_BOOKING" && (
              <button onClick={() => handleShortcutClick("BK4829")} className="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 font-mono">Fill: BK4829</button>
            )}

            {simulator.currentState === "WAIT_ENTER" && (
              <button
                onClick={() => handleShortcutClick("")}
                className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold rounded flex items-center space-x-1 transition shadow-lg animate-bounce"
              >
                <span>Press ENTER to Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Console Terminal Input Form */}
          <form onSubmit={handleSubmit} className="bg-slate-950 p-3 border-t border-slate-800 flex space-x-2 shrink-0">
            <span className="text-emerald-400 font-mono text-sm font-bold self-center">c:\java_course_project&gt;</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                simulator.currentState === "WAIT_ENTER"
                  ? "Press ENTER here to return to menu"
                  : "Type input here or use shortcuts..."
              }
              className="bg-transparent text-emerald-400 font-mono text-sm flex-1 outline-none border-b border-transparent focus:border-emerald-800 py-1"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded border border-slate-700 transition"
            >
              Send
            </button>
          </form>
        </>
      ) : (
        /* CSV Files Explorer Layout */
        <div className="bg-slate-950 flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-400 font-bold flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5" />
                <span>data/rooms.csv</span>
              </span>
              <span className="text-[10px] text-slate-500 font-sans">Simulated Flat File Database</span>
            </div>
            <pre className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
              {getRoomsCSV()}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-400 font-bold flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5" />
                <span>data/bookings.csv</span>
              </span>
              <span className="text-[10px] text-slate-500 font-sans">Simulated Flat File Database</span>
            </div>
            <pre className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
              {getBookingsCSV()}
            </pre>
          </div>

          <div className="bg-slate-900 p-3 rounded border border-slate-800 text-[11px] text-slate-400 space-y-2 font-sans">
            <h4 className="text-white font-semibold font-mono flex items-center space-x-1">
              <span>💡 Core Java OOP / File-I/O Architecture Tip</span>
            </h4>
            <p>
              In our simulated JVM, any booking placed or cancellation triggered updates the in-memory array representation. This simulates the exact byte writing executed by the Java <code>FileHandler.java</code> class using a <code>BufferedWriter</code> over <code>FileWriter</code>!
            </p>
            <p>
              By decoupling files into a <code>FileHandler</code>, the <code>BookingServiceImpl</code> is shielded from the physical mechanics of saving, showcasing correct <strong>Separation of Concerns</strong> (Data Access vs Business Logic).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
