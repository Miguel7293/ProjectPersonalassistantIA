// main.js
const { app, BrowserWindow } = require('electron');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000'); // URL de desarrollo de Next.js
  } else {
    win.loadFile('out/index.html'); // Archivos estáticos de producción
  }
}

app.on('ready', createWindow);
