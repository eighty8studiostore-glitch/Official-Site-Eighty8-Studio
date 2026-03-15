"use client";

/**
 * page.js  —  Paper Weight Calculator
 * Redesigned with professional enterprise chatbot UI & Web3Forms Lead Capture
 */

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const ARMeasureTool = dynamic(() => import("./ARMeasure"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm gap-3">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      Loading AR tool…
    </div>
  ),
});

// ═══════════════════════════════════════════════════════════════
// MAPPINGS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// 👇 IMPORTANT: Replace this with your actual Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY_TOOL;

const FULL_SHEET_MAPPING = {
  "17x27": "17x27",
  "18x23": "23x36",
  "18x25": "25x36",
  "15x20": "20x30",
  "20x28": "20x28",
  "20x30": "20x30",
  "22x28": "22x28",
  "23x36": "23x36",
  "24x34": "24x34",
  "25x36": "25x36",
  "30x40": "30x40",
};

const JOB_SIZE_PRESETS = {
  "18x23 1/16": { dims: "5.5x4.25", baseUps: 16, label: "Business Card  (1/16 · 5.5×4.25\")" },
  "18x23 1/12": { dims: "7.3x4.25", baseUps: 12, label: "Slim Card  (1/12 · 7.3×4.25\")" },
  "18x23 1/10": { dims: "4.83x7.33", baseUps: 10, label: "1/10 Sheet  (4.83×7.33\")" },
  "18x23 1/8": { dims: "5.5x8.5", baseUps: 8, label: "Small Flyer  (1/8 · 5.5×8.5\")" },
  "18x23 1/6 Vertical": { dims: "7.3x8.5", baseUps: 6, label: "Tri-fold Panel — Vertical  (7.3×8.5\")" },
  "18x23 1/6 Horizontal": { dims: "11x5.6", baseUps: 6, label: "Tri-fold Panel — Horizontal  (11×5.6\")" },
  "18x23 1/5": { dims: "9.7x7.3", baseUps: 5, label: "1/5 Sheet  (9.7×7.3\")" },
  "18x23 Letter(1/4)": { dims: "11x8.5", baseUps: 4, label: "A4 / Letter  (1/4 · 11×8.5\")" },
  "18x23 1/2": { dims: "11x17", baseUps: 2, label: "Half Sheet / Tabloid  (11×17\")" },
  "full": { dims: "23x18", baseUps: 1, label: "Full Sheet  (23×18\")" },
  "18x25 A3": { dims: "11.7x16.5", baseUps: 4, label: "A3 Size  (11.7×16.5\")" },
  "18x25 A4": { dims: "11.7x8.3", baseUps: 8, label: "A4 Size  (11.7×8.3\")" },
  "18x25 A5": { dims: "5.8x8.3", baseUps: 16, label: "A5 Size  (5.8×8.3\")" },
  "legal": { dims: "8.5x13.5", baseUps: 4, label: "Legal Size  (8.5×13.5\")" },
  "20x30 1/8": { dims: "10x7.5", baseUps: 8, label: "20×30 — 1/8  (10×7.5\")" },
  "20x30 1/4": { dims: "10x15", baseUps: 4, label: "20×30 — 1/4  (10×15\")" },
};

const JOB_TO_PRINT_SHEET = {
  "5.5x4.25": "18x23", "7.3x4.25": "18x23", "4.83x7.33": "18x23", "5.5x8.5": "18x23",
  "7.3x8.5": "18x23", "11x5.6": "18x23", "9.7x7.3": "18x23", "11x8.5": "18x23",
  "23x18": "18x23", "11x17": "18x23", "11.7x16.5": "18x25", "11.7x8.3": "18x25",
  "5.8x8.3": "18x25", "8.5x13.5": "17x27", "10x7.5": "15x20", "10x15": "15x20",
};

