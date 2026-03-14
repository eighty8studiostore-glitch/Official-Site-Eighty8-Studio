import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

/**
 * Exact conversion: 1 square inch = 645.16 square millimetres.
 * Standard paper weight formula (ISO 536):
 *   Weight (kg) = (L_mm × W_mm × GSM × sheets) / 1,000,000,000
 *
 * Since our dimensions are in inches we derive:
 *   Weight (kg) = (L_in × W_in × 645.16 × GSM × sheets) / 1,000,000,000
 *
 * For one ream (500 sheets) this simplifies to:
 *   weightPerReam = (L × W × GSM) / (1,000,000,000 / (500 × 645.16))
 *                = (L × W × GSM) / 3100.6  ← the ÷3100 you see in legacy code
 */
const SQ_IN_TO_SQ_MM = 645.16;          // mm² per in²
const SHEETS_PER_REAM = 500;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Round a number to `decimals` places.
 */
const round = (value, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

// ─────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      fullSheetSize,
      gsm,
      totalJobCopies,
      ups,
      wastePercent = 5,   // default 5 % spoilage/makeready
    } = body;

    // ── 1. Validate required fields ──────────────────────────
    if (!fullSheetSize || !gsm || !totalJobCopies || !ups) {
      return NextResponse.json(
        { error: 'Missing required fields: fullSheetSize, gsm, totalJobCopies, ups.' },
        { status: 400 }
      );
    }

    const parsedGsm       = parseFloat(gsm);
    const parsedCopies    = parseInt(totalJobCopies, 10);
    const parsedUps       = parseInt(ups, 10);
    const parsedWaste     = Math.max(0, Math.min(100, parseFloat(wastePercent)));

    if (isNaN(parsedGsm) || parsedGsm <= 0) {
      return NextResponse.json({ error: 'Invalid GSM value.' }, { status: 400 });
    }
    if (isNaN(parsedCopies) || parsedCopies <= 0) {
      return NextResponse.json({ error: 'Invalid totalJobCopies value.' }, { status: 400 });
    }
    if (isNaN(parsedUps) || parsedUps <= 0) {
      return NextResponse.json({ error: 'Invalid ups value.' }, { status: 400 });
    }

    // ── 2. Parse sheet dimensions (accepts "23x36" or "23X36") ─
    const [lengthStr, widthStr] = fullSheetSize.toLowerCase().split('x');
    const length = parseFloat(lengthStr);
    const width  = parseFloat(widthStr);

    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
      return NextResponse.json(
        { error: `Invalid fullSheetSize format: "${fullSheetSize}". Expected "LxW" e.g. "23x36".` },
        { status: 400 }
      );
    }

    // ── 3. Sheet counts ───────────────────────────────────────

    // Net sheets = exact sheets needed to fulfil job (no waste)
    const netSheets = Math.ceil(parsedCopies / parsedUps);

    // Waste/spoilage/makeready sheets on top
    const wasteSheets = Math.ceil(netSheets * (parsedWaste / 100));

    // Total sheets to order/cut
    const totalSheets = netSheets + wasteSheets;

    // ── 4. Ream counts ────────────────────────────────────────
    const netReams   = round(netSheets   / SHEETS_PER_REAM, 3);
    const totalReams = round(totalSheets / SHEETS_PER_REAM, 3);

    // ── 5. Weight calculation (ISO 536, inch dimensions) ─────
    //
    //   weightPerSheet (kg) = L_in × W_in × SQ_IN_TO_SQ_MM × GSM
    //                         ─────────────────────────────────────
    //                                    1 000 000 000
    //
    const weightPerSheet = (length * width * SQ_IN_TO_SQ_MM * parsedGsm) / 1_000_000_000;

    const netWeight   = round(weightPerSheet * netSheets,   2);
    const totalWeight = round(weightPerSheet * totalSheets, 2);

    // Weight of exactly one ream (useful for ordering reference)
    const weightPerReam = round(weightPerSheet * SHEETS_PER_REAM, 3);

    // ── 6. Return enriched payload ────────────────────────────
    return NextResponse.json({
      // Sheet breakdown
      netSheets,
      wasteSheets,
      totalSheets,
      wastePercent: parsedWaste,

      // Ream breakdown
      netReams,
      totalReams,
      sheetsPerReam: SHEETS_PER_REAM,

      // Weight breakdown
      weightPerSheet: round(weightPerSheet, 6),   // kg per single sheet
      weightPerReam,                               // kg per ream of 500
      netWeight,                                   // kg net (no waste)
      totalWeight,                                 // kg total (with waste)

      // Echo inputs for UI confirmation
      meta: {
        fullSheetSize,
        gsm:         parsedGsm,
        ups:         parsedUps,
        totalJobCopies: parsedCopies,
      },
    });

  } catch (error) {
    console.error('[calculate] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error during calculation.' },
      { status: 500 }
    );
  }
}