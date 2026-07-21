import React, { useState } from "react";
import { FileText, Copy, Check, Info } from "lucide-react";

export default function GithubReadme() {
  const [copied, setCopied] = useState(false);

  const readmeContent = `# Luxe Haven: Hotel Room Booking Console Application

[![Java Version](https://img.shields.io/badge/Java-17%2B-blue.svg)](https://www.oracle.com/java/technologies/downloads/)
[![Build Tool](https://img.shields.io/badge/Build-Maven-orange.svg)](https://maven.apache.org/)
[![OOP Principles](https://img.shields.io/badge/OOP-Strict%20Conformance-emerald.svg)](#)

A high-fidelity, industry-oriented Java course project modeling a robust **Hotel Room Booking Console Application**. Designed with rigorous Object-Oriented Programming (OOP) concepts, decoupling patterns, customChecked Exceptions, and transactional local flat-file storage (CSV), this app serves as proof-of-work for Software Engineer, Backend Developer, and Java Developer roles.

---

## 🏗️ Architectural Blueprint

The application employs a decoupled **3-Tier Console Architecture** which enforces a strict **Separation of Concerns**:

\`\`\`
                     +---------------------------------------+
                     |  1. PRESENTATION LAYER (CLI Boundary)  |
                     |  - Main.java (Console loop / Scanner) |
                     +-------------------+-------------------+
                                         | Inputs
                                         v
                     +-------------------+-------------------+
                     | 2. APPLICATION SERVICE LAYER (Logic)   |
                     |  - BookingService.java [Interface]    |
                     |  - BookingServiceImpl.java (Execution)|
                     |  - ValidationUtils.java (Validation)  |
                     +-------------------+-------------------+
                                         | Serialization
                                         v
                     +-------------------+-------------------+
                     |  3. PERSISTENCE LAYER (Infrastructure)|
                     |  - FileHandler.java (Disk I/O stream) |
                     |  - Flat-Files (rooms.csv, bookings.csv)|
                     +---------------------------------------+
\`\`\`

### Key Java Class Relationships
- **Object Aggregation**: A \`Booking\` aggregates a \`Guest\` and a specific \`Room\` instance, preventing attribute duplication.
- **Strong Typing**: Room pricing and occupancy boundaries are governed centrally via the \`RoomType\` Enum.
- **Abstraction**: The presentation boundary (\`Main.java\`) communicates solely with the \`BookingService\` interface, completely isolating backend mechanics and file synchronization workflows.

---

## ⚡ Key Features

- **Standard Console Menu Interface:** Clean, robust command line selector.
- **Room Category Explorer:** Instantly lists vacant rooms or filters rooms by category (\`SINGLE\`, \`DOUBLE\`, \`DELUXE\`, \`SUITE\`).
- **Defensive Input Validation:** Enforces correct phone formatting via regex and guest limit validations per class.
- **Date Arithmetic Flow:** Performs future check-in validations and calculates stay nights dynamically using \`java.time.LocalDate\`.
- **Durable Disk Synchronization:** Syncs in-memory collections atomically into formatted flat-file databases (\`rooms.csv\` and \`bookings.csv\`).
- **Checked Exception Mapping:** Custom-engineered \`BookingException\` and \`InvalidDateException\` wrap validations.
- **Admin & Revenue Insights:** Computes gross settled revenue, transaction cancellation ratios, and active occupancies.

---

## 📂 Project Directory Tree

\`\`\`
.
├── pom.xml                     # Maven project specification file
├── README.md                   # Repository documentation
├── data/
│   ├── rooms.csv               # Flattened database storage for hotel rooms
│   └── bookings.csv            # Persistent registration audit rows
└── src/
    └── main/
        └── java/
            └── com/
                └── hotel/
                    ├── Main.java               # Application Entry Point
                    ├── model/
                    │   ├── RoomType.java       # Room Categories & Prices Enum
                    │   ├── Room.java           # Room Entity
                    │   ├── Guest.java          # Guest Information Entity
                    │   └── Booking.java        # Aggregate Booking Receipt
                    ├── service/
                    │   ├── BookingService.java      # Service Boundary Interface
                    │   └── BookingServiceImpl.java  # Concrete Business Logic Handler
                    ├── exception/
                    │   ├── BookingException.java    # Custom Checked Exception
                    │   └── InvalidDateException.java# Specialized Date Checked Exception
                    └── util/
                        ├── FileHandler.java         # CSV Disk Streaming (BufferedReader/Writer)
                        └── ValidationUtils.java     # Syntactic Regex & Date Validator
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK) 17** or higher
- **Apache Maven** (Optional, for packaging)

### Vanilla Compilation & Run
To run this application natively from your command terminal:

1. Clone the project and navigate to the root directory:
   \`\`\`bash
   git clone https://github.com/yourusername/hotel-booking-console-app.git
   cd hotel-booking-console-app
   \`\`\`
2. Compile all source files into an compiled \`out\` target:
   \`\`\`bash
   javac -d out src/main/java/com/hotel/*.java src/main/java/com/hotel/*/*.java
   \`\`\`
3. Launch the application:
   \`\`\`bash
   java -cp out com.hotel.Main
   \`\`\`

### Compilation & Build via Maven
Alternatively, compile and package as an executable \`.jar\` using the included Maven config:

1. Package the project (Maven will clean, compile, test, and package):
   \`\`\`bash
   mvn clean package
   \`\`\`
2. Execute the packaged JAR:
   \`\`\`bash
   java -jar target/hotel-room-booking-console-app-1.0-SNAPSHOT.jar
   \`\`\`

---

## 📝 CSV Database Flat File Formats

The \`FileHandler.java\` class synchronizes and writes clean comma-separated values into a flat file storage.

### \`data/rooms.csv\`
\`\`\`csv
101,SINGLE,120.00,true
201,DOUBLE,180.00,false
401,SUITE,600.00,true
\`\`\`

### \`data/bookings.csv\`
\`\`\`csv
BK4829,Jane Smith,9876543210,201,2026-07-22,2026-07-25,2,540.00,false
\`\`\`

---

## 🎙️ Sample Technical Interview Questions & Answers

### 1. Why use BigDecimal over double/float for financial calculations?
**Answer:** Floating-point data types (\`double\` and \`float\`) are represented in binary floating-point arithmetic (IEEE 754), which cannot represent fractions like \`0.1\` or \`0.2\` with absolute precision. Over thousands of compound receipts, rounding errors accumulate. For real-world systems, \`java.math.BigDecimal\` is preferred as it represents decimal values exactly and allows developers to explicitly set rounding rules. (Note: For this console prototype, double is used for simplified display, but a production migrator would immediately adopt \`BigDecimal\`).

### 2. How would you make this application Thread-Safe in a concurrent environment?
**Answer:** If multiple threads were booking rooms concurrently (e.g. if we hosted this as a backend REST service), we would face race conditions where two threads allocate the same vacant room simultaneously. To make this thread-safe:
- We sync atomic allocation blocks inside \`BookingServiceImpl.java\` using Java's \`synchronized\` keyword.
- Alternatively, we would implement a thread-safe locking mechanism using \`ReentrantLock\` or transition persistence to an ACID-compliant SQL database leveraging database transactions with isolation levels.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-[650px]" id="github-readme-root">
      {/* Header bar */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="text-cyan-400 w-5 h-5" />
          <span className="text-white font-mono text-sm font-semibold">GitHub README.md Generator</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center space-x-1.5 font-mono text-xs font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Full README"}</span>
        </button>
      </div>

      {/* Info Callout */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 shrink-0 flex items-start space-x-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Below is a highly polished, detailed <strong>README.md</strong> layout tailor-made for your GitHub repository. It highlights your OOP architectural decisions, includes clean terminal blocks, compilation guides, and answers common Java interview queries. Copy and paste it directly into your GitHub codebase!
        </p>
      </div>

      {/* README Preview */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 text-slate-800 font-mono text-xs selection:bg-slate-800 selection:text-white leading-relaxed">
        <pre className="whitespace-pre-wrap bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-full overflow-x-auto text-slate-700">
          {readmeContent}
        </pre>
      </div>
    </div>
  );
}
