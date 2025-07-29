// Disable Expo Winter runtime for Jest tests
process.env.EXPO_USE_WINTER_RUNTIME = 'false';
process.env.EXPO_USE_WINTER_RUNTIME_NATIVE = 'false';

// Define React Native globals
global.__DEV__ = true;
global.__METRO_GLOBAL_PREFIX__ = '';

// Mock React Navigation FIRST (before other mocks)
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
  TransitionPresets: {
    defaultTransition: {},
    slideFromRightIOS: {},
    slideFromBottomIOS: {},
  },
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock NavigationProvider to avoid complex initialization issues
jest.mock('./src-nextgen/navigation/NavigationProvider', () => ({
  NavigationProvider: ({ children }) => children,
}));

// Mock ThemeProvider to avoid complex initialization issues
jest.mock('./src-nextgen/theme/ThemeProvider', () => ({
  ThemeProvider: ({ children }) => children,
}));

// Mock AccessibilityProvider to avoid complex initialization issues
jest.mock('./src-nextgen/accessibility/AccessibilityProvider', () => ({
  AccessibilityProvider: ({ children }) => children,
}));

// Mock expo-modules-core to avoid Winter runtime issues
jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(),
  NativeModule: jest.fn(),
  SharedObject: jest.fn(),
  SharedRef: jest.fn(),
}));

// Mock React Native components and modules
jest.mock('react-native', () => {
  const React = require('react');
  
  // Mock AccessibilityInfo with comprehensive functionality
  const mockAddEventListener = jest.fn(() => ({ remove: jest.fn() }));
  
  return {
    View: ({ children, ...props }) => React.createElement('View', props, children),
    Text: ({ children, ...props }) => React.createElement('Text', props, children),
    TouchableOpacity: ({ children, onPress, ...props }) => 
      React.createElement('TouchableOpacity', { ...props, onPress }, children),
    TouchableHighlight: ({ children, onPress, ...props }) => 
      React.createElement('TouchableHighlight', { ...props, onPress }, children),
    TouchableWithoutFeedback: ({ children, onPress, ...props }) => 
      React.createElement('TouchableWithoutFeedback', { ...props, onPress }, children),
    ScrollView: ({ children, ...props }) => React.createElement('ScrollView', props, children),
    FlatList: ({ data, renderItem, ...props }) => React.createElement('FlatList', { ...props, data, renderItem }),
    Image: ({ source, ...props }) => React.createElement('Image', { ...props, source }),
    TextInput: ({ value, onChangeText, ...props }) => 
      React.createElement('TextInput', { ...props, value, onChangeText }),
    Switch: ({ value, onValueChange, ...props }) => 
      React.createElement('Switch', { ...props, value, onValueChange }),
    Modal: ({ children, visible, ...props }) => 
      React.createElement('Modal', { ...props, visible }, children),
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    StatusBar: {
      setBarStyle: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
      hairlineWidth: 1,
      absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    },
    AccessibilityInfo: {
      isHighContrastEnabled: jest.fn().mockResolvedValue(false),
      isHighTextContrastEnabled: jest.fn().mockResolvedValue(false),
      isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
      isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
      isReduceTransparencyEnabled: jest.fn().mockResolvedValue(false),
      isInvertColorsEnabled: jest.fn().mockResolvedValue(false),
      isBoldTextEnabled: jest.fn().mockResolvedValue(false),
      isGrayscaleEnabled: jest.fn().mockResolvedValue(false),
      isLargeTextEnabled: jest.fn().mockResolvedValue(false),
      announceForAccessibility: jest.fn(),
      setAccessibilityFocus: jest.fn(),
      getRecommendedTimeoutMillis: jest.fn().mockResolvedValue(5000),
      getRecommendedTimeoutMillisSync: jest.fn().mockReturnValue(5000),
      shouldShowAccessibilityMenu: jest.fn().mockReturnValue(false),
      addEventListener: mockAddEventListener,
    },
    __DEV__: true,
  };
});

// Mock @testing-library/jest-native to avoid React Native dependencies
jest.mock('@testing-library/jest-native/extend-expect', () => ({}), { virtual: true });

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-splash-screen');
jest.mock('expo-status-bar');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock Expo AV
jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Recording: {
      createAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
    },
  },
}));

// Mock Expo Speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(),
}));

