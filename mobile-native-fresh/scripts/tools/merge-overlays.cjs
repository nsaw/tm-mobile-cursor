#!/usr/bin/env node
/*
 * Merge hardened overlay JSON patches with their base patch JSON.
 * Output merged files into:
 *   /Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/000-007_hardened-merge
 *
 * Merge strategy (conservative):
 * - Start from base JSON
 * - Annotate with: { hardened: true }
 * - Attach overlay document under key: "_overlay" (for reference)
 * - Merge postMutationBuild.shell as union (overlay first, then base)
 * - Preserve base fields (blockId, summaryFile, successCriteria, etc.)
 * - Do NOT attempt to translate overlay.mutations ops into base.mutations
 *   (schema differs: ops vs shell). Those ops are preserved under _overlay.
 *
 * This produces a reviewable merged artifact without risking runner schema
 * mismatches. Execution semantics remain those of the base patch.
 */
const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return { ok: true, raw, data: JSON.parse(raw) };
  } catch (err) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return { ok: false, raw, error: err.message };
    } catch (e2) {
      console.error(`WARN: Failed to read file: ${filePath}\n  → ${e2.message}`);
      return { ok: false, raw: '', error: e2.message };
    }
  }
}

function uniqueStrings(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr) {
    if (typeof s !== 'string') continue;
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

function mergePostMutationBuild(baseDoc, overlayDoc) {
  const baseShell = (baseDoc && baseDoc.postMutationBuild && Array.isArray(baseDoc.postMutationBuild.shell))
    ? baseDoc.postMutationBuild.shell
    : (baseDoc && baseDoc.postMutationBuild && baseDoc.postMutationBuild.shell) || [];
  const overlayShell = (overlayDoc && overlayDoc.postMutationBuild && Array.isArray(overlayDoc.postMutationBuild.shell))
    ? overlayDoc.postMutationBuild.shell
    : (overlayDoc && overlayDoc.postMutationBuild && overlayDoc.postMutationBuild.shell) || [];

  const mergedShell = uniqueStrings([ ...overlayShell, ...baseShell ]);
  const out = { shell: mergedShell };
  return out;
}

function writeJson(filePath, obj) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// Input pairs
const pairs = [
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.552(P6.6.000)_navigator-route-consolidation_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.552(P6.6.000)_navigator-route-consolidation.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.553(P6.6.001)_search-screen-implementation_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.553(P6.6.001)_search-screen-implementation.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.554(P6.6.002)_thoughtmarks-all-screen_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.554(P6.6.002)_thoughtmarks-all-screen.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.555(P6.6.003)_auth-trio-screens_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.555(P6.6.003)_auth-trio-screens.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.556(P6.6.004)_settings-subpages_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.556(P6.6.004)_settings-subpages.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.557(P6.6.005)_bins-and-tags-navigation_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.557(P6.6.005)_bins-and-tags-navigation.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.558(P6.6.006)_bulk-operations-surfacing_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.558(P6.6.006)_bulk-operations-surfacing.json',
  },
  {
    overlay: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.559(P6.6.007)_onboarding-modal-canonicalization_HARDENED.overlay.json',
    base: '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/patch-v1.6.559(P6.6.007)_onboarding-modal-canonicalization.json',
  },
];

const outputDir = '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/phase-6.6/P6.6_GPT-revisions/000-007_hardened-merge';

fs.mkdirSync(outputDir, { recursive: true });

let merges = 0;
for (const { overlay, base } of pairs) {
  const baseRes = readJson(base);
  const overlayRes = readJson(overlay);

  if (!overlayRes.raw) {
    console.error(`SKIP: Overlay missing or unreadable\n  overlay: ${overlay}`);
    continue;
  }
  if (!baseRes.raw) {
    console.error(`SKIP: Base missing or unreadable\n  base: ${base}`);
    continue;
  }

  // Build wrapper object that always contains raw, and includes parsed JSON where possible
  const wrapper = {
    mergedFormatVersion: 1,
    mergedType: 'base+overlay-wrapper',
    hardened: true,
    source: { basePath: base, overlayPath: overlay },
    parse: {
      base: { ok: !!baseRes.ok, error: baseRes.ok ? undefined : baseRes.error },
      overlay: { ok: !!overlayRes.ok, error: overlayRes.ok ? undefined : overlayRes.error },
    },
    baseRaw: baseRes.raw,
    overlayRaw: overlayRes.raw,
  };

  // Attach parsed docs (best-effort)
  if (baseRes.ok) wrapper.base = baseRes.data;
  if (overlayRes.ok) wrapper.overlay = overlayRes.data;

  // Best-effort merged postMutationBuild shell when both parsed
  if (baseRes.ok || overlayRes.ok) {
    try {
      const mergedPMB = mergePostMutationBuild(baseRes.ok ? baseRes.data : {}, overlayRes.ok ? overlayRes.data : {});
      wrapper.postMutationBuildMerged = mergedPMB;
    } catch (e) {
      wrapper.postMutationBuildMerged = { shell: [], error: String(e && e.message || e) };
    }
  }

  const baseName = path.basename(base).replace(/\.json$/i, '_HARDENED.merged.wrapper.json');
  const outPath = path.join(outputDir, baseName);
  writeJson(outPath, wrapper);
  merges += 1;
  console.log(`Merged (wrapper) → ${outPath}`);
}

console.log(`Done. Total merged: ${merges}`);


