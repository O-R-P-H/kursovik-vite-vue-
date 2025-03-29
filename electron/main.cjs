const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 640,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/favicon.ico'), // Добавьте эту строку
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});
