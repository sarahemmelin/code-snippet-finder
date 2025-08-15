import { 
  log, 
  getMinWidthPx,
  clamp
} from './utils.mjs'

/*
TO DO:
[X] 1. Implementere funksjonalitet for right sidebar resizer.
   - Denne skal fungere på samme måte som left sidebar res
[X] 2. Lagre bredden på right sidebar i config-filen. 
   - Bruker samme metode som left sidebar.
3. Error - handling, ref Christian.
[X] 4. Teste begge resizers for å se at de fungerer som forventet.
[X] 5. Sjekke at right sidebar resizer ikke kræsjer med left sidebar resizer, og ikke går utenfor skjermen.
6. Refaktorere koden, fjerne duplikater og rydde enda mer.
7. Lage dokumentasjon for hvordan dette fungerer.
*/


const rightResizer = document.querySelector('.resizer-right');
const leftResizer = document.querySelector('.resizer-left');
const sidebar = document.querySelector('.left-sidebar');
const appWrapper = document.querySelector('.app-wrapper');
const rightSidebar = document.querySelector('.right-sidebar');


window.addEventListener('DOMContentLoaded', async () => {
  log('DOM fully loaded');
  log('Tauri ready?', window.__TAURI__);

  const invoke = window.__TAURI__?.core?.invoke;

  if (typeof invoke === 'function') {
    invoke("load_sidebar_width")
      .then((savedWidth) => {
        log("Loaded saved sidebar width:", savedWidth);
        const minWidth = 150;
        const maxWidth = 500;

        if (savedWidth >= minWidth && savedWidth <= maxWidth) {
          sidebar.style.width = `${savedWidth}px`;
        } else {
          log("Saved width out of bounds, ignoring.");
        }
      })
      .catch((err) => {
        log("No config file found or failed to load:", err);
      });
  }

if (typeof invoke === 'function') {
  invoke("load_right_sidebar_width")
    .then((savedRight) => {
      log("Loaded saved RIGHT width:", savedRight);

      if (!savedRight || savedRight <= 0) return;

      const rightMin = getMinWidthPx(rightSidebar, 160);
      const mainMin  = getMinWidthPx('.main-area', 300);

      const total = appWrapper.clientWidth;
      const leftW = sidebar.offsetWidth;

      const leftResizerW  = leftResizer.offsetWidth  || 5;
      const rightResizerW = rightResizer.offsetWidth || 5;
      const maxRight = total - leftW - leftResizerW - rightResizerW - mainMin;

      let applied = savedRight;
      if (applied < rightMin) applied = rightMin;
      if (applied > maxRight) applied = Math.max(rightMin, maxRight);

      rightSidebar.style.width = `${applied}px`;
    })
    .catch((err) => {
      log("No right width found or failed to load:", err);
    });
}

  //-- Mouse listeners inside DOMContentLoaded-----------------------

  leftResizer.addEventListener('mousedown', onMouseDownLeft);
  rightResizer.addEventListener('mousedown', onMouseDownRight);
  
  // LEFT RESIZER ---------------------------------------------------
  // Mouse down 
  function onMouseDownLeft(e) {
    document.addEventListener('mousemove', onMouseMoveLeft);
    document.addEventListener('mouseup', onMouseUpLeft);
  }

  // Mouse move
function onMouseMoveLeft(e) {
  const rect = appWrapper.getBoundingClientRect();
  const leftMin  = getMinWidthPx(sidebar, 150);
  const mainMin  = getMinWidthPx('.main-area', 300);

  const total = appWrapper.clientWidth;
  const leftResizerW  = leftResizer.offsetWidth  || 5;
  const rightResizerW = rightResizer.offsetWidth || 5;
  const currentRightW = rightSidebar.offsetWidth;

  let maxLeft = total - leftResizerW - rightResizerW - currentRightW - mainMin;
  if (maxLeft < leftMin) maxLeft = leftMin;

  let newWidth = e.clientX - rect.left;

  if (newWidth < leftMin) newWidth = leftMin;
  if (newWidth > maxLeft) newWidth = maxLeft;

  sidebar.style.width = `${newWidth}px`;
}

  // Mouse up
  function onMouseUpLeft(e) {
  document.removeEventListener('mousemove', onMouseMoveLeft);
  document.removeEventListener('mouseup', onMouseUpLeft);

  const width = parseInt(sidebar.style.width);
  log("Saving new sidebar width to config:", width);

  const invoke = window.__TAURI__?.core?.invoke;

  if (typeof invoke !== 'function') {
    console.error("Tauri not ready: 'invoke' is undefined.");
    return;
  }

  invoke("save_sidebar_width", {
    payload: { width }
  })
    .then(() => log("Config saved via Rust command"))
    .catch(err => console.error("Rust save failed:", err));
}
});

  // RIGHT RESIZER --------------------------------------------------
  // Mouse down
  function onMouseDownRight(e) {
    document.addEventListener('mousemove', onMouseMoveRight);
    document.addEventListener('mouseup', onMouseUpRight);
  }

  // Mouse move
function onMouseMoveRight(e) {
  const rect = appWrapper.getBoundingClientRect();
  const rightMin = getMinWidthPx(rightSidebar, 160);
  const mainMin  = getMinWidthPx('.main-area', 300);

  const total = appWrapper.clientWidth;
  const leftW  = sidebar.offsetWidth;
  const leftResizerW  = leftResizer.offsetWidth  || 5;
  const rightResizerW = rightResizer.offsetWidth || 5;

  let newRightW = rect.right - e.clientX;

  const maxRightW = total - leftW - leftResizerW - rightResizerW - mainMin;

  if (newRightW < rightMin) newRightW = rightMin;
  if (newRightW > maxRightW) newRightW = Math.max(rightMin, maxRightW);

  rightSidebar.style.width = `${newRightW}px`;
}

  // Mouse up
  function onMouseUpRight(e) {
    document.removeEventListener('mousemove', onMouseMoveRight);
    document.removeEventListener('mouseup', onMouseUpRight);
  const width = parseInt(rightSidebar.offsetWidth);

  const invoke = window.__TAURI__?.core?.invoke;
  if (typeof invoke !== 'function') {
    console.error("Tauri not ready: 'invoke' is undefined.");
    return;
  }

  invoke("save_right_sidebar_width", { payload: { width } })
    .then(() => log("Right sidebar width saved:", width))
    .catch(err => console.error("Failed to save right sidebar width:", err));
}
