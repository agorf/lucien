const { dialog } = require('electron').remote;

const getDraggedFiles = event => event.dataTransfer.items;

const getDroppedFiles = event => event.dataTransfer.files;

const isFileTypeSupported = file => {
  return ['text/markdown', 'text/plain'].includes(file.type);
};

const showError = message => {
  dialog.showMessageBoxSync({
    type: 'error',
    buttons: ['Close'],
    defaultId: 0,
    cancelId: 0,
    title: 'Error',
    message
  });
};

const addEventListeners = (element, onDrop) => {
  element.addEventListener('dragover', event => {
    const files = getDraggedFiles(event);

    if (files.length > 1) return;

    event.target.classList.add(
      isFileTypeSupported(files[0]) ? 'drag-over' : 'drag-error'
    );
  });

  element.addEventListener('drop', event => {
    const files = getDroppedFiles(event);

    if (files.length > 1) {
      showError('Dragging many files is not supported!');
      return;
    }

    if (isFileTypeSupported(files[0])) {
      onDrop(files[0].path);
    } else {
      showError('File type is not supported!');
    }

    event.target.classList.remove('drag-over');
    event.target.classList.remove('drag-error');
  });

  element.addEventListener('dragleave', ({ target }) => {
    target.classList.remove('drag-over');
    target.classList.remove('drag-error');
  });
};

module.exports = addEventListeners;
