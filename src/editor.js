const { ipcRenderer, remote, shell } = require('electron');
const marked = require('marked');
const lodash = require('lodash');
const hljs = require('highlight.js');

const syncVerticalScroll = require('./sync-vertical-scroll');
const setUpDragAndDrop = require('./drag-and-drop');

const mainProcess = remote.require('./main');

const markdownView = document.querySelector('.markdown-view');
const htmlView = document.querySelector('.html-view');

const highlightCode = (code, language) => {
  if (language.length === 0 || /no(-?)highlight|plain|text/.test(language)) {
    return code;
  }

  return hljs.highlight(language, code).value;
};

const renderMarkdownToHTML = lodash.throttle(markdown => {
  htmlView.innerHTML = marked(markdown, {
    smartypants: true,
    highlight: highlightCode
  });
}, 10);

ipcRenderer.on('open-file', (event, data) => {
  markdownView.value = data;
  renderMarkdownToHTML(data);
  markdownView.focus();
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

ipcRenderer.on('export-as-html', () => {
  mainProcess.exportAsHTMLFileWithDialog(htmlView.innerHTML);
});

markdownView.addEventListener('input', ({ target }) => {
  mainProcess.setFileState({
    data: target.value,
    isDirty: true
  });
  renderMarkdownToHTML(target.value);
});

htmlView.addEventListener('click', event => {
  const { target } = event;
  const href = target.getAttribute('href');

  if (target.tagName !== 'A' || href[0] === '#') return;

  event.preventDefault();
  shell.openExternal(href);
});

syncVerticalScroll([markdownView, htmlView]);

setUpDragAndDrop(markdownView, filePath => {
  mainProcess.showSaveChangesDialog({
    onDiscard: () => mainProcess.openFile(filePath),
    onSave: () => {
      mainProcess
        .saveFileWithDialog()
        .then(() => mainProcess.openFile(filePath))
        .catch(error => {
          throw new Error(error);
        });
    }
  });
});

markdownView.focus();
