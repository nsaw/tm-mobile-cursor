module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/mobile-native-fresh.app',
      build: 'xcodebuild -workspace ios/mobile-native-fresh.xcworkspace -scheme mobile-native-fresh -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 15 Pro'
      }
    },
    'ios.sim.release': {
      type: 'ios.simulator',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/mobile-native-fresh.app',
      build: 'xcodebuild -workspace ios/mobile-native-fresh.xcworkspace -scheme mobile-native-fresh -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      device: {
        type: 'iPhone 15 Pro'
      }
    }
  }
}; 