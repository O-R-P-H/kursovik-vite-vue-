const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
        }
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        mainWindow.webContents.openDevTools()
        mainWindow.loadURL('http://localhost:5173');
    } else {
        const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
        console.log('Loading File:', indexPath);
        mainWindow.webContents.openDevTools()
        mainWindow.loadFile(indexPath);
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});