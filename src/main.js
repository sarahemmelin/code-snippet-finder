
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
};

