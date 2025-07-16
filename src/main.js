// --- DEBUG MODE -----------
const DEBUG = true;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
};
// --- END DEBUG MODE ---------

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


  //-- Mouse listeners inside DOMContentLoaded-----------------------

  leftResizer.addEventListener('mousedown', onMouseDown);
  
  // Mouse down 
  function onMouseDown(e) {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // Mouse move
  function onMouseMove(e) {
    const minWidth = 150;
    const paddingBetween = 50;

    const maxAllowedWidth = rightResizer.offsetLeft - paddingBetween;
    let newWidth = e.clientX;

    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (newWidth > maxAllowedWidth) {
      newWidth = maxAllowedWidth;
    }

    sidebar.style.width = `${newWidth}px`;
  }

  // Mouse up
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

//-- End mouse listeners -----------------------


