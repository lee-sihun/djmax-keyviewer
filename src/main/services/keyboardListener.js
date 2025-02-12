const { GlobalKeyboardListener } = require('node-global-key-listener')
const { loadKeys, saveKeys } = require('./keyMappings')

// name: e.name,           // 키 이름
// state: e.state,         // 상태 (UP/DOWN)
// rawKey: e.rawKey,       // raw 키코드
// vKey: e.vKey,          // 가상 키코드
// scanCode: e.scanCode,   // 스캔 코드
// modifiers: e.modifiers  // 수정자 키

class KeyboardService {
  constructor() {
    this.listener = new GlobalKeyboardListener();
    this.overlayWindow = null;
    this.keys = loadKeys();
    this.currentMode = '4key'; // 기본 모드
  }

  setOverlayWindow(window) {
    this.overlayWindow = window;
  }

  startListening() {
    this.listener.addListener(this.handleKeyPress.bind(this));
  }

  stopListening() {
    this.listener.kill();
  }

  setKeyMode(mode) {
    if (this.keys[mode]) {
      this.currentMode = mode;
      return true;
    }
    return false;
  }

  getCurrentMode() {
    return this.currentMode;
  }

  handleKeyPress(e) {
    let key = e.name || e.vKey.toString();
    const state = e.state;

    if (!this.isValidKey(key)) {
      return;
    }

    this.sendKeyStateToOverlay(key, state);
  }

  isValidKey(key) {
    return this.keys[this.currentMode].includes(key);
  }

  updateKeyMapping(keys) {
    this.keys = keys;
    saveKeys(keys);
  }

  getKeyMappings() {
    return this.keys;
  }

  sendKeyStateToOverlay(key, state) {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.webContents.send('keyState', {
        key,
        state,
        mode: this.currentMode
      });
    }
  }
}

module.exports = new KeyboardService();