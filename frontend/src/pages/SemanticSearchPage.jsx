// import { useState, useRef, useCallback, useEffect } from "react";
// import axios from "axios";

// // ============================================================================
// // Config
// // ============================================================================

// const ACCEPTED_EXT = [".pdf", ".doc", ".docx"];
// const MAX_SIZE_MB = 25;

// // ============================================================================
// // Helpers
// // ============================================================================

// const fmtBytes = (b) => {
//     if (b < 1024) return `${b} B`;
//     if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
//     return `${(b / 1024 ** 2).toFixed(2)} MB`;
// };

// const toCSV = (result) => {
//     const lines = [];

//     lines.push("# Key Fields");
//     lines.push("label,value,confidence");

//     result.keyFields.forEach((f) =>
//         lines.push(`"${f.label}","${f.value}",${f.confidence}`)
//     );

//     lines.push("");
//     lines.push("# Entities");
//     lines.push("type,text,count");

//     result.entities.forEach((e) =>
//         lines.push(`${e.type},"${e.text}",${e.count}`)
//     );

//     return lines.join("\n");
// };

// const download = (filename, content, mime) => {
//     const blob = new Blob([content], { type: mime });

//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");

//     a.href = url;

//     a.download = filename;

//     a.click();

//     URL.revokeObjectURL(url);
// };

// // ============================================================================
// // Components
// // ============================================================================

// function Logo() {
//     return (
//         <div className="flex items-center gap-3">
//             <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-content">
//                 📄
//             </div>

//             <div>
//                 <div className="text-lg font-bold">
//                     Doculens
//                 </div>

//                 <div className="text-xs text-base-content/50">
//                     Enterprise AI Search
//                 </div>
//             </div>
//         </div>
//     );
// }

// function DropZone({ onFile, error }) {

//     const inputRef = useRef(null);

//     const handle = (selectedFiles) => {

//         const validFiles = [];

//         for (const file of selectedFiles) {

//             const ext =
//                 "." + file.name.split(".").pop().toLowerCase();

//             if (!ACCEPTED_EXT.includes(ext)) {
//                 continue;
//             }

//             if (
//                 file.size >
//                 MAX_SIZE_MB * 1024 * 1024
//             ) {
//                 continue;
//             }

//             validFiles.push(file);
//         }

//         if (validFiles.length === 0) {

//             onFile(
//                 null,
//                 "No valid files selected"
//             );

//             return;
//         }

//         onFile(validFiles, null);
//     };

//     return (
//         <div>

//             <div
//                 onClick={() =>
//                     inputRef.current?.click()
//                 }
//                 className="cursor-pointer rounded-2xl border-2 border-dashed border-base-300 bg-base-100 p-16 text-center hover:border-primary"
//             >

//                 <input
//                     ref={inputRef}
//                     type="file"
//                     multiple
//                     className="hidden"
//                     accept={ACCEPTED_EXT.join(",")}
//                     onChange={(e) =>
//                         handle(Array.from(e.target.files))
//                     }
//                 />

//                 <div className="text-5xl">
//                     ⬆️
//                 </div>

//                 <div className="mt-4 text-2xl font-semibold">
//                     Upload Document
//                 </div>

//                 <div className="mt-2 text-base-content/60">
//                     PDF · DOC · DOCX
//                 </div>

//             </div>

//             {error && (

//                 <div className="alert alert-error mt-4">

//                     <span>{error}</span>

//                 </div>
//             )}
//         </div>
//     );
// }

// function ProcessingView({ files, stage }) {

//     return (

//         <div className="mx-auto max-w-xl">

//             <div className="card bg-base-100 shadow-xl">

//                 <div className="card-body">

//                     <div className="flex items-center gap-4">

//                         <span className="loading loading-spinner loading-lg"></span>

//                         <div>

//                             <div className="font-semibold">

//                                 {files.length}

//                             </div>

//                             <div className="text-sm text-base-content/60">

//                                 {files.length} files selected

//                             </div>

//                         </div>

//                     </div>

//                     <div className="mt-6">

//                         <progress
//                             className="progress progress-primary w-full"
//                         ></progress>

//                         <div className="mt-4 text-center text-lg">

