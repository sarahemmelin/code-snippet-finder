
const resizer = document.querySelector('.resizer-left');

resizer.addEventListener('mousedown', onMouseDown);

function onMouseDown(e) {
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

function onMouseMove(e) {
  const newWidth = e.clientX;
  document.querySelector('.left-sidebar').style.width = `${newWidth}px`;
};

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

