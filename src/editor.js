const { ipcRenderer } = require('electron');
const marked = require('marked');

const markdownView = document.querySelector('.markdown-view');
const htmlView = document.querySelector('.html-view');

const renderMarkdownToHTML = markdown => {
  htmlView.innerHTML = marked(markdown);
};

ipcRenderer.on('file-opened', (event, { data }) => {
  markdownView.value = data;
  renderMarkdownToHTML(data);
});