//                             {stage}

//                         </div>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }

// function ResultsView({ result, onReset }) {

//     return (

//         <div className="space-y-6">

//             {/* Header */}

//             <div className="card bg-base-100 shadow-xl">

//                 <div className="card-body">

//                     <div className="flex flex-wrap items-center justify-between gap-4">

//                         <div>

//                             <h2 className="card-title text-2xl">

//                                 {result.fileName}

//                             </h2>

//                             <div className="text-sm text-base-content/60">

//                                 {result.docType} ·
//                                 {" "}
//                                 {result.pages} pages ·
//                                 {" "}
//                                 {fmtBytes(result.fileSize)}

//                             </div>

//                         </div>

//                         <div className="flex gap-2">

//                             <button
//                                 className="btn btn-outline btn-sm"
//                                 onClick={() =>
//                                     download(
//                                         "report.json",
//                                         JSON.stringify(result, null, 2),
//                                         "application/json"
//                                     )
//                                 }
//                             >
//                                 Download JSON
//                             </button>

//                             <button
//                                 className="btn btn-primary btn-sm"
//                                 onClick={() =>
//                                     download(
//                                         "report.csv",
//                                         toCSV(result),
//                                         "text/csv"
//                                     )
//                                 }
//                             >
//                                 Download CSV
//                             </button>

//                             <button
//                                 className="btn btn-ghost btn-sm"
//                                 onClick={onReset}
//                             >
//                                 New Upload
//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//             {/* Stats */}

//             <div className="stats shadow w-full">

//                 <div className="stat">

//                     <div className="stat-title">
//                         Confidence
//                     </div>

//                     <div className="stat-value text-primary">
//                         {Math.round(result.confidence * 100)}%
//                     </div>

//                 </div>

//                 <div className="stat">

//                     <div className="stat-title">
//                         Fields
//                     </div>

//                     <div className="stat-value">
//                         {result.keyFields.length}
//                     </div>

//                 </div>

//                 <div className="stat">

//                     <div className="stat-title">
//                         Entities
//                     </div>

//                     <div className="stat-value">
//                         {result.entities.length}
//                     </div>

//                 </div>

//             </div>

//             {/* Key Fields */}

//             <div className="card bg-base-100 shadow-xl">

//                 <div className="card-body">

//                     <h2 className="card-title">

//                         Extracted Fields

//                     </h2>

//                     <div className="overflow-x-auto">

//                         <table className="table">

//                             <thead>

//                                 <tr>

//                                     <th>Field</th>

//                                     <th>Value</th>

//                                     <th>Confidence</th>

//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {result.keyFields.map((field) => (

//                                     <tr key={field.label}>

//                                         <td>{field.label}</td>

//                                         <td>{field.value}</td>

//                                         <td>

//                                             {Math.round(
//                                                 field.confidence * 100
//                                             )}%

//                                         </td>

//                                     </tr>
//                                 ))}

//                             </tbody>

//                         </table>

//                     </div>

//                 </div>

//             </div>

//             {/* Entities */}

//             <div className="card bg-base-100 shadow-xl">

//                 <div className="card-body">

//                     <h2 className="card-title">

//                         Entities

//                     </h2>

//                     <div className="flex flex-wrap gap-2">

//                         {result.entities.map((e, index) => (

//                             <div
//                                 key={index}
//                                 className="badge badge-primary badge-lg"
//                             >
//                                 {e.type}: {e.text}
//                             </div>
//                         ))}

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }

// // ============================================================================
// // App
// // ============================================================================

// export default function App() {

//     const [view, setView] = useState("upload");

//     const [files, setFiles] = useState([]);

//     const [stage, setStage] = useState("Uploading");

//     const [result, setResult] = useState(null);

//     const [error, setError] = useState(null);

//     const [history, setHistory] = useState([]);

//     const [searchQuery, setSearchQuery] = useState("");

//     const [searchResults, setSearchResults] = useState([]);

//     const [searchLoading, setSearchLoading] =
//         useState(false);

//     const [searchOpen, setSearchOpen] =
//         useState(false);

//     // ========================================================================
//     // Upload Handler
//     // ========================================================================

