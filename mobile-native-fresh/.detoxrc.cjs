module.exports = {
  apps: {
    'mobile-native-fresh.ios': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Thoughtmarks.app'
    }
  },
  devices: {
    'simulator': {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15 Pro'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'mobile-native-fresh.ios'
    }
  }
}; 