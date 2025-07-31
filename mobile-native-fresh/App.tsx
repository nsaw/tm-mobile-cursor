import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList, ScrollView, Image, Switch } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

// Dual-mount system: Check environment variable to determine which app to load
const USE_NEXTGEN = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
console.log('[DUAL-MOUNT] Environment check:', {
  EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN,
  USE_NEXTGEN: USE_NEXTGEN,
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT
});

// Temporary hardcode for testing
const FORCE_NEXTGEN = true;

// Mock Auth Context to bypass Firebase
const MockAuthContext = React.createContext({
  isAuthenticated: false,
  loading: false,
  user: null
});

// Mock Navigation Context to bypass AppNavigator
const MockNavigationContext = React.createContext({
  currentScreen: 'home',
  navigate: (screen: string) => {},
  screens: ['home', 'search', 'content', 'profile', 'settings']
});

// Inline VisualRoot component for testing
const VisualRoot = () => {
  useEffect(() => {
    console.log('[VISUAL] Root rendered successfully');
  }, []);

  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: 100, 
      backgroundColor: '#181818',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <Text style={{ color: '#E0E0E0', fontSize: 16 }}>[VISUAL] App UI mounted with theme</Text>
    </View>
  );
};

// Mock ProfileScreen Component
function MockProfileScreen() {
  const themeContext = useTheme();
  const tokens = themeContext?.tokens;
  const [profile, setProfile] = useState({
    name: 'Mock User',
    email: 'mock@example.com',
    avatar: '👤',
    bio: 'React Native developer focused on memory optimization',
    stats: {
      posts: 42,
      followers: 1234,
      following: 567
    }
  });

  const handleEditProfile = () => {
    console.log('[PROFILE] Edit profile pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens?.colors?.background || 'black' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ 
            color: tokens?.colors?.text || 'white', 
            fontSize: 24, 
            marginBottom: 20 
          }}>
            👤 Profile
          </Text>
          
          {/* Profile Header */}
          <View style={{ 
            alignItems: 'center', 
            marginBottom: 30,
            padding: 20,
            backgroundColor: tokens?.colors?.surface || '#333',
            borderRadius: 12
          }}>
            <Text style={{ fontSize: 64, marginBottom: 15 }}>
              {profile.avatar}
            </Text>
            <Text style={{ 
              color: tokens?.colors?.text || 'white', 
              fontSize: 24, 
              fontWeight: 'bold',
              marginBottom: 5
            }}>
              {profile.name}
            </Text>
            <Text style={{ 
              color: tokens?.colors?.textSecondary || '#888', 
              fontSize: 16,
              marginBottom: 10
            }}>
              {profile.email}
            </Text>
            <Text style={{ 
              color: tokens?.colors?.text || 'white', 
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 20
            }}>
              {profile.bio}
            </Text>
            
            <TouchableOpacity
              onPress={handleEditProfile}
              style={{
                backgroundColor: tokens?.colors?.accent || '#007AFF',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around',
            marginBottom: 30,
            padding: 20,
            backgroundColor: tokens?.colors?.surface || '#333',
            borderRadius: 12
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                color: tokens?.colors?.text || 'white', 
                fontSize: 24, 
                fontWeight: 'bold' 
              }}>
                {profile.stats.posts}
              </Text>
              <Text style={{ 
                color: tokens?.colors?.textSecondary || '#888', 
                fontSize: 14 
              }}>
                Posts
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                color: tokens?.colors?.text || 'white', 
                fontSize: 24, 
                fontWeight: 'bold' 
              }}>
                {profile.stats.followers}
              </Text>
              <Text style={{ 
                color: tokens?.colors?.textSecondary || '#888', 
                fontSize: 14 
              }}>
                Followers
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ 
                color: tokens?.colors?.text || 'white', 
                fontSize: 24, 
                fontWeight: 'bold' 
              }}>
                {profile.stats.following}
              </Text>
              <Text style={{ 
                color: tokens?.colors?.textSecondary || '#888', 
                fontSize: 14 
              }}>
                Following
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Mock SettingsScreen Component
function MockSettingsScreen() {
  const themeContext = useTheme();
  const tokens = themeContext?.tokens;
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoSave: false,
    dataSync: true
  });

  const handleSettingToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    console.log('[SETTINGS] Toggled:', key);
  };

  const settingsItems = [
    { key: 'notifications', label: 'Push Notifications', icon: '🔔' },
    { key: 'darkMode', label: 'Dark Mode', icon: '🌙' },
    { key: 'autoSave', label: 'Auto Save', icon: '💾' },
    { key: 'dataSync', label: 'Data Sync', icon: '☁️' }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens?.colors?.background || 'black' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ 
            color: tokens?.colors?.text || 'white', 
            fontSize: 24, 
            marginBottom: 20 
          }}>
            ⚙️ Settings
          </Text>
          
          {/* Settings List */}
          {settingsItems.map((item) => (
            <View
              key={item.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                marginBottom: 10,
                backgroundColor: tokens?.colors?.surface || '#333',
                borderRadius: 12
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginRight: 15 }}>
                  {item.icon}
                </Text>
                <Text style={{ 
                  color: tokens?.colors?.text || 'white', 
                  fontSize: 16 
                }}>
                  {item.label}
                </Text>
              </View>
              
              <Switch
                value={settings[item.key as keyof typeof settings] as boolean}
                onValueChange={() => handleSettingToggle(item.key)}
                trackColor={{ 
                  false: tokens?.colors?.border || '#555', 
                  true: tokens?.colors?.accent || '#007AFF' 
                }}
                thumbColor={settings[item.key as keyof typeof settings] ? 'white' : '#f4f3f4'}
              />
            </View>
          ))}

          {/* Additional Settings */}
          <View style={{ 
            marginTop: 30,
            padding: 20,
            backgroundColor: tokens?.colors?.surface || '#333',
            borderRadius: 12
          }}>
            <Text style={{ 
              color: tokens?.colors?.text || 'white', 
              fontSize: 18, 
              fontWeight: 'bold',
              marginBottom: 15
            }}>
              App Information
            </Text>
            <Text style={{ 
              color: tokens?.colors?.textSecondary || '#888', 
              fontSize: 14,
              marginBottom: 5
            }}>
              Version: 1.4.534 (Mock)
            </Text>
            <Text style={{ 
              color: tokens?.colors?.textSecondary || '#888', 
              fontSize: 14,
              marginBottom: 5
            }}>
              Build: Phase 7 - Final Integration
            </Text>
            <Text style={{ 
              color: tokens?.colors?.textSecondary || '#888', 
              fontSize: 14
            }}>
              Status: Memory Safe ✅
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Mock ContentScreen Component
function MockContentScreen() {
  const themeContext = useTheme();
  const tokens = themeContext?.tokens;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState([
    { 
      id: 1, 
      title: 'React Native Memory Optimization', 
      category: 'development',
      description: 'Best practices for preventing OOM crashes in React Native apps',
      image: '📱'
    },
    { 
      id: 2, 
      title: 'Expo Development Guide', 
      category: 'tutorial',
      description: 'Complete guide to building apps with Expo and React Native',
      image: '🚀'
    },
    { 
      id: 3, 
      title: 'Firebase Integration Tips', 
      category: 'backend',
      description: 'How to properly integrate Firebase without memory leaks',
      image: '🔥'
    },
    { 
      id: 4, 
      title: 'Theme System Design', 
      category: 'design',
      description: 'Building scalable theme systems for mobile applications',
      image: '🎨'
    }
  ]);

  const categories = ['all', 'development', 'tutorial', 'backend', 'design'];
  
  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    console.log('[CONTENT] Category selected:', category);
  };

  const handleContentPress = (item: any) => {
    console.log('[CONTENT] Content pressed:', item.title);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens?.colors?.background || 'black' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ 
            color: tokens?.colors?.text || 'white', 
            fontSize: 24, 
            marginBottom: 20 
          }}>
            📚 Content Library
          </Text>
          
          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategorySelect(category)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginRight: 10,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === category 
                    ? (tokens?.colors?.accent || '#007AFF') 
                    : (tokens?.colors?.surface || '#333')
                }}
              >
                <Text style={{ 
                  color: selectedCategory === category ? 'white' : (tokens?.colors?.text || 'white'),
                  fontWeight: selectedCategory === category ? 'bold' : 'normal'
                }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Content List */}
          {filteredContent.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleContentPress(item)}
              style={{
                backgroundColor: tokens?.colors?.surface || '#333',
                padding: 20,
                marginBottom: 15,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 32, marginRight: 15 }}>
                {item.image}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  color: tokens?.colors?.text || 'white', 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  marginBottom: 5
                }}>
                  {item.title}
                </Text>
                <Text style={{ 
                  color: tokens?.colors?.textSecondary || '#888', 
                  fontSize: 14 
                }}>
                  {item.description}
                </Text>
                <Text style={{ 
                  color: tokens?.colors?.accent || '#007AFF', 
                  fontSize: 12, 
                  marginTop: 5,
                  textTransform: 'uppercase'
                }}>
                  {item.category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Mock SearchScreen Component
function MockSearchScreen() {
  const themeContext = useTheme();
  const tokens = themeContext?.tokens;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([
    { id: 1, label: 'React Native' },
    { id: 2, label: 'Expo Development' },
    { id: 3, label: 'Memory Optimization' }
  ]);

  const handleSearch = (text: string) => {
    setQuery(text);
    // Mock search logic
    console.log('[SEARCH] Query:', text);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens?.colors?.background || 'black' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ 
          color: tokens?.colors?.text || 'white', 
          fontSize: 24, 
          marginBottom: 20 
        }}>
          🔍 Search
        </Text>
        
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search for content..."
          placeholderTextColor={tokens?.colors?.textSecondary || '#888'}
          style={{
            backgroundColor: tokens?.colors?.surface || '#333',
            color: tokens?.colors?.text || 'white',
            padding: 15,
            borderRadius: 8,
            fontSize: 16,
            marginBottom: 20
          }}
        />

        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: tokens?.colors?.surface || '#333',
                marginBottom: 10,
                borderRadius: 8
              }}
            >
              <Text style={{ color: tokens?.colors?.text || 'white' }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    // Simulate auth check without Firebase
    const timer = setTimeout(() => {
      setLoading(false);
      setAuthenticated(false); // Mock unauthenticated state
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <MockAuthContext.Provider value={{ isAuthenticated, loading, user: null }}>
      {children}
    </MockAuthContext.Provider>
  );
}

function MockNavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  const navigate = (screen: string) => {
    console.log('[NAV] Navigating to:', screen);
    setCurrentScreen(screen);
  };

  return (
    <MockNavigationContext.Provider value={{ 
      currentScreen, 
      navigate, 
      screens: ['home', 'search', 'content', 'profile', 'settings'] 
    }}>
      {children}
    </MockNavigationContext.Provider>
  );
}

