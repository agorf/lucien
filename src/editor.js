const { ipcRenderer, remote } = require('electron');
const marked = require('marked');
const lodash = require('lodash');
const hljs = require('highlight.js');

const mainProcess = remote.require('./main');

const markdownView = document.querySelector('.markdown-view');
const htmlView = document.querySelector('.html-view');
const htmlWrapper = document.querySelector('.html-wrapper');

const renderMarkdownToHTML = markdown => {
  htmlView.innerHTML = marked(markdown, {
    smartypants: true,
    highlight: code => hljs.highlightAuto(code).value
  });
};

const syncVerticalScroll = (target, other) => {
  const percentage =
    target.scrollTop / (target.scrollHeight - target.offsetHeight);

  other.scrollTop = Math.round(
    percentage * (other.scrollHeight - other.offsetHeight)
  );
};

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

let isSyncingMarkdownScroll = false;
let isSyncingHTMLScroll = false;

markdownView.addEventListener(
  'scroll',
  lodash.throttle(({ target }) => {
    if (isSyncingMarkdownScroll) {
      isSyncingMarkdownScroll = false;
      return;
    }

    isSyncingHTMLScroll = true;
    const otherView = target === markdownView ? htmlWrapper : markdownView;
    syncVerticalScroll(target, otherView);
  }, 10)
);

htmlWrapper.addEventListener(
  'scroll',
  lodash.throttle(({ target }) => {
    if (isSyncingHTMLScroll) {
      isSyncingHTMLScroll = false;
      return;
    }

    isSyncingMarkdownScroll = true;
    const otherView = target === markdownView ? htmlWrapper : markdownView;
    syncVerticalScroll(target, otherView);
  }, 10)
);

markdownView.focus();
