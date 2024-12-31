module.exports = {
  main: {
    width: 896,
    height: 491,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    transparent: true,
    backgroundColor: 'rgba(0,0,0,0)',
    resizable: false,
    maximizable: false,
    // 투명도 최적화 
    vibrancy: 'under-window',
    visualEffectState: 'active'
  },
  overlay: {
    width: 400,
    height: 100,
    frame: false,
    transparent: true,
    backgroundColor: 'rgba(0,0,0,0)',
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  }
}