function MockAppContent() {
  const themeContext = useTheme();
  const tokens = themeContext?.tokens;
  
  return (
    <MockNavigationProvider>
      <MockNavigationContext.Consumer>
        {({ currentScreen, navigate, screens }) => (
          <SafeAreaView style={{ flex: 1, backgroundColor: tokens?.colors?.background || 'black' }}>
            {/* Navigation Bar */}
            <View style={{ 
              flexDirection: 'row', 
              padding: 20, 
              backgroundColor: tokens?.colors?.surface || '#333',
              borderBottomWidth: 1,
              borderBottomColor: tokens?.colors?.border || '#555'
            }}>
              {screens.map((screen) => (
                <TouchableOpacity
                  key={screen}
                  onPress={() => navigate(screen)}
                  style={{
                    flex: 1,
                    padding: 10,
                    marginHorizontal: 5,
                    borderRadius: 8,
                    backgroundColor: currentScreen === screen ? 
                      (tokens?.colors?.accent || '#007AFF') : 'transparent',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: currentScreen === screen ? 'white' : (tokens?.colors?.text || 'white'),
                    fontWeight: currentScreen === screen ? 'bold' : 'normal',
                    fontSize: 12
                  }}>
                    {screen.charAt(0).toUpperCase() + screen.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Screen Content */}
            <View style={{ flex: 1 }}>
              {currentScreen === 'home' && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: tokens?.colors?.text || 'white', fontSize: 24 }}>
                    🏠 Home Screen
                  </Text>
                  <Text style={{ color: tokens?.colors?.textSecondary || '#888', marginTop: 10 }}>
                    Welcome to the mock app
                  </Text>
                </View>
              )}
              
              {currentScreen === 'search' && <MockSearchScreen />}
              
              {currentScreen === 'content' && <MockContentScreen />}
              
              {currentScreen === 'profile' && <MockProfileScreen />}
              
              {currentScreen === 'settings' && <MockSettingsScreen />}
            </View>
          </SafeAreaView>
        )}
      </MockNavigationContext.Consumer>
    </MockNavigationProvider>
  );
}

export default function App() {
  console.log('[APP] 🚀 App function executed - THIS SHOULD APPEAR');
  console.log('[APP] USE_NEXTGEN:', USE_NEXTGEN);
  
  // Dual-mount system: Load NextGen app if environment variable is set
  if (USE_NEXTGEN || FORCE_NEXTGEN) {
    console.log('[APP] Loading NextGen app...');
    try {
      // Try dynamic import first
      const NextGenApp = require('./src-nextgen/App').default;
      console.log('[APP] NextGen app loaded successfully');
      console.log('[APP] NextGenApp type:', typeof NextGenApp);
      return <NextGenApp />;
    } catch (error) {
      console.error('[APP] Failed to load NextGen app:', error);
      console.error('[APP] Error details:', error.message);
      console.log('[APP] Falling back to mock app...');
    }
  } else {
    console.log('[APP] USE_NEXTGEN is false, loading mock app...');
  }
  
  // Mock app logic
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  console.log('[APP] Loading mock app...');

  if (!show) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <Text style={{ color: 'yellow' }}>[BOOT] Phase 7 startup...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemeProvider>
      <MockAuthProvider>
        <VisualRoot />
        <MockAppContent />
      </MockAuthProvider>
    </ThemeProvider>
  );
}
