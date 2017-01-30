'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') app.quit()
});

app.on('ready', function() {
  const windowSize = { width: 800, height: 600 }
  mainWindow = new BrowserWindow(windowSize)
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
})