const PRODUCT_ALIASES = {
  "business card": "18x23 1/16", "visiting card": "18x23 1/16", "name card": "18x23 1/16",
  "id card": "18x23 1/16", "loyalty card": "18x23 1/16", "membership card": "18x23 1/16",
  "gift card": "18x23 1/16", "flyer": "18x23 Letter(1/4)", "leaflet": "18x23 Letter(1/4)", 
  "pamphlet": "18x23 Letter(1/4)", "handout": "18x23 Letter(1/4)", "brochure": "18x23 Letter(1/4)",
  "3 fold brochure": "18x23 1/6 Horizontal", "trifold brochure": "18x23 1/6 Horizontal",
  "z fold brochure": "18x23 1/6 Horizontal", "bifold brochure": "18x23 Letter(1/4)",
  "poster": "full", "full sheet": "full", "a3": "18x25 A3", "a4": "18x25 A4", "a5": "18x25 A5", 
  "legal": "legal", "menu": "18x25 A4", "greeting card": "18x23 1/8", "invitation": "18x23 Letter(1/4)",
  "catalogue": "18x25 A4", "magazine": "18x25 A4", "booklet": "18x25 A5", "envelope": "18x23 1/8",
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function resolvePreset(presetKey) {
  const preset = JOB_SIZE_PRESETS[presetKey];
  if (!preset) return null;
  const printSheet = JOB_TO_PRINT_SHEET[preset.dims] || "";
  const fullSheet = (printSheet && FULL_SHEET_MAPPING[printSheet]) || "";
  let ups = preset.baseUps;
  if (
    (printSheet === "18x23" && fullSheet === "23x36") ||
    (printSheet === "18x25" && fullSheet === "25x36") ||
    (printSheet === "15x20" && fullSheet === "20x30")
  ) { ups = preset.baseUps * 2; }
  return { printSheetSize: printSheet, fullSheetSize: fullSheet, ups };
}

function dimScore(pw, ph, w, h) {
  const s1 = Math.abs(pw - w) / pw + Math.abs(ph - h) / ph;
  const s2 = Math.abs(pw - h) / pw + Math.abs(ph - w) / ph;
  return Math.min(s1, s2);
}

function findClosestPreset(widthIn, heightIn) {
  let bestKey = null, bestScore = Infinity;
  for (const [key, preset] of Object.entries(JOB_SIZE_PRESETS)) {
    const [pw, ph] = preset.dims.split("x").map(parseFloat);
    const score = dimScore(pw, ph, widthIn, heightIn);
    if (score < bestScore) { bestScore = score; bestKey = key; }
  }
  if (!bestKey) return null;
  return { key: bestKey, preset: JOB_SIZE_PRESETS[bestKey], score: bestScore, exact: bestScore < 0.30 };
}

const SORTED_ALIASES = Object.entries(PRODUCT_ALIASES).sort((a, b) => b[0].length - a[0].length);
const SORTED_PRESETS = Object.keys(JOB_SIZE_PRESETS).sort((a, b) => b.length - a.length);

function parsePrompt(text) {
  const lower = text.toLowerCase();
  const result = { copies: null, gsm: null, presetKey: null, detectedAlias: null };
  const copiesMatch =
    text.match(/(\d[\d,]*)\s*(?:copies|copy|pcs|pieces|prints?|nos?\.?|numbers?)/i) ||
    text.match(/(?:copies|copy|pcs|pieces|prints?|nos?\.?|numbers?)\s*[:\-]?\s*(\d[\d,]*)/i) ||
    text.match(/^(\d[\d,]*)\b/);
  if (copiesMatch) {
    const v = parseInt(copiesMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(v) && v > 0) result.copies = v;
  }
  const gsmMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:gsm|g\/m[²2]|grams?)/i);
  if (gsmMatch) {
    result.gsm = parseFloat(gsmMatch[1]);
  } else {
    const nums = [...text.matchAll(/\b(\d+)\b/g)].map(m => parseInt(m[1], 10)).filter(n => n >= 40 && n <= 400);
    if (nums.length > 0 && result.copies !== nums[0]) result.gsm = nums[0];
  }
  for (const [alias, key] of SORTED_ALIASES) {
    if (lower.includes(alias)) { result.presetKey = key; result.detectedAlias = alias; return result; }
  }
  for (const key of SORTED_PRESETS) {
    if (lower.includes(key.toLowerCase())) { result.presetKey = key; result.detectedAlias = key; return result; }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════
// AR & LEAD MODALS
// ═══════════════════════════════════════════════════════════════

function ARModal({ onClose, onMeasurementComplete }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="bg-[#13151C] border border-white/10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5 text-indigo-400" width="18" height="18"><path d="M3 7V4a1 1 0 011-1h3M17 7V4a1 1 0 00-1-1h-3M3 13v3a1 1 0 001 1h3M17 13v3a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><rect x="6" y="6" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AR Measurement</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Point camera at print piece to measure</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-all">
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <ARMeasureTool onMeasurementComplete={(dims) => { onMeasurementComplete(dims); onClose(); }} onClose={onClose} />
      </div>
    </div>
  );
}

