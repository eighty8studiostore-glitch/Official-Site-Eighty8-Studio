"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createXRStore, XR, useXR, ARButton } from "@react-three/xr";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const M_TO_IN = 39.3701;

const store = createXRStore({
  depthSensing: true,
  hitTest: true,
});

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
  [PHASE.WIDTH_P1]: { step: 1, axis: "Width", hint: "Aim at one end of the piece and tap → Point A." },
  [PHASE.WIDTH_P2]: { step: 2, axis: "Width", hint: "Aim at the opposite end and tap → Point B." },
  [PHASE.HEIGHT_P1]: { step: 3, axis: "Height", hint: "Aim at one height edge and tap → Point A." },
  [PHASE.HEIGHT_P2]: { step: 4, axis: "Height", hint: "Aim at the opposite height edge and tap → Point B." },
  [PHASE.COMPLETE]: { step: 5, axis: null, hint: "Both dimensions captured. Review below." },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toInches = (m) => parseFloat((m * M_TO_IN).toFixed(2));
const distInches = (a, b) => toInches(a.distanceTo(b));

// ─── XRSessionWatcher ─────────────────────────────────────────────────────────
// Must be rendered INSIDE <XR>. Watches isPresenting via useXR() hook.

function XRSessionWatcher({ onStart, onEnd }) {
  // Use a selector for better performance in v6
  const isPresenting = useXR((state) => state.session !== null);
  const wasPresentingRef = useRef(false);

  useEffect(() => {
    if (isPresenting && !wasPresentingRef.current) {
      wasPresentingRef.current = true;
      onStart?.();
    } else if (!isPresenting && wasPresentingRef.current) {
      wasPresentingRef.current = false;
      onEnd?.();
    }
  }, [isPresenting, onStart, onEnd]);

  return null;
}

