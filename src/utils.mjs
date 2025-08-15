// --- DEBUG MODE -----------
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
};
// --- END DEBUG MODE ---------

// --- HELP FUNCTIONS ---------
// --- get minimum width ---//
function getMinWidthPx(target, fallback) {
  let element = null;

  if (typeof target === "string"){
    element = document.querySelector(target);
  } else if (target && target.nodeType === 1) {
    element = target;
  }
  if (!element) {
    log("Element not found, using fallback:", target, fallback);
    return fallback;
  }
  
  const v = parseInt(getComputedStyle(element).minWidth);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

// --- clamper ---
function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// --- END HELP FUNCTIONS -----

export {
  log,
  getMinWidthPx,
  clamp
};