function LeadModal({ onClose, onSubmit, leadData, setLeadData, submitting }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="bg-[#13151C] border border-white/10 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4.5 h-4.5 text-blue-400" width="18" height="18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Unlock Results</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Please provide your details to view calculation</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-all">
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        
        <form onSubmit={onSubmit} style={{ padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <StyledTextInput required placeholder="John Doe" value={leadData.name} onChange={(e) => setLeadData({...leadData, name: e.target.value})} />
            </div>

            <div>
              <FieldLabel>Mobile Number</FieldLabel>
              <StyledTextInput required placeholder="+1 234 567 8900" type="tel" value={leadData.mobile} onChange={(e) => setLeadData({...leadData, mobile: e.target.value})} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 24, width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer",
              background: submitting ? "rgba(59,130,246,.3)" : "linear-gradient(135deg, #2563EB, #3B82F6)",
              color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: ".02em",
              boxShadow: submitting ? "none" : "0 1px 20px rgba(59,130,246,.35)", transition: "all .2s", 
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: submitting ? .7 : 1,
            }}
          >
            {submitting ? (
              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Processing...</>
            ) : "View Results"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const DEFAULT_FORM = {
  jobSize: "", printSheetSize: "", fullSheetSize: "",
  jobCopies: "", gsm: "", ups: 1, wastePercent: 5,
};

export default function PaperCalculator() {
  const [prompt, setPrompt] = useState("");
  const [detectedInfo, setDetectedInfo] = useState({ alias: "", key: "" });
  const [parseWarning, setParseWarning] = useState("");
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [arMeasured, setArMeasured] = useState(null);

  // Lead Generation States
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false); // only ask once per session
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadData, setLeadData] = useState({ name: "",  mobile: "" });

  const applyPreset = useCallback((presetKey) => {
    const resolved = resolvePreset(presetKey);
    if (!resolved) return;
    setFormData(prev => ({ ...prev, jobSize: presetKey, ...resolved }));
  }, []);

  const handleARMeasurementComplete = useCallback(({ width, height }) => {
    const match = findClosestPreset(width, height);
    setArMeasured({ width, height, matchKey: match?.key ?? null, matchLabel: match ? match.preset.label : null, exact: match?.exact ?? false });
    if (match) {
      applyPreset(match.key);
      setDetectedInfo({ alias: `AR: ${width}"×${height}"`, key: match.key });
      setParseWarning(match.exact ? "" : `AR match is approximate — closest preset is "${match.preset.label}". Adjust manually if needed.`);
    } else {
      setParseWarning(`AR measured ${width}"×${height}" — no standard preset matched. Please select one manually.`);
    }
  }, [applyPreset]);

  useEffect(() => {
    const trimmed = prompt.trim();
    if (!trimmed) { setDetectedInfo({ alias: "", key: "" }); setParseWarning(""); return; }
    const parsed = parsePrompt(trimmed);
    let warning = "";
    setFormData(prev => {
      const next = { ...prev };
      if (parsed.copies) next.jobCopies = parsed.copies;
      if (parsed.gsm) next.gsm = parsed.gsm;
      if (parsed.presetKey) {
        const resolved = resolvePreset(parsed.presetKey);
        if (resolved) { next.jobSize = parsed.presetKey; next.printSheetSize = resolved.printSheetSize; next.fullSheetSize = resolved.fullSheetSize; next.ups = resolved.ups; }
      } else if (trimmed.length > 4) {
        warning = "Job type not recognised — please select a preset below.";
      }
      return next;
    });
    setDetectedInfo({ alias: parsed.detectedAlias || "", key: parsed.presetKey || "" });
    setParseWarning(warning);
  }, [prompt]);

  const handlePresetChange = (e) => {
    const key = e.target.value;
    if (!key) { setFormData(prev => ({ ...prev, jobSize: "", printSheetSize: "", fullSheetSize: "", ups: 1 })); setDetectedInfo({ alias: "", key: "" }); setArMeasured(null); return; }
    applyPreset(key);
    setDetectedInfo({ alias: key, key });
    setArMeasured(null);
  };

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  // Abstracted the actual API call logic
  const performCalculation = async () => {
    setLoading(true); setResults(null);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullSheetSize: formData.fullSheetSize, gsm: parseFloat(formData.gsm), totalJobCopies: parseInt(formData.jobCopies, 10), ups: parseInt(formData.ups, 10), wastePercent: parseFloat(formData.wastePercent) }),
      });
      const data = await res.json();
      if (res.ok) setResults(data);
      else alert("API error: " + data.error);
    } catch (err) { console.error("Calculation failed", err); alert("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  // Intercept calculation to show lead form
  const handleCalculateClick = (e) => {
    e.preventDefault();
    if (!formData.fullSheetSize) { alert("Full sheet size could not be determined. Please select a preset."); return; }
    
    if (!hasSubmittedLead) {
      setShowLeadModal(true);
    } else {
      performCalculation();
    }
  };

  // Submit Lead to Web3Forms
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLead(true);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New Lead from Paper Calculator",
          from_name: "Paper Calculator App",
          name: leadData.name,
          "Business Name": leadData.business,
          "Mobile Number": leadData.mobile,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setHasSubmittedLead(true); // Don't ask again this session
        setShowLeadModal(false);
        performCalculation(); // Proceed to show results!
      } else {
        alert("Failed to submit details. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error while submitting.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const preset = formData.jobSize ? JOB_SIZE_PRESETS[formData.jobSize] : null;

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts — IBM Plex Sans + JetBrains Mono */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        :root {
          --bg:       #0B0D12;
          --surface:  #111318;
          --surface2: #16191F;
          --border:   rgba(255,255,255,0.07);
          --border2:  rgba(255,255,255,0.12);
          --text:     #E8EAF0;
          --muted:    #5A5F74;
          --accent:   #3B82F6;
          --accent2:  #6366F1;
          --success:  #22C55E;
          --warning:  #F59E0B;
          --mono:     'JetBrains Mono', monospace;
          --sans:     'IBM Plex Sans', sans-serif;
        }
        body { background: var(--bg); font-family: var(--sans); color: var(--text); }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: var(--surface2); outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); border: 2px solid #0B0D12; box-shadow: 0 0 0 3px rgba(59,130,246,0.25); transition: box-shadow .15s; }
        input[type=range]::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px rgba(59,130,246,0.3); }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; }

        select { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A5F74' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px !important; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .fade-up { animation: fadeUp .35s ease both; }
        .pulse   { animation: pulse 2s ease infinite; }
        
        @keyframes numberIn { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }
        .num-in { animation: numberIn .4s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--sans)" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Page title */}
          <div style={{ paddingBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.025em", color: "#F1F3F9", lineHeight: 1.2 }}>
              Paper Weight Calculator
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 5, lineHeight: 1.5 }}>
              Describe your job — our AI detects product type, quantity &amp; GSM instantly
            </p>
          </div>

          {/* NLP / AI CHAT PANEL */}
          <section className="fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 20 20" fill="none" width="14" height="14"><circle cx="10" cy="7" r="3" stroke="#fff" strokeWidth="1.5" /><path d="M7 7h-.5a2 2 0 00-2 2v.5M13 7h.5a2 2 0 012 2v.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><rect x="5" y="12" width="10" height="5" rx="2" stroke="#fff" strokeWidth="1.5" /><circle cx="8" cy="14.5" r=".75" fill="#fff" /><circle cx="12" cy="14.5" r=".75" fill="#fff" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#C7CBE0", letterSpacing: ".01em" }}>AI Assistant</span>
                <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>Natural Language Input</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="pulse" style={{ display: "block", width: 7, height: 7, borderRadius: "50%", background: "var(--success)" }} />
                <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 500 }}>Online</span>
              </div>
            </div>

            <div style={{ padding: "16px 18px 18px" }}>
              <div style={{ display: "flex", gap: 9, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg viewBox="0 0 20 20" fill="none" width="12" height="12"><circle cx="10" cy="7" r="3" stroke="#fff" strokeWidth="1.5" /><rect x="5" y="12" width="10" height="5" rx="2" stroke="#fff" strokeWidth="1.5" /></svg>
                </div>
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "4px 14px 14px 14px", padding: "10px 14px", maxWidth: "85%" }}>
                  <p style={{ fontSize: 13, color: "#B0B6CE", lineHeight: 1.55 }}>
                    Hi! Describe your print job below and I'll auto-fill the form. Try <em style={{ color: "#7EA3F5" }}>"10,000 trifold brochures on 130gsm"</em> or <em style={{ color: "#7EA3F5" }}>"5000 visiting cards 350gsm"</em>.
                  </p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <textarea rows={3} style={{ width: "100%", padding: "12px 14px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 12, fontSize: 13.5, color: "var(--text)", resize: "none", outline: "none", transition: "border-color .15s, box-shadow .15s", fontFamily: "var(--sans)", lineHeight: 1.6 }} placeholder={"e.g. \"10,000 trifold brochures on 130gsm\""} value={prompt} onChange={(e) => setPrompt(e.target.value)} onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,.1)"; }} onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
                <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: "var(--muted)", pointerEvents: "none" }}>{prompt.length > 0 ? `${prompt.length} chars` : "Type your job"}</span>
              </div>

              {detectedInfo.alias && (
                <div className="fade-up" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,.1)", color: "#4ADE80", border: "1px solid rgba(34,197,94,.2)" }}>✓ Detected: "{detectedInfo.alias}"</span>
                  <svg viewBox="0 0 16 16" fill="none" width="10" height="10" style={{ color: "var(--muted)" }}><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(59,130,246,.1)", color: "#60A5FA", border: "1px solid rgba(59,130,246,.2)" }}>{formData.jobSize}</span>
                </div>
              )}
              {parseWarning && (
                <div className="fade-up" style={{ marginTop: 10, display: "flex", gap: 7, alignItems: "flex-start", padding: "9px 12px", borderRadius: 9, background: "rgba(245,158,11,.07)", border: "1px solid rgba(245,158,11,.2)" }}>
                  <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{ color: "#F59E0B", marginTop: 1, flexShrink: 0 }}><path d="M8 1L1 14h14L8 1zm0 4v5M8 12v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  <span style={{ fontSize: 12, color: "#FCD34D", lineHeight: 1.5 }}>{parseWarning}</span>
                </div>
              )}
            </div>
          </section>

          {/* MAIN FORM */}
          <form onSubmit={handleCalculateClick} className="fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", animationDelay: ".05s" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 9 }}>
              <svg viewBox="0 0 20 20" fill="none" width="15" height="15" style={{ color: "var(--muted)" }}><path d="M4 5h12M4 10h12M4 15h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>Job Parameters</span>
            </div>

            <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}>Product / Job Size</FieldLabel>
                  <select value={formData.jobSize} onChange={handlePresetChange} required style={{ marginTop: 6, width: "100%", padding: "9px 36px 9px 12px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 9, fontSize: 13, color: formData.jobSize ? "var(--text)" : "var(--muted)", outline: "none", cursor: "pointer", transition: "border-color .15s" }} onFocus={e => e.target.style.borderColor = "rgba(59,130,246,.5)"} onBlur={e => e.target.style.borderColor = "var(--border2)"}>
                    <option value="">Select preset…</option>
                    {Object.entries(JOB_SIZE_PRESETS).map(([key, val]) => ( <option key={key} value={key}>{val.label}</option> ))}
                  </select>

                  {preset && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, fontFamily: "var(--mono)" }}>Piece: {preset.dims} in</p>}

                  <button type="button" onClick={() => setShowARModal(true)} style={{ marginTop: 8, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "8px 12px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", color: "#A5B4FC", transition: "all .15s", letterSpacing: ".01em" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,.14)"; e.currentTarget.style.borderColor = "rgba(99,102,241,.35)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,.2)"; }}>
                    <svg viewBox="0 0 20 20" fill="none" width="13" height="13"><path d="M3 7V4a1 1 0 011-1h3M17 7V4a1 1 0 00-1-1h-3M3 13v3a1 1 0 001 1h3M17 13v3a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><rect x="6" y="6" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg> Measure with AR
                  </button>
                  {arMeasured && (
                    <div className="fade-up" style={{ marginTop: 8, padding: "9px 12px", borderRadius: 9, fontSize: 12, background: arMeasured.exact ? "rgba(34,197,94,.06)" : "rgba(245,158,11,.06)", border: `1px solid ${arMeasured.exact ? "rgba(34,197,94,.2)" : "rgba(245,158,11,.2)"}`, color: arMeasured.exact ? "#4ADE80" : "#FCD34D" }}>
                      <div style={{ fontWeight: 600, marginBottom: 3, fontFamily: "var(--mono)", fontSize: 11 }}>{arMeasured.exact ? "✓" : "~"} AR: {arMeasured.width}" × {arMeasured.height}"</div>
                      {arMeasured.matchLabel && <p style={{ fontSize: 10.5, opacity: .75, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>→ {arMeasured.matchLabel}</p>}
                      <button type="button" onClick={() => { setArMeasured(null); setShowARModal(true); }} style={{ marginTop: 4, fontSize: 10.5, opacity: .6, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}>Re-measure</button>
                    </div>
                  )}
                </div>

                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>}>Print Sheet</FieldLabel>
                  <input type="text" readOnly value={formData.printSheetSize} placeholder="Auto-detected" style={{ marginTop: 6, width: "100%", padding: "9px 12px", background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, color: "var(--muted)", fontFamily: "var(--mono)", outline: "none" }} />
                </div>
                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#60A5FA" strokeWidth="1.3" /><path d="M5 8h6M8 5v6" stroke="#60A5FA" strokeWidth="1.3" strokeLinecap="round" /></svg>} accent>Full Sheet <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 10.5 }}>(weight basis)</span></FieldLabel>
                  <input type="text" readOnly value={formData.fullSheetSize} placeholder="Auto-detected" required style={{ marginTop: 6, width: "100%", padding: "9px 12px", background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.25)", borderRadius: 9, fontSize: 13, fontWeight: 700, color: "#93C5FD", fontFamily: "var(--mono)", outline: "none" }} />
                </div>
              </div>

              <div style={{ height: 1, background: "var(--border)", margin: "0 -20px" }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M3 4h10M3 8h6M3 12h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}>Total Copies</FieldLabel>
                  <StyledNumInput value={formData.jobCopies} onChange={set("jobCopies")} placeholder="e.g. 10000" min={1} required />
                </div>
                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}>Paper GSM</FieldLabel>
                  <StyledNumInput value={formData.gsm} onChange={set("gsm")} placeholder="e.g. 130" min={40} max={400} required />
                </div>
                <div>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>}>UPS <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 10.5 }}>(per full sheet)</span></FieldLabel>
                  <StyledNumInput value={formData.ups} onChange={set("ups")} placeholder="auto" min={1} />
                </div>
              </div>

              <div style={{ height: 1, background: "var(--border)", margin: "0 -20px" }} />

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <FieldLabel icon={<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M2 14L14 2M6 14h8v-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}>Waste / Spoilage</FieldLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>{formData.wastePercent}%</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5, background: formData.wastePercent === 0 ? "rgba(34,197,94,.1)" : formData.wastePercent <= 5 ? "rgba(59,130,246,.1)" : formData.wastePercent <= 10 ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)", color: formData.wastePercent === 0 ? "#4ADE80" : formData.wastePercent <= 5 ? "#60A5FA" : formData.wastePercent <= 10 ? "#FCD34D" : "#F87171" }}>{formData.wastePercent === 0 ? "None" : formData.wastePercent <= 5 ? "Standard" : formData.wastePercent <= 10 ? "Moderate" : "High"}</span>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: 4, borderRadius: 2, background: "var(--accent)", width: `${(formData.wastePercent / 20) * 100}%`, pointerEvents: "none", zIndex: 1 }} />
                  <input type="range" min="0" max="20" step="1" style={{ width: "100%", position: "relative", zIndex: 2 }} value={formData.wastePercent} onChange={(e) => setFormData(prev => ({ ...prev, wastePercent: parseInt(e.target.value, 10) }))} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  {["0%", "5%", "10%", "15%", "20%"].map(v => ( <span key={v} style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)" }}>{v}</span> ))}
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(59,130,246,.3)" : "linear-gradient(135deg, #2563EB, #3B82F6)", color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: ".02em", boxShadow: loading ? "none" : "0 1px 20px rgba(59,130,246,.35)", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? .7 : 1 }} onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "linear-gradient(135deg,#1D4ED8,#2563EB)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,.45)"; } }} onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = "linear-gradient(135deg,#2563EB,#3B82F6)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 20px rgba(59,130,246,.35)"; } }}>
                {loading ? ( <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Calculating…</> ) : ( <><svg viewBox="0 0 20 20" fill="none" width="15" height="15"><path d="M4 10h12M11 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> Calculate Paper Weight</> )}
              </button>
            </div>
          </form>

          {/* RESULTS PANEL */}
          {results && (
            <section className="fade-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,.2)" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#B0B6CE", letterSpacing: ".08em", textTransform: "uppercase" }}>Results</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>
                  {results.meta.fullSheetSize}" · {results.meta.gsm} GSM · {results.meta.ups} UPS
                </span>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  <ResultTile label="Net Sheets" value={results.netSheets.toLocaleString()} />
                  <ResultTile label={`Waste +${results.wastePercent}%`} value={`+${results.wasteSheets.toLocaleString()}`} color="amber" />
                  <ResultTile label="Total Sheets" value={results.totalSheets.toLocaleString()} color="blue" />
                  <ResultTile label="Total Reams" value={results.totalReams.toFixed(2)} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>Net Weight</p>
                    <p className="num-in" style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--text)", letterSpacing: "-.02em", lineHeight: 1 }}>{results.netWeight}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>kg — no waste</p>
                  </div>
                  <div style={{ background: "linear-gradient(135deg,rgba(37,99,235,.2),rgba(59,130,246,.12))", border: "1px solid rgba(59,130,246,.3)", borderRadius: 12, padding: "18px 16px", textAlign: "center", boxShadow: "0 4px 24px rgba(59,130,246,.12)" }}>
                    <p style={{ fontSize: 11, color: "#93C5FD", marginBottom: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>Total Weight</p>
                    <p className="num-in" style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--mono)", color: "#fff", letterSpacing: "-.02em", lineHeight: 1 }}>{results.totalWeight}</p>
                    <p style={{ fontSize: 11, color: "#93C5FD", marginTop: 6 }}>kg — incl. waste</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {[ { label: "Per sheet", value: `${(results.weightPerSheet * 1000).toFixed(2)} g` }, { label: "Per ream", value: `${results.weightPerReam} kg` }, { label: "Net reams", value: results.netReams.toFixed(2) } ].map(({ label, value }) => (
                    <div key={label} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--mono)", color: "#C7CBE0" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* AR MODAL */}
      {showARModal && <ARModal onClose={() => setShowARModal(false)} onMeasurementComplete={handleARMeasurementComplete} />}

      {/* LEAD CAPTURE MODAL */}
      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} onSubmit={handleLeadSubmit} leadData={leadData} setLeadData={setLeadData} submitting={submittingLead} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FieldLabel({ children, icon, accent }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: accent ? "#60A5FA" : "#6B7280", cursor: "default" }}>
      {icon && <span style={{ color: accent ? "#60A5FA" : "#4B5563", display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </label>
  );
}

function StyledNumInput({ value, onChange, placeholder, min, max, required }) {
  return (
    <input type="number" value={value} onChange={onChange} placeholder={placeholder} min={min} max={max} required={required} style={{ marginTop: 6, width: "100%", padding: "9px 12px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 9, fontSize: 13, color: "var(--text)", fontFamily: "var(--mono)", outline: "none", transition: "border-color .15s, box-shadow .15s", WebkitAppearance: "none", MozAppearance: "textfield" }} onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,.1)"; }} onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
  );
}

function StyledTextInput({ value, onChange, placeholder, type = "text", required }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={{ marginTop: 6, width: "100%", padding: "10px 14px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 9, fontSize: 13, color: "var(--text)", fontFamily: "var(--sans)", outline: "none", transition: "border-color .15s, box-shadow .15s" }} onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,.1)"; }} onBlur={e => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }} />
  );
}

function ResultTile({ label, value, color }) {
  const colorMap = {
    blue: { bg: "rgba(59,130,246,.1)", border: "rgba(59,130,246,.2)", text: "#93C5FD" },
    amber: { bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.2)", text: "#FCD34D" },
    default: { bg: "var(--surface2)", border: "var(--border)", text: "#C7CBE0" },
  };
  const { bg, border, text } = colorMap[color] || colorMap.default;

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
      <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--mono)", color: text, letterSpacing: "-.01em" }}>{value}</p>
    </div>
  );
}