const { app, ipcMain } = require('electron/main')
const MainWindow = require('./windows/mainWindow')
const OverlayWindow = require('./windows/overlayWindow')
const keyboardService = require('./services/keyboardListener')
const { resetKeys } = require('./services/keyMappings')
const { loadKeyPositions, saveKeyPositions, resetKeyPositions } = require('./services/keyPositions')
const { saveBackgroundColor, loadBackgroundColor, resetBackgroundColor } = require('./services/backgroundColor')

// main 코드 변경 시 자동 재시작
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: false,
      ignore: ['node_modules/*', 'src/renderer/*'],
      paths: ['src/main/**/*']
    })
  } catch (err) { console.log(err) }
}

class Application {
  constructor() {
    this.mainWindow = null
    this.overlayWindow = null
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    // ANGLE 백엔드 설정 (d3d11, d3d9, gl, default)
    app.commandLine.appendSwitch('use-angle', 'd3d9')
    app.whenReady().then(() => this.createWindows())
    app.on('window-all-closed', this.handleWindowsClosed.bind(this))
    // app.disableHardwareAcceleration()

    // 윈도우 컨트롤
    ipcMain.on('minimize-window', () => this.mainWindow.minimize())
    ipcMain.on('close-window', () => {
      this.mainWindow.close()
      this.overlayWindow.close()
    })
    
    // 키매핑 요청 처리
    ipcMain.on('getKeyMappings', (e) => {
      e.reply('updateKeyMappings', keyboardService.getKeyMappings())
    })

    ipcMain.on('update-key-mapping', (e, keys) => {
      keyboardService.updateKeyMapping(keys);
      this.overlayWindow.webContents.send('updateKeyMappings', keys);
    })

    // 키포지션 요청 처리
    ipcMain.on('getKeyPositions', (e) => {
      e.reply('updateKeyPositions', loadKeyPositions());
    });

    ipcMain.handle('update-key-positions', async (e, positions) => {
      try {
        await saveKeyPositions(positions);
        this.overlayWindow.webContents.send('updateKeyPositions', positions);
        return true;
      } catch (error) {
        console.error('Failed to save positions:', error);
        throw error;
      }
    });

    // 배경색 요청 처리 
    ipcMain.on('getBackgroundColor', (e) => {
      e.reply('updateBackgroundColor', loadBackgroundColor());
    });

    ipcMain.on('update-background-color', (e, color) => {
      saveBackgroundColor(color);
      this.overlayWindow.webContents.send('updateBackgroundColor', color);
    });

    // 초기화 요청 처리
    ipcMain.on('reset-keys', (e) => {
      const defaultKeys = resetKeys();
      const defaultPositions = resetKeyPositions();
      const defaultColor = resetBackgroundColor();
      
      keyboardService.updateKeyMapping(defaultKeys);
      
      this.overlayWindow.webContents.send('updateKeyMappings', defaultKeys);
      this.overlayWindow.webContents.send('updateKeyPositions', defaultPositions);
      this.overlayWindow.webContents.send('updateBackgroundColor', defaultColor);
      
      e.reply('updateKeyMappings', defaultKeys);
      e.reply('updateKeyPositions', defaultPositions);
      e.reply('updateBackgroundColor', defaultColor);
    });
  }

  createWindows() {
    const mainWindowInstance = new MainWindow()
    const overlayWindowInstance = new OverlayWindow()

    this.mainWindow = mainWindowInstance.create()
    this.overlayWindow = overlayWindowInstance.create()

    this.mainWindow.on('closed', () => {
      mainWindowInstance.cleanup()
      if (!this.overlayWindow.isDestroyed()) {
        this.overlayWindow.close()
      }
    })

    keyboardService.setOverlayWindow(this.overlayWindow)
    keyboardService.startListening()
  }

  handleWindowsClosed() {
    keyboardService.stopListening()
    app.quit()
  }
}

new Application().init()