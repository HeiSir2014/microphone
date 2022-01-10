// Modules to control application life and create native browser window
const { app, BrowserWindow,Tray,Menu } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    icon: path.join(__dirname, 'static/icon/logo.ico')
  });
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'static/index.html'))

  mainWindow.on('close',function(e){
    console.log("close")
    mainWindow && e.preventDefault()
    mainWindow && mainWindow.hide()
  })
  mainWindow.on('closed',()=> mainWindow=null );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  tray = new Tray(path.join(__dirname, 'static/icon/logo.png'))
  tray.setTitle("麦克风侦听服务");
  tray.setToolTip("麦克风侦听服务");
  tray.on("double-click", () => {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      type: 'normal',
      click: () => {
        mainWindow.show();
      }
    },
    {
      type: 'separator'
    }, {
      label: '重启服务',
      type: 'normal',
      click: () => {
        mainWindow = null;
        BrowserWindow.getAllWindows().forEach(win => win.close())
        tray && tray.destroy();
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        app.quit()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        mainWindow = null;
        BrowserWindow.getAllWindows().forEach(win => win.close())
        tray && tray.destroy();
        app.quit()
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
}

(function () {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return
  }
  app.commandLine.appendSwitch('no-sandbox')
  app.commandLine.appendSwitch('disable-gpu')
  app.commandLine.appendSwitch('disable-software-rasterizer')
  app.commandLine.appendSwitch('disable-gpu-compositing')
  app.commandLine.appendSwitch('disable-gpu-rasterization')
  app.commandLine.appendSwitch('disable-gpu-sandbox')
  app.commandLine.appendSwitch('--no-sandbox')
  app.disableHardwareAcceleration();

  app.whenReady().then(() => {

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
})();