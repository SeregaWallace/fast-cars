const { app, BrowserWindow } = require('electron');

const url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, 'index.html'),
});

let win;

const createWindowApp = () => {
    win = new BrowserWindow({
        width: 500,
        height: 800,
    });

    win.loadURL(url);
    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindowApp);
// for Mac
app.on('window-all-closed', () => {
    app.quit();
});
/* also you can install the "electron-packager" and build your game for your system "windows,
macOs or linux". And run the game from the folder.
command's for electron-packager -> 
1. " npm i electron-packager -g "
2. " npm i electron-packager -D "
3. " electron-packager . "
*/