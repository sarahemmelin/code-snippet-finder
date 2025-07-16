// --- DEBUG MODE -----------
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  log('DOM fully loaded');

  const sidebar = document.querySelector('.left-sidebar');
  const resizer = document.querySelector('.resizer-left');

  log('Tauri ready?', window.__TAURI__);

  // Try loading saved sidebar width
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



  resizer.addEventListener('mousedown', onMouseDown);

  function onMouseDown(e) {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    const minWidth = 150;
    const maxWidth = 500;
    let newWidth = e.clientX;

    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (newWidth > maxWidth) {
      newWidth = maxWidth;
    }

    sidebar.style.width = `${newWidth}px`;
  }

  function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

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




