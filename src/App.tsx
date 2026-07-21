import React, { useState, useMemo } from "react";
import { JavaConsoleSimulator } from "./javaSimulator";
import MainstreamBookingApp from "./components/MainstreamBookingApp";

export default function App() {
  const [, setTick] = useState(0);

  // Initialize the singleton Java Console simulator (functions as the local data engine)
  const simulator = useMemo(() => new JavaConsoleSimulator(), []);

  const triggerUpdate = () => {
    setTick(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col" id="luxury-app-root">
      {/* Primary Mainstream Booking App */}
      <main className="w-full flex-1 flex flex-col">
        <MainstreamBookingApp
          simulator={simulator}
          onBookingCreated={triggerUpdate}
        />
      </main>
    </div>
  );
}