// ─── HitTestManager ──────────────────────────────────────────────────────────
// Rendered inside <XR>. Manages the WebXR hit-test source lifecycle and
// updates the reticle mesh position every frame.
// This replaces the removed useHitTest() hook with direct WebXR API calls.

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

    // ── Attach session-end cleanup once ──────────────────────────────────
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

    // ── Request hit-test source once per session ──────────────────────────
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
          console.warn("[ARMeasure] requestHitTestSource failed:", err);
          hitTestSourcePending.current = false;
        });
      return;
    }

    if (!hitTestSourceRef.current) return;

    // ── Read hit results and move reticle ─────────────────────────────────
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

  const reticleColor =
    [PHASE.WIDTH_P1, PHASE.WIDTH_P2].includes(phase) ? "#22c55e" :
      [PHASE.HEIGHT_P1, PHASE.HEIGHT_P2].includes(phase) ? "#f59e0b" : "#3b82f6";

  const handleTap = useCallback(() => {
    const mesh = reticleRef.current;
    if (!mesh?.visible) return;
    if (phase === PHASE.COMPLETE || phase === PHASE.IDLE) return;
    onPointPlaced(mesh.position.clone());
  }, [phase, onPointPlaced]);

  const ptColor = (axis, isFirst) =>
    axis === "width"
      ? (isFirst ? "#22c55e" : "#86efac")
      : (isFirst ? "#f59e0b" : "#fcd34d");

  return (
    <>
      <ambientLight intensity={1.2} />

      {/* Drives the reticle via raw WebXR API (replaces removed useHitTest) */}
      <HitTestManager reticleRef={reticleRef} />

      {/* Full-floor invisible tap surface */}
      <mesh onClick={handleTap} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Reticle ring — hidden until hit-test finds a real surface */}
      <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.038, 0.052, 40]} />
        <meshBasicMaterial color={reticleColor} transparent opacity={0.9} />
      </mesh>

      {/* Width points + line */}
      {widthPts.map((pos, i) => (
        <mesh key={`wp${i}`} position={pos}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshBasicMaterial color={ptColor("width", i === 0)} />
        </mesh>
      ))}
      {widthPts.length === 2 && <MeasureLine points={widthPts} color="#22c55e" />}

      {/* Height points + line */}
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
              <input
                type="number" step="0.01" min="0.1" required
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={label === "Width" ? "e.g. 11" : "e.g. 8.5"}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )
        )}
        {err && <p className="text-red-500 text-xs font-medium">⛔ {err}</p>}
        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]">
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
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all
              ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white ring-2 ring-blue-300" : "bg-slate-200 text-slate-400"}`}>
              {done ? "✓" : n}
            </div>
            <span className={`text-[9px] font-semibold uppercase truncate
              ${done ? "text-green-600" : active ? "text-blue-600" : "text-slate-400"}`}>
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

  // Device support check
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

  // Measurement state
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [widthPts, setWidthPts] = useState([]);
  const [heightPts, setHeightPts] = useState([]);
  const [widthIn, setWidthIn] = useState(null);
  const [heightIn, setHeightIn] = useState(null);
  const [arError, setArError] = useState("");

  const handlePointPlaced = useCallback((point) => {
    setPhase((prev) => {
      if (prev === PHASE.WIDTH_P1) {
        setWidthPts([point]);
        return PHASE.WIDTH_P2;
      }
      if (prev === PHASE.WIDTH_P2) {
        setWidthPts((pts) => {
          const next = [...pts, point];
          setWidthIn(distInches(next[0], next[1]));
          return next;
        });
        return PHASE.HEIGHT_P1;
      }
      if (prev === PHASE.HEIGHT_P1) {
        setHeightPts([point]);
        return PHASE.HEIGHT_P2;
      }
      if (prev === PHASE.HEIGHT_P2) {
        setHeightPts((pts) => {
          const next = [...pts, point];
          setHeightIn(distInches(next[0], next[1]));
          return next;
        });
        return PHASE.COMPLETE;
      }
      return prev;
    });
  }, []);

  const handleReset = () => {
    setPhase(PHASE.IDLE);
    setWidthPts([]);
    setHeightPts([]);
    setWidthIn(null);
    setHeightIn(null);
    setArError("");
  };

  const handleConfirm = () => {
    if (widthIn == null || heightIn == null) return;
    onMeasurementComplete({
      width: Math.max(widthIn, heightIn),
      height: Math.min(widthIn, heightIn),
    });
  };

  const meta = PHASE_META[phase];

  // ── Loading ──
  if (arSupport === "checking") {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Checking AR support…
      </div>
    );
  }

  // ── Manual fallback ──
  if (arSupport === "unsupported") {
    return <ManualEntryForm onMeasurementComplete={onMeasurementComplete} />;
  }

  // ── Full AR UI ──
  return (
    <div className="flex flex-col select-none">

      {arError && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex justify-between items-center">
          <span>⛔ {arError}</span>
          <button onClick={() => setArError("")} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="pt-4 pb-2">
        <Stepper phase={phase} />
      </div>

      <div className="px-4 py-2 text-center">
        {meta?.axis && (
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mr-2
            ${meta.axis === "Width" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {meta.axis}
          </span>
        )}
        <span className="text-sm text-slate-600">{meta?.hint}</span>
      </div>

      {(widthIn !== null || heightIn !== null) && (
        <div className="mx-4 mb-2 grid grid-cols-2 gap-2">
          {[
            { label: "Width", val: widthIn, ac: "bg-green-50 border-green-300", tc: "text-green-700", nc: "text-green-800" },
            { label: "Height", val: heightIn, ac: "bg-amber-50 border-amber-300", tc: "text-amber-700", nc: "text-amber-800" },
          ].map(({ label, val, ac, tc, nc }) => (
            <div key={label}
              className={`rounded-xl p-3 text-center border transition-all ${val !== null ? ac : "bg-slate-50 border-slate-200 opacity-40"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${tc}`}>{label}</p>
              <p className={`text-2xl font-extrabold ${nc}`}>{val !== null ? `${val}"` : "—"}</p>
            </div>
          ))}
        </div>
      )}

      {/* AR Canvas */}
      <div className="relative mx-4 rounded-2xl overflow-hidden bg-gray-900" style={{ height: 320 }}>
        {phase === PHASE.IDLE && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-black/50 rounded-xl px-5 py-3 text-center">
              <p className="text-white text-sm font-bold">📐 AR Measure</p>
              <p className="text-slate-300 text-xs mt-1">Press "Enter AR" below to start.</p>
            </div>
          </div>
        )}
        {phase !== PHASE.IDLE && phase !== PHASE.COMPLETE && (
          <div className="absolute top-2 right-2 z-10 text-[10px] space-y-1">
            {[["Width", "bg-green-400"], ["Height", "bg-amber-400"]].map(([lbl, bg]) => (
              <div key={lbl} className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5">
                <span className={`w-2 h-2 rounded-full ${bg} inline-block`} />
                <span className="text-white">{lbl}</span>
              </div>
            ))}
          </div>
        )}

        <Canvas>
          <Suspense fallback={null}>
            <XR>
              {/*
               * XRSessionWatcher must be inside <XR> to access the useXR() context.
               * It fires onStart when the AR session begins and onEnd when it closes.
               */}
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

      {/* ARButton — injects the browser-native WebXR "Enter AR" / "Exit AR" button */}
      <div className="mx-4 my-3 flex justify-center">
        <ARButton
          store={store}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg transition-all active:scale-[0.97]"
          
        />
      </div>

      <div className="px-4 pb-5 flex gap-3">
        {phase === PHASE.COMPLETE ? (
          <>
            <button onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98] shadow">
              ✅ Use {Math.max(widthIn ?? 0, heightIn ?? 0)}" × {Math.min(widthIn ?? 0, heightIn ?? 0)}"
            </button>
            <button onClick={handleReset}
              className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">
              🔄 Redo
            </button>
          </>
        ) : (
          <>
            {phase !== PHASE.IDLE && (
              <button onClick={handleReset}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm transition-all">
                🔄 Reset
              </button>
            )}
            {onClose && (
              <button onClick={onClose}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 font-medium py-3 rounded-xl text-sm border border-slate-200 transition-all">
                Cancel
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}