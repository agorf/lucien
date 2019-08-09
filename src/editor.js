const { ipcRenderer, remote } = require('electron');
const marked = require('marked');

const markdownView = document.querySelector('.markdown-view');
const htmlView = document.querySelector('.html-view');

const renderMarkdownToHTML = markdown => {
  htmlView.innerHTML = marked(markdown);
};

const mainProcess = remote.require('./main');

let openFilePath = null;

ipcRenderer.on('open-file', (event, { path, data }) => {
  openFilePath = path;
  markdownView.value = data;
  renderMarkdownToHTML(data);
});

ipcRenderer.on('save-file', () => {
  mainProcess.saveFileWithDialog(openFilePath, markdownView.value);
});

ipcRenderer.on('new-file', () => {
  openFilePath = null;
  markdownView.value = '';
  htmlView.innerHTML = '';
});

ipcRenderer.on('window-resize', (event, bounds) => {
  document.body.classList[bounds.width < bounds.height ? 'add' : 'remove'](
    'portrait'
  );
});

markdownView.addEventListener('keyup', ({ target }) => {
  renderMarkdownToHTML(target.value);
});
