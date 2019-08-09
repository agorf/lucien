const { ipcRenderer } = require('electron');

const markdownView = document.querySelector('.markdown-view');

ipcRenderer.on('file-opened', (event, { data }) => {
  markdownView.value = data;
});
