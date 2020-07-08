const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');

let mainWindow;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 550,
  });

  mainWindow = new BrowserWindow({
    width: 500,
    height: 550,
    x: mainWindowState.x,
    y: mainWindowState.y,
    maximizable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#111313',
    resizable: false,
    icon: path.join(__dirname, 'build/icon.png'),
    webPreferences: {
      //devTools: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'js/preload.js'),
    },
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.flashFrame(true);
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('run', (event, args) => {
  const client = require('discord-rich-presence')(args.id || '667588723415711765');

  if (args.party) {
    client.updatePresence({
      state: args.state,
      details: args.details,
      startTimestamp: Date.now(),
      instance: true,
      partyId: 'discordrp_party',
      partySize: 1,
      partyMax: 1,
      matchSecret: 'rpone',
      joinSecret: 'rptwo',
      spectateSecret: 'rpthree',
      largeImageKey: args.large || 'discordlarge',
      smallImageKey: args.small || 'discordrp',
    });
  } else {
    client.updatePresence({
      state: args.state,
      details: args.details,
      startTimestamp: Date.now(),
      instance: true,
      largeImageKey: args.large || 'discordlarge',
      smallImageKey: args.small || 'discordrp',
    });
  }

  console.log('rp');

  event.reply('run', 'done');
});

ipcMain.on('stop', (event, args) => {
  const remote = require('electron').remote;
  app.relaunch();
  app.exit(0);
  app.exit(0);
});

console.log('Launched');