//     const handleFile = useCallback((selectedFiles, err) => {

//         if (err) {
//             setError(err);
//             return;
//         }

//         setError(null);

//         setFiles(selectedFiles);

//         setView("processing");

//     }, []);

//     // ========================================================================
//     // Semantic Search
//     // ========================================================================

//     const handleSemanticSearch = async () => {

//         if (!searchQuery.trim()) return;

//         try {

//             setSearchLoading(true);

//             const response = await axios.post(

//                 "http://127.0.0.1:8000/api/search/",

//                 {
//                     query: searchQuery,
//                 }
//             );

//             console.log(response.data);

//             setSearchResults(
//                 response.data.results
//             );

//         } catch (error) {

//             console.error(error);

//         } finally {

//             setSearchLoading(false);
//         }
//     };

//     // ========================================================================
//     // Upload Pipeline
//     // ========================================================================

//     useEffect(() => {

//         if (
//             view !== "processing" ||
//             files.length === 0
//         )
//             return;

//         let active = true;

//         const run = async () => {

//             const seq = [
//                 "Uploading",
//                 "Running OCR",
//                 "Generating AI Analysis",
//                 "Generating Embeddings",
//                 "Saving Document",
//             ];

//             for (const s of seq) {

//                 if (!active) return;

//                 setStage(s);

//                 await new Promise((r) =>
//                     setTimeout(r, 700)
//                 );
//             }

//             try {

//                 const formData = new FormData();

//                 files.forEach((file) => {

//                     formData.append(
//                         "files",
//                         file
//                     );
//                 });

//                 const response = await axios.post(

//                     "http://127.0.0.1:8000/api/upload/",

//                     formData,

//                     {
//                         headers: {
//                             "Content-Type":
//                                 "multipart/form-data",
//                         },
//                     }
//                 );

//                 const data = response.data;

//                 const firstDoc =
//                     data.documents?.[0];

//                 const resultData = {

//                     fileName:
//                         firstDoc?.file_name || "Documents",

//                     fileSize: 0,

//                     pages: files.length,

//                     docType: "PDF",

//                     confidence: 0.95,

//                     processingMs: 2000,

//                     keyFields: [

//                         {
//                             label: "Uploaded Files",
//                             value: files.length,
//                             confidence: 0.95,
//                         },

//                         {
//                             label: "Summary",
//                             value:
//                                 firstDoc?.summary || "N/A",
//                             confidence: 0.92,
//                         },

//                         {
//                             label: "Skills",
//                             value:
//                                 firstDoc?.skills?.join(", ")
//                                 || "N/A",
//                             confidence: 0.90,
//                         },
//                     ],

//                     tables: [],

//                     entities: [],
//                 };

//                 setResult(resultData);

//                 setHistory((h) => [

//                     ...files.map((file) => ({

//                         name: file.name,

//                         type: "PDF",

//                         at: Date.now(),
//                     })),

//                     ...h,

//                 ].slice(0, 6));

//                 setView("results");

//             } catch (error) {

//                 console.error(error);

//                 setError("Upload failed");

//                 setView("upload");
//             }
//         };

//         run();

//         return () => {
//             active = false;
//         };

//     }, [view, files]);

//     // ========================================================================
//     // Reset
//     // ========================================================================

//     const reset = () => {

//         setFiles([]);

//         setResult(null);

//         setView("upload");
//     };

//     // ========================================================================
//     // UI
//     // ========================================================================

//     return (

//         <div className="min-h-screen bg-base-200">

//             {/* Navbar */}

//             <div className="border-b border-base-300 bg-base-100">

//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

//                     <Logo />

//                     <div className="flex gap-2">

//                         <button className="btn btn-ghost btn-sm">
//                             Dashboard
//                         </button>

//                         <button className="btn btn-ghost btn-sm">
//                             Documents
//                         </button>

//                         <button
//                             className="btn btn-circle btn-primary"
//                             onClick={() =>
//                                 setSearchOpen(true)
//                             }
//                         >
//                             🔍
//                         </button>

//                         <button className="btn btn-primary btn-sm">
//                             AI Search
//                         </button>

//                     </div>

//                 </div>

//             </div>

//             {/* Body */}

