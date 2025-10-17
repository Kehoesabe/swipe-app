// Mock React Native for testing
import React from 'react';

// Mock all React Native components
const MockComponent = ({ children, ...props }) => React.createElement('div', props, children);

// Mock StyleSheet
const StyleSheet = {
  create: jest.fn((styles) => styles),
  flatten: jest.fn((style) => style),
  absoluteFill: {},
  absoluteFillObject: {},
  hairlineWidth: 1,
};

// Mock Dimensions
const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 667 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock Platform
const Platform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
};

// Mock Alert
const Alert = {
  alert: jest.fn(),
};

// Mock ImagePicker
const ImagePicker = {
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
};

// Mock TouchableOpacity
const TouchableOpacity = MockComponent;

// Mock View
const View = MockComponent;

// Mock Text
const Text = MockComponent;

// Mock Image
const Image = MockComponent;

// Mock ScrollView
const ScrollView = MockComponent;

// Mock FlatList
const FlatList = MockComponent;

// Mock SectionList
const SectionList = MockComponent;

// Mock Animated
const Animated = {
  View: MockComponent,
  Text: MockComponent,
  Image: MockComponent,
  ScrollView: MockComponent,
  FlatList: MockComponent,
  SectionList: MockComponent,
  Value: jest.fn(() => ({
    _value: 0,
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  ValueXY: jest.fn(() => ({
    x: { _value: 0, setValue: jest.fn(), addListener: jest.fn(), removeListener: jest.fn() },
    y: { _value: 0, setValue: jest.fn(), addListener: jest.fn(), removeListener: jest.fn() },
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  timing: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  spring: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  decay: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  sequence: jest.fn(),
  parallel: jest.fn(),
  stagger: jest.fn(),
  loop: jest.fn(),
  event: jest.fn(),
  createAnimatedComponent: jest.fn((component) => component),
  attachNativeEvent: jest.fn(),
  detachNativeEvent: jest.fn(),
  forkEvent: jest.fn(),
  unforkEvent: jest.fn(),
  Event: jest.fn(),
};

// Mock PanResponder
const PanResponder = {
  create: jest.fn(() => ({
    panHandlers: {},
  })),
};

// Mock StatusBar
const StatusBar = {
  setBarStyle: jest.fn(),
  setBackgroundColor: jest.fn(),
  setHidden: jest.fn(),
  setNetworkActivityIndicatorVisible: jest.fn(),
  setTranslucent: jest.fn(),
};

// Mock AppRegistry
const AppRegistry = {
  registerComponent: jest.fn(),
  runApplication: jest.fn(),
  unmountApplicationComponentAtRootTag: jest.fn(),
};

// Mock DeviceInfo
const DeviceInfo = {
  getModel: jest.fn(() => 'iPhone'),
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  getBundleId: jest.fn(() => 'com.example.app'),
  getSystemName: jest.fn(() => 'iOS'),
  getSystemVersion: jest.fn(() => '14.0'),
  isTablet: jest.fn(() => false),
  hasNotch: jest.fn(() => false),
};

// Mock Linking
const Linking = {
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock NetInfo
const NetInfo = {
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock AsyncStorage
const AsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Mock PermissionsAndroid
const PermissionsAndroid = {
  request: jest.fn(),
  check: jest.fn(),
  requestMultiple: jest.fn(),
  PERMISSIONS: {},
  RESULTS: {},
};

// Mock BackHandler
const BackHandler = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
};

// Mock Clipboard
const Clipboard = {
  getString: jest.fn(),
  setString: jest.fn(),
};

// Mock Share
const Share = {
  share: jest.fn(),
};

// Mock Vibration
const Vibration = {
  vibrate: jest.fn(),
  cancel: jest.fn(),
};

// Mock Keyboard
const Keyboard = {
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dismiss: jest.fn(),
};

// Mock LayoutAnimation
const LayoutAnimation = {
  configureNext: jest.fn(),
  create: jest.fn(),
  Types: {},
  Properties: {},
  Presets: {},
};

// Mock InteractionManager
const InteractionManager = {
  runAfterInteractions: jest.fn(),
  createInteractionHandle: jest.fn(),
  clearInteractionHandle: jest.fn(),
};

// Mock PixelRatio
const PixelRatio = {
  get: jest.fn(() => 2),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
  roundToNearestPixel: jest.fn((size) => size),
};

// Mock Easing
const Easing = {
  linear: jest.fn(),
  ease: jest.fn(),
  quad: jest.fn(),
  cubic: jest.fn(),
  poly: jest.fn(),
  sin: jest.fn(),
  circle: jest.fn(),
  exp: jest.fn(),
  elastic: jest.fn(),
  back: jest.fn(),
  bounce: jest.fn(),
  bezier: jest.fn(),
  in: jest.fn(),
  out: jest.fn(),
  inOut: jest.fn(),
};

// Mock I18nManager
const I18nManager = {
  isRTL: false,
  allowRTL: jest.fn(),
  forceRTL: jest.fn(),
  swapLeftAndRightInRTL: jest.fn(),
};

// Mock AccessibilityInfo
const AccessibilityInfo = {
  isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
  isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  setAccessibilityFocus: jest.fn(),
  announceForAccessibility: jest.fn(),
};

// Mock AppState
const AppState = {
  currentState: 'active',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock NativeModules
const NativeModules = {
  UIManager: {
    getViewManagerConfig: jest.fn(),
    hasConstants: jest.fn(),
  },
};

// Mock process
global.process = {
  env: {
    NODE_ENV: 'test',
  },
};

// Mock __fbBatchedBridgeConfig
global.__fbBatchedBridgeConfig = {};

// Export all mocks
export {
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ImagePicker,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  Animated,
  PanResponder,
  StatusBar,
  AppRegistry,
  DeviceInfo,
  Linking,
  NetInfo,
  AsyncStorage,
  PermissionsAndroid,
  BackHandler,
  Clipboard,
  Share,
  Vibration,
  Keyboard,
  LayoutAnimation,
  InteractionManager,
  PixelRatio,
  Easing,
  I18nManager,
  AccessibilityInfo,
  AppState,
  NativeModules,
};

// Default export
export default {
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ImagePicker,
  TouchableOpacity,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  Animated,
  PanResponder,
  StatusBar,
  AppRegistry,
  DeviceInfo,
  Linking,
  NetInfo,
  AsyncStorage,
  PermissionsAndroid,
  BackHandler,
  Clipboard,
  Share,
  Vibration,
  Keyboard,
  LayoutAnimation,
  InteractionManager,
  PixelRatio,
  Easing,
  I18nManager,
  AccessibilityInfo,
  AppState,
  NativeModules,
};