// Mock React Native Voice
jest.mock('@react-native-voice/voice', () => ({
  Voice: {
    onSpeechStart: jest.fn(),
    onSpeechEnd: jest.fn(),
    onSpeechResults: jest.fn(),
    onSpeechError: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = 'View';
  const Text = 'Text';
  const TouchableOpacity = 'TouchableOpacity';
  
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: jest.fn((component) => component),
    Swipeable: View,
    DrawerLayout: View,
    TouchableHighlight: TouchableOpacity,
    TouchableNativeFeedback: TouchableOpacity,
    TouchableOpacity: TouchableOpacity,
    TouchableWithoutFeedback: TouchableOpacity,
  };
});

// Mock React Native Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');

// Mock Lucide React Native
jest.mock('lucide-react-native', () => ({
  Brain: 'Brain',
  Mic: 'Mic',
  Search: 'Search',
  Plus: 'Plus',
  X: 'X',
  Edit: 'Edit',
  Trash: 'Trash',
  Pin: 'Pin',
  Unpin: 'Unpin',
  Check: 'Check',
  Clock: 'Clock',
  Tag: 'Tag',
  Folder: 'Folder',
  Settings: 'Settings',
  User: 'User',
  LogOut: 'LogOut',
  HelpCircle: 'HelpCircle',
  Info: 'Info',
  Shield: 'Shield',
  Lock: 'Lock',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Mail: 'Mail',
  Phone: 'Phone',
  Globe: 'Globe',
  Download: 'Download',
  Upload: 'Upload',
  Share: 'Share',
  Star: 'Star',
  Heart: 'Heart',
  ThumbsUp: 'ThumbsUp',
  ThumbsDown: 'ThumbsDown',
  MessageCircle: 'MessageCircle',
  Send: 'Send',
  Camera: 'Camera',
  Image: 'Image',
  Video: 'Video',
  Music: 'Music',
  File: 'File',
  FolderPlus: 'FolderPlus',
  FolderOpen: 'FolderOpen',
  Archive: 'Archive',
  Calendar: 'Calendar',
  Clock: 'Clock',
  MapPin: 'MapPin',
  Navigation: 'Navigation',
  Compass: 'Compass',
  Globe: 'Globe',
  Wifi: 'Wifi',
  WifiOff: 'WifiOff',
  Battery: 'Battery',
  BatteryCharging: 'BatteryCharging',
  Volume: 'Volume',
  VolumeX: 'VolumeX',
  Volume1: 'Volume1',
  Volume2: 'Volume2',
  Brightness: 'Brightness',
  Moon: 'Moon',
  Sun: 'Sun',
  Cloud: 'Cloud',
  CloudRain: 'CloudRain',
  CloudSnow: 'CloudSnow',
  Wind: 'Wind',
  Zap: 'Zap',
  Umbrella: 'Umbrella',
  Droplets: 'Droplets',
  Thermometer: 'Thermometer',
  Gauge: 'Gauge',
  Activity: 'Activity',
  TrendingUp: 'TrendingUp',
  TrendingDown: 'TrendingDown',
  BarChart: 'BarChart',
  BarChart3: 'BarChart3',
  PieChart: 'PieChart',
  LineChart: 'LineChart',
  DollarSign: 'DollarSign',
  CreditCard: 'CreditCard',
  Wallet: 'Wallet',
  ShoppingCart: 'ShoppingCart',
  ShoppingBag: 'ShoppingBag',
  Gift: 'Gift',
  Award: 'Award',
  Trophy: 'Trophy',
  Medal: 'Medal',
  Flag: 'Flag',
  Target: 'Target',
  Crosshair: 'Crosshair',
  Zap: 'Zap',
  Sparkles: 'Sparkles',
  Palette: 'Palette',
  Brush: 'Brush',
  PenTool: 'PenTool',
  Type: 'Type',
  Bold: 'Bold',
  Italic: 'Italic',
  Underline: 'Underline',
  Strikethrough: 'Strikethrough',
  AlignLeft: 'AlignLeft',
  AlignCenter: 'AlignCenter',
  AlignRight: 'AlignRight',
  AlignJustify: 'AlignJustify',
  List: 'List',
  ListOrdered: 'ListOrdered',
  Quote: 'Quote',
  Code: 'Code',
  Terminal: 'Terminal',
  Database: 'Database',
  Server: 'Server',
  Cpu: 'Cpu',
  HardDrive: 'HardDrive',
  MemoryStick: 'MemoryStick',
  Monitor: 'Monitor',
  Smartphone: 'Smartphone',
  Tablet: 'Tablet',
  Watch: 'Watch',
  Headphones: 'Headphones',
  Speaker: 'Speaker',
  Printer: 'Printer',
  Scanner: 'Scanner',
  Keyboard: 'Keyboard',
  Mouse: 'Mouse',
  Gamepad2: 'Gamepad2',
  Controller: 'Controller',
  Joystick: 'Joystick',
  Dice: 'Dice',
  Puzzle: 'Puzzle',
  Chess: 'Chess',
  Cards: 'Cards',
  Crown: 'Crown',
  Zap: 'Zap',
  Sparkles: 'Sparkles',
  Palette: 'Palette',
  Brush: 'Brush',
  PenTool: 'PenTool',
  Type: 'Type',
  Bold: 'Bold',
  Italic: 'Italic',
  Underline: 'Underline',
  Strikethrough: 'Strikethrough',
  AlignLeft: 'AlignLeft',
  AlignCenter: 'AlignCenter',
  AlignRight: 'AlignRight',
  AlignJustify: 'AlignJustify',
  List: 'List',
  ListOrdered: 'ListOrdered',
  Quote: 'Quote',
  Code: 'Code',
  Terminal: 'Terminal',
  Database: 'Database',
  Server: 'Server',
  Cpu: 'Cpu',
  HardDrive: 'HardDrive',
  MemoryStick: 'MemoryStick',
  Monitor: 'Monitor',
  Smartphone: 'Smartphone',
  Tablet: 'Tablet',
  Watch: 'Watch',
  Headphones: 'Headphones',
  Speaker: 'Speaker',
  Printer: 'Printer',
  Scanner: 'Scanner',
  Keyboard: 'Keyboard',
  Mouse: 'Mouse',
  Gamepad2: 'Gamepad2',
  Controller: 'Controller',
  Joystick: 'Joystick',
  Dice: 'Dice',
  Puzzle: 'Puzzle',
  Chess: 'Chess',
  Cards: 'Cards',
  Crown: 'Crown',
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 