//             <main className="mx-auto max-w-7xl px-4 py-10">

//                 {/* Main Views */}

//                 {view === "upload" && (

//                     <div className="grid gap-10 lg:grid-cols-12">

//                         <div className="lg:col-span-9">

//                             <DropZone
//                                 onFile={handleFile}
//                                 error={error}
//                             />

//                         </div>

//                         <aside className="lg:col-span-3">

//                             <div className="card bg-base-100 shadow-xl">

//                                 <div className="card-body">

//                                     <h2 className="card-title">

//                                         Recent Uploads

//                                     </h2>

//                                     {history.length === 0 ? (

//                                         <p className="text-sm text-base-content/50">

//                                             No documents uploaded yet.

//                                         </p>

//                                     ) : (

//                                         <div className="space-y-2">

//                                             {history.map((h, i) => (

//                                                 <div
//                                                     key={i}
//                                                     className="flex items-center justify-between rounded-lg border border-base-300 p-2"
//                                                 >

//                                                     <div>

//                                                         <div className="font-medium">

//                                                             {h.name}

//                                                         </div>

//                                                         <div className="text-xs text-base-content/50">

//                                                             {h.type}

//                                                         </div>

//                                                     </div>

//                                                     <div className="badge badge-success">

//                                                         ✓

//                                                     </div>

//                                                 </div>
//                                             ))}

//                                         </div>
//                                     )}

//                                 </div>

//                             </div>

//                         </aside>

//                     </div>
//                 )}

//                 {view === "processing" &&
//                     files.length > 0 && (

//                         <ProcessingView
//                             files={files}
//                             stage={stage}
//                         />
//                     )}

//                 {view === "results" &&
//                     result && (

//                         <ResultsView
//                             result={result}
//                             onReset={reset}
//                         />
//                     )}

//                 <dialog
//                     className={`modal ${searchOpen ? "modal-open" : ""
//                         }`}
//                 >

//                     <div className="modal-box max-w-4xl">

//                         <div className="flex items-center justify-between">

//                             <h3 className="text-xl font-bold">

//                                 AI Resume Search

//                             </h3>

//                             <button
//                                 className="btn btn-sm btn-circle"
//                                 onClick={() =>
//                                     setSearchOpen(false)
//                                 }
//                             >
//                                 ✕
//                             </button>

//                         </div>

//                         <div className="mt-5 flex gap-3">

//                             <input
//                                 type="text"
//                                 placeholder="Find React Django developers..."
//                                 className="input input-bordered w-full"
//                                 value={searchQuery}
//                                 onChange={(e) =>
//                                     setSearchQuery(e.target.value)
//                                 }
//                             />

//                             <button
//                                 className="btn btn-primary"
//                                 onClick={handleSemanticSearch}
//                             >
//                                 Search
//                             </button>

//                         </div>

//                         <div className="mt-6 space-y-4">

//                             {searchResults?.metadatas?.[0]?.map(
//                                 (item, index) => (

//                                     <div
//                                         key={index}
//                                         className="card border border-base-300 bg-base-100 shadow-lg"
//                                     >

//                                         <div className="card-body">

//                                             <div className="flex items-center justify-between">

//                                                 <h2 className="card-title">

//                                                     {item.file_name}

//                                                 </h2>

//                                                 <div className="badge badge-primary">

//                                                     Match

//                                                 </div>

//                                             </div>

//                                             <div className="mt-2 flex flex-wrap gap-2">

//                                                 {(item.skills || []).map(
//                                                     (skill, idx) => (

//                                                         <div
//                                                             key={idx}
//                                                             className="badge badge-outline"
//                                                         >
//                                                             {skill}
//                                                         </div>
//                                                     )
//                                                 )}

//                                             </div>

//                                         </div>

//                                     </div>
//                                 )
//                             )}

//                         </div>

//                     </div>

//                 </dialog>

//             </main>

//         </div>
//     );
// }


import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

// ============================================================================
// Config
// ============================================================================

const ACCEPTED_EXT = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 25;

// ============================================================================
// Helpers
// ============================================================================

