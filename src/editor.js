const { ipcRenderer, remote } = require('electron');
const marked = require('marked');

const markdownView = document.querySelector('.markdown-view');
const htmlView = document.querySelector('.html-view');

const renderMarkdownToHTML = markdown => {
  htmlView.innerHTML = marked(markdown);
};

const mainProcess = remote.require('./main');

ipcRenderer.on('open-file', (event, data) => {
  markdownView.value = data;
  renderMarkdownToHTML(data);
  markdownView.focus();
});

ipcRenderer.on('save-file', (event, filePath) => {
  mainProcess.saveFileWithDialog(filePath, markdownView.value);
});

ipcRenderer.on('new-file', () => {
  markdownView.value = '';
  htmlView.innerHTML = '';
  markdownView.focus();
});

ipcRenderer.on('window-resize', (event, bounds) => {
  document.body.classList[bounds.width < bounds.height ? 'add' : 'remove'](
    'portrait'
  );
});

markdownView.addEventListener('input', ({ target }) => {
  mainProcess.markFileDirty();
  renderMarkdownToHTML(target.value);
});

markdownView.focus();
