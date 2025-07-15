const DEBUG = true; 

function log(...args) {
  if (DEBUG) { 
    console.log(...args);
  };
};


let configPath;

window.addEventListener('DOMContentLoaded', async () => {
  log('Tauri ready?', window.__TAURI__);
  const { fs, path } = window.__TAURI__;
  log('fs module:', fs);
  log('path module:', path);
});

const resizer = document.querySelector('.resizer-left');

resizer.addEventListener('mousedown', onMouseDown);

function onMouseDown(e) {
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

function onMouseMove(e) {
  const minWidth = 150;
  const maxWidth = 500;
  let newWidth = e.clientX;

  if (newWidth < minWidth) {
    newWidth = minWidth;
  };

  if (newWidth > maxWidth) {
    newWidth = maxWidth;
  }

  document.querySelector('.left-sidebar').style.width = `${newWidth}px`;
};

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

const width = parseInt(document.querySelector('.left-sidebar').style.width);
log("Saving new sidebar width to config:", width);

window.__TAURI__.core.invoke("save_sidebar_width", {
  payload: { width: parseInt(document.querySelector('.left-sidebar').style.width) }
})
.then(() => log("Config saved via Rust command"))
.catch(err => console.error("Rust save failed:", err));
};



