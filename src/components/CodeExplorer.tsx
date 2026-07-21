import React, { useState } from "react";
import { JAVA_PROJECT_FILES, JavaFile } from "../javaCode";
import { Folder, FileCode, Copy, Check, Download, AlertCircle, FileText } from "lucide-react";
import JSZip from "jszip";

export default function CodeExplorer() {
  const [selectedFile, setSelectedFile] = useState<JavaFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSingleFile = (file: JavaFile) => {
    const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a complete Maven-compliant pom.xml
  const getPomXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.hotel</groupId>
    <artifactId>hotel-room-booking-console-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <!-- Simple, modular dependency footprint for console I/O, testing, and core Java APIs -->
    <dependencies>
        <!-- JUnit 5 for robust backend testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Jar plugin to specify executable entry point Main class -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <mainClass>com.hotel.Main</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;
  };

  // Generate a custom standard Java .gitignore
  const getGitignore = () => {
    return `# Compiled class files
*.class

# Log files
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files #
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# virtual machine crash logs
hs_err_pid*

# Maven target directory
target/

# IDE files (Eclipse, IntelliJ, NetBeans)
.idea/
*.iml
.classpath
.project
.settings/
bin/
out/
.nb-gradle/`;
  };

  // Generate pre-seeded database content
  const getPreSeededRoomsCsv = () => {
    return `101,SINGLE,120.00,true
102,SINGLE,120.00,true
103,SINGLE,120.00,true
201,DOUBLE,180.00,true
202,DOUBLE,180.00,true
203,DOUBLE,180.00,true
301,DELUXE,300.00,true
302,DELUXE,300.00,true
401,SUITE,600.00,true
402,SUITE,600.00,true`;
  };

  const downloadCompleteProjectZip = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();

      // 1. Write pom.xml & .gitignore in project root
      zip.file("pom.xml", getPomXml());
      zip.file(".gitignore", getGitignore());

      // 2. Write all Java files to their respective package locations under src/main/java
      const javaSourceDir = zip.folder("src/main/java");
      if (javaSourceDir) {
        JAVA_PROJECT_FILES.forEach(file => {
          javaSourceDir.file(file.path, file.code);
        });
      }

      // 3. Write data directory pre-seeded CSV files
      const dataDir = zip.folder("data");
      if (dataDir) {
        dataDir.file("rooms.csv", getPreSeededRoomsCsv());
        dataDir.file("bookings.csv", ""); // start empty for bookings
      }

      // 4. Create README.md
      const readmeText = `# Luxe Haven: Hotel Room Booking Console Application

An industry-oriented Java course project designed with strict Object-Oriented Programming (OOP) concepts, checked exceptions, and flat-file CSV database storage. 

This repository serves as a professional Java backend developer portfolio showcase.

## 🛠️ Key Architectural Highlights
- **Encapsulation**: Private state attributes and controlled getters/setters in models (e.g. \`Room\`, \`Booking\`).
- **Separation of Concerns**: High modularity splitting business domains (\`BookingService\`), infrastructure utilities (\`FileHandler\`), exception mapping, and command-line boundary controllers (\`Main.java\`).
- **Checked Exceptions**: Custom exceptions for transactional business validation rules (\`BookingException\`).
- **File Persistence**: Demonstrates buffered character streams reading and writing formatted data to flat CSV structures.

## 🚀 Getting Started
### Prerequisites
- Java Development Kit (JDK) 17 or higher
- Apache Maven (Optional, for building)

### Running via Terminal
1. Navigate to the project root directory.
2. Compile the Java files:
   \`\`\`bash
   javac -d out src/main/java/com/hotel/*.java src/main/java/com/hotel/*/*.java
   \`\`\`
3. Run the application:
   \`\`\`bash
   java -cp out com.hotel.Main
   \`\`\`

### Running via Maven (Recommended)
1. Build and package the project:
   \`\`\`bash
   mvn clean package
   \`\`\`
2. Run the compiled executable JAR:
   \`\`\`bash
   java -jar target/hotel-room-booking-console-app-1.0-SNAPSHOT.jar
   \`\`\`
`;
      zip.file("README.md", readmeText);

      // Generate the ZIP blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "LuxeHaven_HotelBooking_JavaProject.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setZipping(false);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (e) {
      console.error("ZIP Generation Failed", e);
      setZipping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] max-h-[720px]">
      {/* File Tree Explorer Side-Panel */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-xs overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <span className="text-white font-semibold flex items-center space-x-1.5">
              <Folder className="w-4 h-4 text-cyan-400" />
              <span>Project Files Tree</span>
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">Java 17</span>
          </div>

          <div className="space-y-3">
            {/* Project Root virtual directory */}
            <div className="text-slate-400 text-[10px] select-none font-bold uppercase tracking-wider mb-1">Root / Maven Files</div>
            <div className="pl-2 space-y-1">
              <div className="flex items-center space-x-2 py-1 px-2 hover:bg-slate-800/50 rounded cursor-not-allowed opacity-60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>pom.xml</span>
              </div>
              <div className="flex items-center space-x-2 py-1 px-2 hover:bg-slate-800/50 rounded cursor-not-allowed opacity-60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>.gitignore</span>
              </div>
              <div className="flex items-center space-x-2 py-1 px-2 hover:bg-slate-800/50 rounded cursor-not-allowed opacity-60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>README.md</span>
              </div>
            </div>

            <div className="text-slate-400 text-[10px] select-none font-bold uppercase tracking-wider mt-4 mb-1">src/main/java/com/hotel/</div>
            <div className="pl-2 space-y-1">
              {JAVA_PROJECT_FILES.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left flex items-center space-x-2 py-1 px-2 rounded transition-all ${
                    selectedFile.path === file.path
                      ? "bg-cyan-950/50 text-cyan-400 border-l-2 border-cyan-400 font-bold"
                      : "hover:bg-slate-800/50 text-slate-300"
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${selectedFile.path === file.path ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>

            <div className="text-slate-400 text-[10px] select-none font-bold uppercase tracking-wider mt-4 mb-1">Flat Database Logs</div>
            <div className="pl-2 space-y-1">
              <div className="flex items-center space-x-2 py-1 px-2 text-slate-400 rounded cursor-not-allowed opacity-60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>data/rooms.csv</span>
              </div>
              <div className="flex items-center space-x-2 py-1 px-2 text-slate-400 rounded cursor-not-allowed opacity-60">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>data/bookings.csv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Big ZIP Download button at the bottom */}
        <div className="mt-6 border-t border-slate-800 pt-4">
          <button
            onClick={downloadCompleteProjectZip}
            disabled={zipping}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-semibold transition-all shadow-md ${
              zipSuccess
                ? "bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold cursor-pointer"
            }`}
          >
            <Download className={`w-4 h-4 ${zipping ? "animate-spin" : ""}`} />
            <span>{zipping ? "Compiling ZIP Archive..." : zipSuccess ? "Downloaded successfully!" : "Download Full Java Project (.zip)"}</span>
          </button>
          <p className="text-[10px] text-slate-500 mt-2 text-center leading-normal">
            Generates a Maven directory structure. Ready to unzip, open in Eclipse/IntelliJ, or push directly to GitHub as proof-of-work.
          </p>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden flex flex-col h-full">
        {/* Code Metadata Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-900 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">
              com.hotel.{selectedFile.path.split("/").slice(1, -1).join(".")}
            </span>
            <h3 className="text-white text-sm font-mono font-bold mt-0.5">{selectedFile.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition flex items-center space-x-1"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-mono px-1">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={() => downloadSingleFile(selectedFile)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition flex items-center space-x-1"
              title="Download individual file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono px-1">Source</span>
            </button>
          </div>
        </div>

        {/* Small File Description */}
        <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-900 shrink-0 flex items-center space-x-2 text-[11px] text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate italic">{selectedFile.description}</span>
        </div>

        {/* Source Code Container with line numbers */}
        <div className="flex-1 overflow-auto p-4 font-mono text-[11px] text-slate-300 leading-relaxed bg-[#0b0f19]">
          <div className="flex select-text">
            {/* Line numbers column */}
            <div className="text-slate-600 text-right pr-4 select-none border-r border-slate-800 shrink-0">
              {selectedFile.code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Java code highlight preview */}
            <pre className="pl-4 whitespace-pre text-slate-300 overflow-x-auto w-full selection:bg-slate-800 selection:text-white">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
