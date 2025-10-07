// Custom Jest setup for React Native testing

// Define global variables that React Native expects
global.__DEV__ = true;

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock expo modules
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const MockIcon = ({ name, ...props }) => React.createElement('div', { ...props, 'data-testid': `icon-${name}` });
  
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
    AntDesign: MockIcon,
  };
});

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock React Native with a simplified version for testing
jest.mock('react-native', () => {
  const React = require('react');
  
  // Mock all React Native components
  const MockComponent = ({ children, ...props }) => React.createElement('div', props, children);
  
  // Mock Ionicons specifically
  const MockIonicons = ({ name, ...props }) => React.createElement('div', { ...props, 'data-testid': `icon-${name}` });
  
  return {
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
      absoluteFill: {},
      absoluteFillObject: {},
      hairlineWidth: 1,
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
    Alert: {
      alert: jest.fn(),
    },
    TouchableOpacity: MockComponent,
    View: MockComponent,
    Text: MockComponent,
    Image: MockComponent,
    ScrollView: MockComponent,
    FlatList: MockComponent,
    SectionList: MockComponent,
    Animated: {
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
    },
    PanResponder: {
      create: jest.fn(() => ({
        panHandlers: {},
      })),
    },
    StatusBar: {
      setBarStyle: jest.fn(),
      setBackgroundColor: jest.fn(),
      setHidden: jest.fn(),
      setNetworkActivityIndicatorVisible: jest.fn(),
      setTranslucent: jest.fn(),
    },
    AppRegistry: {
      registerComponent: jest.fn(),
      runApplication: jest.fn(),
      unmountApplicationComponentAtRootTag: jest.fn(),
    },
    DeviceInfo: {
      getModel: jest.fn(() => 'iPhone'),
      getVersion: jest.fn(() => '1.0.0'),
      getBuildNumber: jest.fn(() => '1'),
      getBundleId: jest.fn(() => 'com.example.app'),
      getSystemName: jest.fn(() => 'iOS'),
      getSystemVersion: jest.fn(() => '14.0'),
      isTablet: jest.fn(() => false),
      hasNotch: jest.fn(() => false),
    },
    Linking: {
      openURL: jest.fn(),
      canOpenURL: jest.fn(),
      getInitialURL: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    NetInfo: {
      fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    AsyncStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      getAllKeys: jest.fn(),
      multiGet: jest.fn(),
      multiSet: jest.fn(),
      multiRemove: jest.fn(),
    },
    PermissionsAndroid: {
      request: jest.fn(),
      check: jest.fn(),
      requestMultiple: jest.fn(),
      PERMISSIONS: {},
      RESULTS: {},
    },
    BackHandler: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      exitApp: jest.fn(),
    },
    Clipboard: {
      getString: jest.fn(),
      setString: jest.fn(),
    },
    Share: {
      share: jest.fn(),
    },
    Vibration: {
      vibrate: jest.fn(),
      cancel: jest.fn(),
    },
    Keyboard: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dismiss: jest.fn(),
    },
    LayoutAnimation: {
      configureNext: jest.fn(),
      create: jest.fn(),
      Types: {},
      Properties: {},
      Presets: {},
    },
    InteractionManager: {
      runAfterInteractions: jest.fn(),
      createInteractionHandle: jest.fn(),
      clearInteractionHandle: jest.fn(),
    },
    PixelRatio: {
      get: jest.fn(() => 2),
      getFontScale: jest.fn(() => 1),
      getPixelSizeForLayoutSize: jest.fn((size) => size * 2),
      roundToNearestPixel: jest.fn((size) => size),
    },
    Easing: {
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
    },
    I18nManager: {
      isRTL: false,
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
      swapLeftAndRightInRTL: jest.fn(),
    },
    AccessibilityInfo: {
      isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
      isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setAccessibilityFocus: jest.fn(),
      announceForAccessibility: jest.fn(),
    },
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    NativeModules: {
      UIManager: {
        getViewManagerConfig: jest.fn(),
        hasConstants: jest.fn(),
      },
    },
  };
});