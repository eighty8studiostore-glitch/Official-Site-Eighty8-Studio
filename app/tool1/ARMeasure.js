"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createXRStore, XR, useXR } from "@react-three/xr";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const M_TO_IN = 39.3701;

const store = createXRStore();

const PHASE = {
  IDLE: "IDLE",
  WIDTH_P1: "WIDTH_P1",
  WIDTH_P2: "WIDTH_P2",
  HEIGHT_P1: "HEIGHT_P1",
  HEIGHT_P2: "HEIGHT_P2",
  COMPLETE: "COMPLETE",
};

const PHASE_META = {
  [PHASE.IDLE]: { step: 0, axis: null, hint: 'Press "Enter AR" below to start.' },
  [PHASE.WIDTH_P1]: { step: 1, axis: "Width", hint: "Aim at one end and TAP SCREEN → Point A" },
  [PHASE.WIDTH_P2]: { step: 2, axis: "Width", hint: "Aim at opposite end and TAP SCREEN → Point B" },
  [PHASE.HEIGHT_P1]: { step: 3, axis: "Height", hint: "Aim at top edge and TAP SCREEN → Point A" },
  [PHASE.HEIGHT_P2]: { step: 4, axis: "Height", hint: "Aim at bottom edge and TAP SCREEN → Point B" },
  [PHASE.COMPLETE]: { step: 5, axis: null, hint: "Captured! Exit AR (X) to review." },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toInches = (m) => parseFloat((m * M_TO_IN).toFixed(2));
const distInches = (a, b) => toInches(a.distanceTo(b));

// ─── XRSessionWatcher ─────────────────────────────────────────────────────────

function XRSessionWatcher({ onStart, onEnd }) {
  const session = useXR((state) => state.session);
  const wasPresentingRef = useRef(false);

  useEffect(() => {
    const isPresenting = session !== null;
    if (isPresenting && !wasPresentingRef.current) {
      wasPresentingRef.current = true;
      onStart?.();
    } else if (!isPresenting && wasPresentingRef.current) {
      wasPresentingRef.current = false;
      onEnd?.();
    }
  }, [session, onStart, onEnd]);

  return null;
}

// ─── HitTestManager ──────────────────────────────────────────────────────────

function HitTestManager({ reticleRef }) {
  const hitTestSourceRef = useRef(null);
  const hitTestSourcePending = useRef(false);
  const sessionEndListenerAdded = useRef(false);
  const m4 = useRef(new THREE.Matrix4());

  useFrame((state, _delta, xrFrame) => {
    if (!xrFrame) {
      if (reticleRef.current) reticleRef.current.visible = false;
      return;
    }

    const session = state.gl.xr.getSession();
    if (!session) return;

    if (!sessionEndListenerAdded.current) {
      sessionEndListenerAdded.current = true;
      session.addEventListener("end", () => {
        hitTestSourceRef.current?.cancel?.();
        hitTestSourceRef.current = null;
        hitTestSourcePending.current = false;
        sessionEndListenerAdded.current = false;
        if (reticleRef.current) reticleRef.current.visible = false;
      }, { once: true });
    }

    if (!hitTestSourceRef.current && !hitTestSourcePending.current) {
      hitTestSourcePending.current = true;
      session
        .requestReferenceSpace("viewer")
        .then((viewerSpace) => session.requestHitTestSource({ space: viewerSpace }))
        .then((source) => {
          hitTestSourceRef.current = source;
          hitTestSourcePending.current = false;
        })
        .catch((err) => {
          console.warn("[ARMeasure] requestHitTestSource failed.", err);
          hitTestSourcePending.current = false;
        });
      return;
    }

    if (!hitTestSourceRef.current) return;

    const refSpace = state.gl.xr.getReferenceSpace();
    if (!refSpace) return;

    const results = xrFrame.getHitTestResults(hitTestSourceRef.current);
    const mesh = reticleRef.current;
    if (!mesh) return;

    if (results.length > 0) {
      const pose = results[0].getPose(refSpace);
      if (pose) {
        m4.current.fromArray(pose.transform.matrix);
        m4.current.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.visible = true;
        return;
      }
    }
    mesh.visible = false;
  });

  return null;
}

// ─── MeasureLine ─────────────────────────────────────────────────────────────

function MeasureLine({ points, color }) {
  const lineRef = useRef();

  useEffect(() => {
    if (!lineRef.current) return;
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    lineRef.current.geometry = geom;
    return () => geom.dispose();
  }, [points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry" />
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
}

// ─── MeasurementScene ─────────────────────────────────────────────────────────

function MeasurementScene({ phase, widthPts, heightPts, onPointPlaced }) {
  const reticleRef = useRef();
  const session = useXR((state) => state.session);

  const reticleColor =
    [PHASE.WIDTH_P1, PHASE.WIDTH_P2].includes(phase) ? "#22c55e" :
      [PHASE.HEIGHT_P1, PHASE.HEIGHT_P2].includes(phase) ? "#f59e0b" : "#3b82f6";

  // 1. FIX: Listen natively to WebXR "select" event (which triggers when you tap the screen in AR)
  useEffect(() => {
    if (!session) return;

    const handleSelect = () => {
      const mesh = reticleRef.current;
      // Only place a point if the reticle is currently visible on a surface
      if (mesh && mesh.visible) {
        if (phase !== PHASE.COMPLETE && phase !== PHASE.IDLE) {
          onPointPlaced(mesh.position.clone());
        }
      }
    };

    session.addEventListener("select", handleSelect);
    return () => session.removeEventListener("select", handleSelect);
  }, [session, phase, onPointPlaced]);

  const ptColor = (axis, isFirst) =>
    axis === "width"
      ? (isFirst ? "#22c55e" : "#86efac")
      : (isFirst ? "#f59e0b" : "#fcd34d");

  return (
    <>
      <ambientLight intensity={1.2} />
      <HitTestManager reticleRef={reticleRef} />

      {/* 2. FIX: Removed the invisible click plane that was breaking touch inputs */}
      
      <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.038, 0.052, 40]} />
        <meshBasicMaterial color={reticleColor} transparent opacity={0.9} />
      </mesh>

      {widthPts.map((pos, i) => (
        <mesh key={`wp${i}`} position={pos}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshBasicMaterial color={ptColor("width", i === 0)} />
        </mesh>
      ))}
      {widthPts.length === 2 && <MeasureLine points={widthPts} color="#22c55e" />}

      {heightPts.map((pos, i) => (
        <mesh key={`hp${i}`} position={pos}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshBasicMaterial color={ptColor("height", i === 0)} />
        </mesh>
      ))}
      {heightPts.length === 2 && <MeasureLine points={heightPts} color="#f59e0b" />}
    </>
  );
}

// ─── ManualEntryForm ──────────────────────────────────────────────────────────

function ManualEntryForm({ onMeasurementComplete }) {
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const wv = parseFloat(w);
    const hv = parseFloat(h);
    if (!wv || !hv || wv <= 0 || hv <= 0) {
      setErr("Please enter valid positive numbers for both dimensions.");
      return;
    }
    onMeasurementComplete({ width: Math.max(wv, hv), height: Math.min(wv, hv) });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 flex gap-2">
        <span>⚠️</span>
        <span>AR is not available on this device. Enter the dimensions manually instead.</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[{ label: "Width", val: w, set: setW }, { label: "Height", val: h, set: setH }].map(
          ({ label, val, set }) => (
            <div key={label}>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                {label} (inches)
              </label>
              <input type="number" step="0.01" min="0.1" required value={val} onChange={(e) => set(e.target.value)} placeholder={label === "Width" ? "e.g. 11" : "e.g. 8.5"} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
          )
        )}
        {err && <p className="text-red-500 text-xs font-medium">⛔ {err}</p>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]">
          Use These Dimensions →
        </button>
      </form>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ phase }) {
  const steps = ["Width A", "Width B", "Height A", "Height B", "Done"];
  const current = PHASE_META[phase]?.step ?? 0;

  return (
    <div className="flex items-center gap-1 px-4">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <div key={label} className="flex items-center gap-1 flex-1 min-w-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white ring-2 ring-blue-300" : "bg-slate-200 text-slate-400"}`}>
              {done ? "✓" : n}
            </div>
            <span className={`text-[9px] font-semibold uppercase truncate ${done ? "text-green-600" : active ? "text-blue-600" : "text-slate-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 ${done ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ARMeasureTool (main export) ──────────────────────────────────────────────

export default function ARMeasureTool({ onMeasurementComplete, onClose }) {
  const [arSupport, setArSupport] = useState("checking");
  
  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.xr) {
      setArSupport("unsupported");
      return;
    }
    navigator.xr
      .isSessionSupported("immersive-ar")
      .then((ok) => setArSupport(ok ? "supported" : "unsupported"))
      .catch(() => setArSupport("unsupported"));
  }, []);

  const [phase, setPhase] = useState(PHASE.IDLE);
  const [widthPts, setWidthPts] = useState([]);
  const [heightPts, setHeightPts] = useState([]);
  const [widthIn, setWidthIn] = useState(null);
  const [heightIn, setHeightIn] = useState(null);
  const [arError, setArError] = useState("");

  const handlePointPlaced = useCallback((point) => {
    setPhase((prev) => {
      if (prev === PHASE.WIDTH_P1) {
        setWidthPts([point]); return PHASE.WIDTH_P2;
      }
      if (prev === PHASE.WIDTH_P2) {
        setWidthPts((pts) => { const next = [...pts, point]; setWidthIn(distInches(next[0], next[1])); return next; });
        return PHASE.HEIGHT_P1;
      }
      if (prev === PHASE.HEIGHT_P1) {
        setHeightPts([point]); return PHASE.HEIGHT_P2;
      }
      if (prev === PHASE.HEIGHT_P2) {
        setHeightPts((pts) => { const next = [...pts, point]; setHeightIn(distInches(next[0], next[1])); return next; });
        return PHASE.COMPLETE;
      }
      return prev;
    });
  }, []);

  const handleReset = () => {
    setPhase(PHASE.IDLE); setWidthPts([]); setHeightPts([]); setWidthIn(null); setHeightIn(null); setArError("");
  };

  const handleConfirm = () => {
    if (widthIn == null || heightIn == null) return;
    onMeasurementComplete({ width: Math.max(widthIn, heightIn), height: Math.min(widthIn, heightIn) });
  };

  const meta = PHASE_META[phase];

  if (arSupport === "checking") return <div className="flex items-center justify-center h-40">Checking AR support…</div>;
  if (arSupport === "unsupported") return <ManualEntryForm onMeasurementComplete={onMeasurementComplete} />;

  const handleEnterAR = () => {
    store.enterAR({
      sessionInit: { requiredFeatures: ["hit-test"] }
    });
  };

  return (
    <div className="flex flex-col select-none">
      {arError && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex justify-between items-center">
          <span>⛔ {arError}</span>
          <button onClick={() => setArError("")} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="pt-4 pb-2"><Stepper phase={phase} /></div>

      <div className="px-4 py-2 text-center">
        {meta?.axis && (
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mr-2 ${meta.axis === "Width" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {meta.axis}
          </span>
        )}
        <span className="text-sm text-slate-600 font-medium">{meta?.hint}</span>
      </div>

      <div className="relative mx-4 rounded-2xl overflow-hidden bg-gray-900" style={{ height: 320 }}>
        <Canvas>
          <Suspense fallback={null}>
            <XR store={store}>
              <XRSessionWatcher
                onStart={() => setPhase(PHASE.WIDTH_P1)}
                onEnd={() => setPhase((p) => (p === PHASE.COMPLETE ? p : PHASE.IDLE))}
              />
              <MeasurementScene
                phase={phase}
                widthPts={widthPts}
                heightPts={heightPts}
                onPointPlaced={handlePointPlaced}
              />
            </XR>
          </Suspense>
        </Canvas>
      </div>

      <div className="mx-4 my-3 flex justify-center">
        <button
          onClick={handleEnterAR}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.97]"
        >
          {phase === PHASE.IDLE ? "Enter AR" : "Return to AR"}
        </button>
      </div>

      <div className="px-4 pb-5 flex gap-3">
        {phase === PHASE.COMPLETE ? (
          <>
            <button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow transition-all">
              ✅ Use {Math.max(widthIn ?? 0, heightIn ?? 0)}" × {Math.min(widthIn ?? 0, heightIn ?? 0)}"
            </button>
            <button onClick={handleReset} className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">🔄 Redo</button>
          </>
        ) : (
          <>
            {phase !== PHASE.IDLE && (
              <button onClick={handleReset} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm transition-all">🔄 Reset</button>
            )}
            {onClose && (
              <button onClick={onClose} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-medium py-3 rounded-xl text-sm border border-slate-200 transition-all">Cancel</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}