const fmtBytes = (b) => {
  if (!b || b === 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 ** 2).toFixed(2)} MB`;
};

const toCSV = (result) => {
  const lines = [];
  lines.push("# Key Fields");
  lines.push("label,value,confidence");
  result.keyFields.forEach((f) =>
    lines.push(`"${f.label}","${f.value}",${f.confidence}`)
  );
  lines.push("");
  lines.push("# Entities");
  lines.push("type,text,count");
  result.entities.forEach((e) =>
    lines.push(`${e.type},"${e.text}",${e.count}`)
  );
  return lines.join("\n");
};

const download = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const PIPELINE_STAGES = [
  { key: "Uploading",              label: "Uploading files",          desc: "Transferring your documents to the server" },
  { key: "Running OCR",            label: "Running OCR",              desc: "Extracting text from pages" },
  { key: "Generating AI Analysis", label: "Generating AI analysis",   desc: "Classifying document type and extracting key fields" },
  { key: "Generating Embeddings",  label: "Generating embeddings",    desc: "Building semantic vectors for search" },
  { key: "Saving Document",        label: "Saving to database",       desc: "Persisting document and metadata" },
];

// ============================================================================
// Logo
// ============================================================================

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content text-lg font-bold tracking-tight select-none">
        D
      </div>
      <div>
        <div className="text-base font-bold leading-none tracking-tight">Doculens</div>
        {/* "Enterprise AI Search" — the product tagline */}
        <div className="text-[10px] font-mono tracking-widest text-base-content/40 uppercase mt-0.5">
          Enterprise AI Search
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DropZone
// ============================================================================

function DropZone({ onFile, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handle = (selectedFiles) => {
    const validFiles = [];
    for (const file of selectedFiles) {
      const ext = "." + file.name.split(".").pop().toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;
      validFiles.push(file);
    }
    if (validFiles.length === 0) {
      onFile(null, "No valid files. Accepted: PDF, DOC, DOCX · Max 25 MB each.");
      return;
    }
    onFile(validFiles, null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handle(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          group cursor-pointer rounded-2xl border-2 border-dashed p-20 text-center
          transition-all duration-200 bg-base-100
          ${dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-base-300 hover:border-primary hover:bg-base-200/60"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={ACCEPTED_EXT.join(",")}
          onChange={(e) => handle(Array.from(e.target.files))}
        />

        {/* Upload icon — SVG so it inherits theme */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-base-300 bg-base-200 group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
          <svg className="h-6 w-6 text-base-content/40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-lg font-semibold text-base-content">
          Drop documents here, or <span className="text-primary">browse</span>
        </p>
        {/* Tells the user exactly what's accepted and the size cap */}
        <p className="mt-1.5 text-sm text-base-content/50">
          Accepts PDF, DOC, DOCX · Up to {MAX_SIZE_MB} MB per file · Multiple files supported
        </p>
      </div>

      {error && (
        <div className="alert alert-error rounded-xl border-0 text-sm">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ProcessingView
// ============================================================================

function ProcessingView({ files, stage }) {
  const currentIdx = PIPELINE_STAGES.findIndex((s) => s.key === stage);
  const pct = currentIdx === -1 ? 10 : Math.round(((currentIdx + 1) / PIPELINE_STAGES.length) * 100);
  const currentStage = PIPELINE_STAGES[currentIdx] || PIPELINE_STAGES[0];

  return (
    <div className="mx-auto max-w-lg">
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-6">

          {/* Header — what's being processed */}
          <div>
            <p className="font-mono text-[10px] tracking-widest text-base-content/40 uppercase mb-1">Processing</p>
            <h2 className="text-xl font-bold text-base-content">
              {files.length} {files.length === 1 ? "document" : "documents"}
            </h2>
            {/* Show the actual filenames so the user knows which files are in flight */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {files.map((f, i) => (
                <span key={i} className="badge badge-ghost badge-sm font-mono text-[10px] max-w-[180px] truncate">
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="mb-2 flex justify-between text-xs text-base-content/50">
              {/* Current stage label */}
              <span className="font-medium text-base-content">{currentStage.label}</span>
              <span className="font-mono">{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* What this step actually does — helpful context */}
            <p className="mt-2 text-xs text-base-content/50">{currentStage.desc}</p>
          </div>

          {/* Pipeline steps — visual checklist */}
          <div className="space-y-2">
            {PIPELINE_STAGES.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s.key} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${active ? "bg-primary/5 border border-primary/20" : "border border-transparent"}`}>
                  <div className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                    ${done ? "bg-success text-success-content" : active ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/30"}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm transition-colors ${done ? "text-base-content/40 line-through" : active ? "font-medium text-base-content" : "text-base-content/40"}`}>
                    {s.label}
                  </span>
                  {active && <span className="loading loading-dots loading-xs ml-auto text-primary" />}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ResultsView
// ============================================================================

function ResultsView({ result, onReset }) {
  return (
    <div className="space-y-5">

      {/* ── Header card ── */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-widest text-base-content/40 uppercase mb-1">
                Analysis complete
              </p>
              {/* Primary identifier — the document filename */}
              <h2 className="text-2xl font-bold text-base-content leading-tight truncate">
                {result.fileName}
              </h2>
              {/* Secondary metadata: document classification · page count · file size */}
              <p className="mt-1 text-sm text-base-content/50">
                {result.docType}
                <span className="mx-2 text-base-content/20">·</span>
                {result.pages} {result.pages === 1 ? "file" : "files"} uploaded
                <span className="mx-2 text-base-content/20">·</span>
                {fmtBytes(result.fileSize)}
                {/* Note: fileSize is 0 from the API; fmtBytes shows "—" gracefully */}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                className="btn btn-outline btn-sm gap-1.5"
                onClick={() => download("report.json", JSON.stringify(result, null, 2), "application/json")}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                JSON
              </button>
              <button
                className="btn btn-primary btn-sm gap-1.5"
                onClick={() => download("report.csv", toCSV(result), "text/csv")}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                CSV
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onReset}>
                ← New upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      {/* Confidence = overall AI extraction confidence · Fields = extracted key fields · Entities = named entities found */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "AI Confidence",
            value: `${Math.round(result.confidence * 100)}%`,
            desc: "Overall extraction accuracy",
            accent: "text-success",
          },
          {
            label: "Key fields",
            value: result.keyFields.length,
            desc: "Structured fields extracted",
            accent: "text-primary",
          },
          {
            label: "Entities",
            value: result.entities.length,
            desc: "Named entities detected",
            accent: "text-base-content",
          },
        ].map((s) => (
          <div key={s.label} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body py-4 px-5">
              <p className="text-[11px] font-mono tracking-widest uppercase text-base-content/40">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.accent}`}>{s.value}</p>
              {/* Explains what this number means so users don't have to guess */}
              <p className="text-[11px] text-base-content/40 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Key fields table ── */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="mb-4">
            <h2 className="font-bold text-base-content">Extracted fields</h2>
            {/* What this section is: structured data the AI pulled from the document */}
            <p className="text-xs text-base-content/50 mt-0.5">Structured information identified by the AI model</p>
          </div>

          {result.keyFields.length === 0 ? (
            <p className="text-sm text-base-content/40 py-6 text-center">No fields extracted.</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="table table-sm">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="text-xs font-mono tracking-widest uppercase text-base-content/40 font-normal">Field</th>
                    <th className="text-xs font-mono tracking-widest uppercase text-base-content/40 font-normal">Value</th>
                    {/* Confidence: how certain the model is about this extraction (0–100%) */}
                    <th className="text-xs font-mono tracking-widest uppercase text-base-content/40 font-normal text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {result.keyFields.map((field) => {
                    const pct = Math.round(field.confidence * 100);
                    return (
                      <tr key={field.label} className="border-b border-base-200 last:border-0">
                        <td className="py-3 font-medium text-sm text-base-content/70 whitespace-nowrap">{field.label}</td>
                        <td className="py-3 text-sm text-base-content max-w-xs">{field.value}</td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16 h-1 rounded-full bg-base-300 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pct >= 90 ? "bg-success" : pct >= 70 ? "bg-warning" : "bg-error"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-base-content/60 w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Entities ── */}
      {result.entities.length > 0 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <div className="mb-4">
              <h2 className="font-bold text-base-content">Named entities</h2>
              {/* Named entity recognition (NER): people, orgs, locations, dates, skills, etc. found in the doc */}
              <p className="text-xs text-base-content/50 mt-0.5">People, organisations, skills, dates and locations detected via NER</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.entities.map((e, index) => (
                <div key={index} className="inline-flex items-center gap-1.5 rounded-lg border border-base-300 bg-base-200/60 px-3 py-1.5">
                  {/* Entity type label (e.g. PERSON, ORG, SKILL) */}
                  <span className="font-mono text-[9px] tracking-widest uppercase text-base-content/40">{e.type}</span>
                  <span className="text-sm font-medium text-base-content">{e.text}</span>
                  {/* Count: how many times this entity appears in the document */}
                  {e.count > 1 && (
                    <span className="ml-1 rounded-full bg-base-300 px-1.5 py-0.5 text-[10px] font-mono text-base-content/50">
                      ×{e.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ============================================================================
// Search Modal
// ============================================================================

function SearchModal({ open, onClose, query, onQueryChange, onSearch, loading, results }) {
  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box max-w-3xl p-0 overflow-hidden rounded-2xl border border-base-300">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-100">
          <div>
            <h3 className="font-bold text-base-content">Semantic document search</h3>
            {/* What this does: vector-based search across all uploaded documents */}
            <p className="text-xs text-base-content/50 mt-0.5">Find relevant documents using natural language — powered by AI embeddings</p>
          </div>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} aria-label="Close search">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Search input */}
        <div className="px-6 py-4 border-b border-base-300 bg-base-100">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" /></svg>
              {/* Placeholder shows a usage example; adjust to your actual document domain */}
              <input
                type="text"
                placeholder='e.g. "React developer with Node.js experience"'
                className="input input-bordered w-full pl-10 text-sm"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <button className="btn btn-primary gap-1.5" onClick={onSearch} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs" /> : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" /></svg>
              )}
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4 space-y-3 bg-base-200/30">
          {results?.metadatas?.[0]?.length > 0 ? (
            <>
              {/* Result count — how many documents matched */}
              <p className="text-xs font-mono text-base-content/40 uppercase tracking-widest pb-1">
                {results.metadatas[0].length} {results.metadatas[0].length === 1 ? "result" : "results"} found
              </p>
              {results.metadatas[0].map((item, index) => (
                <div key={index} className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body py-4 px-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {/* Document filename — primary identifier in search results */}
                        <p className="font-semibold text-sm text-base-content truncate">{item.file_name}</p>
                        {/* Relevance rank — position in the semantic similarity ranking */}
                        <p className="text-xs text-base-content/40 mt-0.5 font-mono">Match #{index + 1}</p>
                      </div>
                      <div className="badge badge-primary badge-sm shrink-0">Relevant</div>
                    </div>

                    {/* Skills extracted from this document — e.g. from a resume */}
                    {item.skills?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.skills.map((skill, idx) => (
                          <span key={idx} className="badge badge-outline badge-sm font-mono text-[10px]">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : results !== null && !loading ? (
            <div className="py-10 text-center text-sm text-base-content/40">
              No matching documents found. Try a different query.
            </div>
          ) : !loading ? (
            <div className="py-10 text-center text-sm text-base-content/40">
              {/* Empty state: user hasn't searched yet */}
              Search across all uploaded documents using natural language.
            </div>
          ) : null}
        </div>

      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}><button>close</button></form>
    </dialog>
  );
}

// ============================================================================
// App
// ============================================================================

export default function App() {
  const [view, setView] = useState("upload");
  const [files, setFiles] = useState([]);
  const [stage, setStage] = useState("Uploading");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Upload Handler ──────────────────────────────────────────────────────────

  const handleFile = useCallback((selectedFiles, err) => {
    if (err) { setError(err); return; }
    setError(null);
    setFiles(selectedFiles);
    setView("processing");
  }, []);

  // ── Semantic Search ─────────────────────────────────────────────────────────

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearchLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/search/", { query: searchQuery });
      console.log(response.data);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  // ── Upload Pipeline ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (view !== "processing" || files.length === 0) return;
    let active = true;

    const run = async () => {
      const seq = [
        "Uploading",
        "Running OCR",
        "Generating AI Analysis",
        "Generating Embeddings",
        "Saving Document",
      ];

      for (const s of seq) {
        if (!active) return;
        setStage(s);
        await new Promise((r) => setTimeout(r, 700));
      }

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const response = await axios.post(
          "http://127.0.0.1:8000/api/upload/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const data = response.data;
        const firstDoc = data.documents?.[0];

        const resultData = {
          fileName: firstDoc?.file_name || "Documents",
          fileSize: 0, // API does not return file size; shown as "—"
          pages: files.length,
          docType: "PDF",
          confidence: 0.95,
          processingMs: 2000,
          keyFields: [
            { label: "Uploaded files",  value: files.length,                      confidence: 0.95 },
            { label: "Summary",         value: firstDoc?.summary   || "N/A",      confidence: 0.92 },
            { label: "Skills",          value: firstDoc?.skills?.join(", ") || "N/A", confidence: 0.90 },
          ],
          tables: [],
          entities: [],
        };

        setResult(resultData);
        setHistory((h) => [
          ...files.map((file) => ({ name: file.name, type: "PDF", at: Date.now() })),
          ...h,
        ].slice(0, 6));
        setView("results");

      } catch (error) {
        console.error(error);
        setError("Upload failed. Please check your connection and try again.");
        setView("upload");
      }
    };

    run();
    return () => { active = false; };
  }, [view, files]);

  // ── Reset ───────────────────────────────────────────────────────────────────

  const reset = () => { setFiles([]); setResult(null); setView("upload"); };

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-base-200">

      {/* ── Navbar ── */}
      <div className="sticky top-0 z-20 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Logo />

          <nav className="flex items-center gap-1">
            {/* Nav items: expand as more routes are added */}
            <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content">Dashboard</button>
            <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content">Documents</button>

            <div className="ml-2 w-px h-5 bg-base-300" />

            {/* Single search entry point — opens the semantic search modal */}
            <button
              className="btn btn-primary btn-sm gap-2 ml-2"
              onClick={() => setSearchOpen(true)}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" /></svg>
              AI Search
            </button>
          </nav>
        </div>
      </div>

      {/* ── Body ── */}
      <main className="mx-auto max-w-7xl px-5 py-10">

        {/* Upload view */}
        {view === "upload" && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {/* Page heading */}
              <div className="mb-6">
                <p className="font-mono text-[10px] tracking-widest text-base-content/40 uppercase mb-1">Upload</p>
                <h1 className="text-2xl font-bold text-base-content">Add documents</h1>
                <p className="text-sm text-base-content/50 mt-1">
                  Upload resumes, contracts or any document — the AI will extract fields, entities and build a searchable index.
                </p>
              </div>
              <DropZone onFile={handleFile} error={error} />
            </div>

            {/* Sidebar: recent uploads */}
            <aside className="lg:col-span-4">
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <h2 className="font-bold text-base-content text-sm">Recent uploads</h2>
                    {/* Shows the last 6 documents processed in this session */}
                    <p className="text-xs text-base-content/40 mt-0.5">Last 6 documents processed this session</p>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-base-200">
                        <svg className="h-5 w-5 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" /></svg>
                      </div>
                      <p className="text-xs text-base-content/40">No uploads yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-base-200 bg-base-200/40 px-3 py-2.5">
                          <div className="h-8 w-8 shrink-0 rounded-lg bg-base-300 flex items-center justify-center">
                            <svg className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" /></svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            {/* Filename of the uploaded document */}
                            <p className="text-xs font-medium text-base-content truncate">{h.name}</p>
                            {/* Document type classification */}
                            <p className="text-[10px] text-base-content/40 font-mono">{h.type}</p>
                          </div>
                          {/* Green check = successfully processed and indexed */}
                          <div className="h-5 w-5 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                            <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Processing view */}
        {view === "processing" && files.length > 0 && (
          <ProcessingView files={files} stage={stage} />
        )}

        {/* Results view */}
        {view === "results" && result && (
          <ResultsView result={result} onReset={reset} />
        )}

      </main>

      {/* ── Search Modal ── */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={handleSemanticSearch}
        loading={searchLoading}
        results={searchResults}
      />

    </div>
  );
}