/**
 * App Creation Engine
 * Generates complete applications across multiple platforms
 */

const fs = require('fs').promises;
const path = require('path');

class AppCreationEngine {
  constructor() {
    this.templates = new Map();
    this.components = new Map();
    this.frameworks = ['react', 'vue', 'angular', 'flutter', 'native'];
  }
  
  async execute(toolId, params) {
    console.log(`[APP-ENGINE] Executing ${toolId}`);
    
    const [, , platform] = toolId.split('.');
    
    switch (platform) {
      case 'flutter':
        return this.createFlutterApp(params);
      case 'react':
        return this.createReactApp(params);
      case 'vue':
        return this.createVueApp(params);
      case 'native':
        return this.createNativeApp(params);
      case 'electron':
        return this.createElectronApp(params);
      case 'pwa':
        return this.createPWA(params);
      case 'game':
        return this.createGame(params);
      default:
        throw new Error(`Unknown app platform: ${platform}`);
    }
  }
  
  async executeTask({ task, dependencies, library }) {
    console.log(`[APP-ENGINE] Executing task: ${task.name}`);
    
    switch (task.name) {
      case 'frontend-structure':
        return this.createFrontendStructure(task.params, dependencies);
      case 'frontend-backend-integration':
        return this.integrateFullStack(task.params, dependencies);
      default:
        return this.genericTaskExecution(task, dependencies);
    }
  }
  
  async createFlutterApp(params) {
    const { name, description, features = [], platforms = ['ios', 'android'] } = params;
    
    const structure = {
      'lib/': {
        'main.dart': this.generateFlutterMain(name),
        'app.dart': this.generateFlutterApp(name, features),
        'screens/': this.generateFlutterScreens(features),
        'widgets/': this.generateFlutterWidgets(features),
        'models/': this.generateFlutterModels(features),
        'services/': this.generateFlutterServices(features),
        'utils/': {
          'constants.dart': this.generateConstants(name),
          'theme.dart': this.generateFlutterTheme(params.designSystem)
        }
      },
      'test/': {
        'widget_test.dart': this.generateFlutterTests(name)
      },
      'pubspec.yaml': this.generatePubspec(name, description, features),
      'README.md': this.generateReadme(name, description, 'flutter')
    };
    
    return {
      type: 'flutter-app',
      name,
      structure,
      files: this.flattenStructure(structure),
      commands: {
        setup: 'flutter pub get',
        run: 'flutter run',
        build: platforms.map(p => `flutter build ${p}`)
      }
    };
  }
  
  async createReactApp(params) {
    const { name, type = 'spa', features = [], backend = true } = params;
    
    const structure = {
      'src/': {
        'App.tsx': this.generateReactApp(name, features),
        'index.tsx': this.generateReactIndex(name),
        'components/': this.generateReactComponents(features),
        'pages/': this.generateReactPages(features),
        'hooks/': this.generateReactHooks(features),
        'services/': backend ? this.generateReactServices(features) : {},
        'store/': this.generateReactStore(features),
        'styles/': {
          'globals.css': this.generateGlobalStyles(),
          'variables.css': this.generateCSSVariables(params.designSystem)
        }
      },
      'public/': {
        'index.html': this.generateHTML(name)
      },
      'package.json': this.generatePackageJson(name, 'react', features),
      'tsconfig.json': this.generateTsConfig('react'),
      'vite.config.ts': type === 'spa' ? this.generateViteConfig() : null,
      'next.config.js': type === 'ssr' ? this.generateNextConfig() : null
    };
    
    return {
      type: 'react-app',
      name,
      structure,
      files: this.flattenStructure(structure),
      commands: {
        setup: 'npm install',
        dev: 'npm run dev',
        build: 'npm run build'
      }
    };
  }
  
  async createVueApp(params) {
    const { name, ssr = true, features = [] } = params;
    
    const structure = {
      'src/': ssr ? {} : {
        'App.vue': this.generateVueApp(name, features),
        'main.ts': this.generateVueMain(),
        'components/': this.generateVueComponents(features),
        'views/': this.generateVueViews(features),
        'stores/': this.generateVueStores(features),
        'composables/': this.generateVueComposables(features)
      },
      'pages/': ssr ? this.generateNuxtPages(features) : {},
      'components/': ssr ? this.generateNuxtComponents(features) : {},
      'nuxt.config.ts': ssr ? this.generateNuxtConfig(name) : null,
      'package.json': this.generatePackageJson(name, ssr ? 'nuxt' : 'vue', features)
    };
    
    return {
      type: 'vue-app',
      name,
      structure,
      files: this.flattenStructure(structure),
      commands: {
        setup: 'npm install',
        dev: ssr ? 'npm run dev' : 'npm run serve',
        build: 'npm run build'
      }
    };
  }
  
  async createNativeApp(params) {
    const { name, platform, language = 'swift' } = params;
    
    if (platform === 'ios') {
      return this.createIOSApp(name, language);
    } else if (platform === 'android') {
      return this.createAndroidApp(name, language === 'kotlin' ? 'kotlin' : 'java');
    }
    
    throw new Error(`Unsupported native platform: ${platform}`);
  }
  
  createIOSApp(name, language) {
    const ext = language === 'swift' ? 'swift' : 'm';
    
    return {
      type: 'ios-app',
      name,
      structure: {
        [`${name}/`]: {
          [`AppDelegate.${ext}`]: this.generateIOSAppDelegate(language),
          [`ContentView.${ext}`]: this.generateIOSContentView(language),
          'Assets.xcassets/': {},
          'Info.plist': this.generateIOSInfoPlist(name)
        },
        [`${name}.xcodeproj/`]: {}
      }
    };
  }
  
  createAndroidApp(name, language) {
    const ext = language === 'kotlin' ? 'kt' : 'java';
    
    return {
      type: 'android-app',
      name,
      structure: {
        'app/src/main/': {
          [`java/com/app/${name}/`]: {
            [`MainActivity.${ext}`]: this.generateAndroidMainActivity(language)
          },
          'res/': {
            'layout/': {
              'activity_main.xml': this.generateAndroidLayout()
            },
            'values/': {
              'strings.xml': this.generateAndroidStrings(name)
            }
          },
          'AndroidManifest.xml': this.generateAndroidManifest(name)
        },
        'build.gradle': this.generateAndroidBuildGradle()
      }
    };
  }
  
  async createElectronApp(params) {
    const { name, features = [] } = params;
    
    return {
      type: 'electron-app',
      name,
      structure: {
        'src/': {
          'main.js': this.generateElectronMain(name),
          'preload.js': this.generateElectronPreload(),
          'renderer/': {
            'index.html': this.generateHTML(name),
            'renderer.js': this.generateElectronRenderer(features)
          }
        },
        'package.json': this.generatePackageJson(name, 'electron', features)
      }
    };
  }
  
  async createPWA(params) {
    const { name, offline = true, features = [] } = params;
    
    return {
      type: 'pwa',
      name,
      structure: {
        'src/': {
          'index.html': this.generatePWAHTML(name),
          'app.js': this.generatePWAApp(features),
          'sw.js': offline ? this.generateServiceWorker(name) : null,
          'manifest.json': this.generatePWAManifest(name)
        }
      }
    };
  }
  
  async createGame(params) {
    const { name, engine = 'godot', genre } = params;
    
    if (engine === 'godot') {
      return this.createGodotGame(name, genre);
    } else if (engine === 'unity') {
      return this.createUnityGame(name, genre);
    }
    
    throw new Error(`Unsupported game engine: ${engine}`);
  }
  
  createGodotGame(name, genre) {
    return {
      type: 'godot-game',
      name,
      structure: {
        'scenes/': {
          'Main.tscn': this.generateGodotMainScene(genre),
          'Player.tscn': this.generateGodotPlayerScene(genre)
        },
        'scripts/': {
          'Main.gd': this.generateGodotMainScript(genre),
          'Player.gd': this.generateGodotPlayerScript(genre)
        },
        'assets/': {},
        'project.godot': this.generateGodotProject(name)
      }
    };
  }
  
  createUnityGame(name, genre) {
    return {
      type: 'unity-game',
      name,
      structure: {
        'Assets/': {
          'Scripts/': {
            'GameManager.cs': this.generateUnityGameManager(genre),
            'PlayerController.cs': this.generateUnityPlayerController(genre)
          },
          'Prefabs/': {},
          'Materials/': {},
          'Scenes/': {
            'MainScene.unity': {}
          }
        },
        'ProjectSettings/': {}
      }
    };
  }
  
  // Frontend structure creation
  async createFrontendStructure(params, dependencies) {
    const { framework, routes = [], layouts = [] } = params;
    const designSystem = dependencies['task-0'];
    
    return {
      framework,
      structure: {
        routes: this.generateRoutes(framework, routes),
        layouts: this.generateLayouts(framework, layouts),
        components: designSystem?.components || []
      },
      files: []
    };
  }
  
  // Full-stack integration
  async integrateFullStack(params, dependencies) {
    const frontend = dependencies['task-1'];
    const api = dependencies['task-3'];
    
    return {
      apiClient: this.generateAPIClient(api?.endpoints || []),
      stateManagement: this.generateStateManagement(frontend?.framework),
      hooks: this.generateDataHooks(api?.endpoints || [])
    };
  }
  
  // Helper methods for code generation
  generateFlutterMain(name) {
    return `import 'package:flutter/material.dart';
import 'app.dart';

void main() {
  runApp(${this.toPascalCase(name)}App());
}`;
  }
  
  generateFlutterApp(name, features) {
    return `import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

class ${this.toPascalCase(name)}App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${name}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: HomeScreen(),
    );
  }
}`;
  }
  
  generateFlutterScreens(features) {
    const screens = {
      'home_screen.dart': this.generateFlutterHomeScreen(),
      'profile_screen.dart': features.includes('auth') ? this.generateFlutterProfileScreen() : null,
      'settings_screen.dart': this.generateFlutterSettingsScreen()
    };
    
    return Object.fromEntries(
      Object.entries(screens).filter(([_, v]) => v !== null)
    );
  }
  
  generateFlutterHomeScreen() {
    return `import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      body: Center(
        child: Text(
          'Welcome to Your App!',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}`;
  }
  
  generateFlutterProfileScreen() {
    return `import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              child: Icon(Icons.person, size: 50),
            ),
            SizedBox(height: 20),
            Text('User Profile'),
          ],
        ),
      ),
    );
  }
}`;
  }
  
  generateFlutterSettingsScreen() {
    return `import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
      ),
      body: ListView(
        children: [
          ListTile(
            leading: Icon(Icons.dark_mode),
            title: Text('Dark Mode'),
            trailing: Switch(value: false, onChanged: (_) {}),
          ),
          ListTile(
            leading: Icon(Icons.notifications),
            title: Text('Notifications'),
            trailing: Switch(value: true, onChanged: (_) {}),
          ),
        ],
      ),
    );
  }
}`;
  }
  
  generateFlutterWidgets(features) {
    return {
      'custom_button.dart': this.generateFlutterCustomButton(),
      'loading_indicator.dart': this.generateFlutterLoadingIndicator()
    };
  }
  
  generateFlutterCustomButton() {
    return `import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? color;
  
  const CustomButton({
    Key? key,
    required this.text,
    required this.onPressed,
    this.color,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? Theme.of(context).primaryColor,
        padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Text(text),
    );
  }
}`;
  }
  
  generateFlutterLoadingIndicator() {
    return `import 'package:flutter/material.dart';

class LoadingIndicator extends StatelessWidget {
  final String? message;
  
  const LoadingIndicator({Key? key, this.message}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          if (message != null) ...[
            SizedBox(height: 16),
            Text(message!),
          ],
        ],
      ),
    );
  }
}`;
  }
  
  generateFlutterModels(features) {
    const models = {};
    
    if (features.includes('auth')) {
      models['user.dart'] = this.generateFlutterUserModel();
    }
    
    return models;
  }
  
  generateFlutterUserModel() {
    return `class User {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      avatarUrl: json['avatarUrl'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
    };
  }
}`;
  }
  
  generateFlutterServices(features) {
    const services = {};
    
    if (features.includes('api')) {
      services['api_service.dart'] = this.generateFlutterAPIService();
    }
    
    if (features.includes('auth')) {
      services['auth_service.dart'] = this.generateFlutterAuthService();
    }
    
    return services;
  }
  
  generateFlutterAPIService() {
    return `import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://api.example.com';
  
  Future<dynamic> get(String endpoint) async {
    final response = await http.get(Uri.parse('$baseUrl/$endpoint'));
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load data');
    }
  }
  
  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post data');
    }
  }
}`;
  }
  
  generateFlutterAuthService() {
    return `import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../models/user.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  
  Future<bool> login(String email, String password) async {
    try {
      final response = await ApiService().post('auth/login', {
        'email': email,
        'password': password,
      });
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, response['token']);
      await prefs.setString(_userKey, json.encode(response['user']));
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
  
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(_tokenKey);
  }
}`;
  }
  
  generateConstants(name) {
    return `class AppConstants {
  static const String appName = '${name}';
  static const String version = '1.0.0';
  static const String apiBaseUrl = 'https://api.example.com';
}`;
  }
  
  generateFlutterTheme(designSystem) {
    return `import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: ${designSystem?.primaryColor || 'Colors.blue'},
        brightness: Brightness.light,
      ),
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: ${designSystem?.primaryColor || 'Colors.blue'},
        brightness: Brightness.dark,
      ),
    );
  }
}`;
  }
  
  generateFlutterTests(name) {
    return `import 'package:flutter_test/flutter_test.dart';
import 'package:${name.toLowerCase().replace(/\s+/g, '_')}/main.dart';

void main() {
  testWidgets('App launches test', (WidgetTester tester) async {
    await tester.pumpWidget(${this.toPascalCase(name)}App());
    expect(find.text('Welcome to Your App!'), findsOneWidget);
  });
}`;
  }
  
  generatePubspec(name, description, features) {
    const dependencies = {
      'flutter': 'sdk: flutter',
      'cupertino_icons': '^1.0.6'
    };
    
    if (features.includes('api')) {
      dependencies['http'] = '^1.1.0';
    }
    
    if (features.includes('auth')) {
      dependencies['shared_preferences'] = '^2.2.2';
    }
    
    if (features.includes('state')) {
      dependencies['provider'] = '^6.1.1';
    }
    
    return `name: ${name.toLowerCase().replace(/\s+/g, '_')}
description: ${description}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
${Object.entries(dependencies).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`;
  }
  
  generateReactApp(name, features) {
    return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          ${features.includes('auth') ? '<Route path="/profile" element={<ProfilePage />} />' : ''}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = () => (
  <div className="page">
    <h1>Welcome to ${name}</h1>
  </div>
);

${features.includes('auth') ? `
const ProfilePage = () => (
  <div className="page">
    <h1>Profile</h1>
  </div>
);` : ''}

const SettingsPage = () => (
  <div className="page">
    <h1>Settings</h1>
  </div>
);

export default App;`;
  }
  
  generateReactIndex(name) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }
  
  generateReactComponents(features) {
    return {
      'Button.tsx': this.generateReactButton(),
      'Card.tsx': this.generateReactCard(),
      'Header.tsx': this.generateReactHeader()
    };
  }
  
  generateReactButton() {
    return `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`;
  }
  
  generateReactCard() {
    return `import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};`;
  }
  
  generateReactHeader() {
    return `import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
      </nav>
    </header>
  );
};`;
  }
  
  generateReactPages(features) {
    return features.map(f => `${f}Page.tsx`).reduce((acc, page) => {
      acc[page] = this.generateReactPage(page.replace('Page.tsx', ''));
      return acc;
    }, {});
  }
  
  generateReactPage(name) {
    return `import React from 'react';

export const ${this.toPascalCase(name)}Page: React.FC = () => {
  return (
    <div className="page">
      <h1>${name}</h1>
    </div>
  );
};`;
  }
  
  generateReactHooks(features) {
    const hooks = {};
    
    if (features.includes('api')) {
      hooks['useApi.ts'] = this.generateReactUseApi();
    }
    
    if (features.includes('auth')) {
      hooks['useAuth.ts'] = this.generateReactUseAuth();
    }
    
    return hooks;
  }
  
  generateReactUseApi() {
    return `import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}`;
  }
  
  generateReactUseAuth() {
    return `import { useState, useContext, createContext } from 'react';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}`;
  }
  
  generateReactServices(features) {
    return {
      'api.ts': this.generateReactAPIService(),
      'auth.ts': features.includes('auth') ? this.generateReactAuthService() : null
    };
  }
  
  generateReactAPIService() {
    return `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(\`\${API_BASE_URL}/\${endpoint}\`);
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(\`\${API_BASE_URL}/\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};`;
  }
  
  generateReactAuthService() {
    return `import { api } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('auth/login', { email, password });
  },
  
  logout: async () => {
    localStorage.removeItem('token');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};`;
  }
  
  generateReactStore(features) {
    if (features.includes('state')) {
      return {
        'index.ts': this.generateReactStoreIndex(),
        'userSlice.ts': features.includes('auth') ? this.generateReactUserSlice() : null
      };
    }
    return {};
  }
  
  generateReactStoreIndex() {
    return `import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`;
  }
  
  generateReactUserSlice() {
    return `import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  user: any;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;`;
  }
  
  generateGlobalStyles() {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1;
  padding: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-bottom: 1rem;
}

.header {
  background: #f8f9fa;
  padding: 1rem 2rem;
  border-bottom: 1px solid #dee2e6;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #495057;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: rgba(0,0,0,0.05);
}`;
  }
  
  generateCSSVariables(designSystem) {
    const primary = designSystem?.colors?.primary || '#007bff';
    const secondary = designSystem?.colors?.secondary || '#6c757d';
    
    return `:root {
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --color-light: #f8f9fa;
  --color-dark: #343a40;
  
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --border-radius: 4px;
  --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`;
  }
  
  generateHTML(name) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }
  
  generatePackageJson(name, framework, features) {
    const base = {
      name: name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: {}
    };
    
    if (framework === 'react') {
      base.scripts = {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      };
      base.dependencies = {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.20.0'
      };
      base.devDependencies = {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.0',
        typescript: '^5.3.0',
        vite: '^5.0.0'
      };
    } else if (framework === 'vue') {
      base.scripts = {
        serve: 'vue-cli-service serve',
        build: 'vue-cli-service build'
      };
      base.dependencies = {
        vue: '^3.3.0',
        'vue-router': '^4.2.0'
      };
    } else if (framework === 'nuxt') {
      base.scripts = {
        dev: 'nuxt dev',
        build: 'nuxt build',
        preview: 'nuxt preview'
      };
      base.devDependencies = {
        nuxt: '^3.8.0'
      };
    } else if (framework === 'electron') {
      base.scripts = {
        start: 'electron .',
        build: 'electron-builder'
      };
      base.main = 'src/main.js';
      base.devDependencies = {
        electron: '^27.0.0',
        'electron-builder': '^24.0.0'
      };
    }
    
    if (features.includes('state')) {
      base.dependencies['@reduxjs/toolkit'] = '^2.0.0';
      base.dependencies['react-redux'] = '^9.0.0';
    }
    
    return JSON.stringify(base, null, 2);
  }
  
  generateTsConfig(framework) {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: framework === 'react' ? 'react-jsx' : 'preserve',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    }, null, 2);
  }
  
  generateViteConfig() {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});`;
  }
  
  generateNextConfig() {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;`;
  }
  
  generateVueApp(name, features) {
    return `<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// ${name} App
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>`;
  }
  
  generateVueMain() {
    return `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .mount('#app');`;
  }
  
  generateVueComponents(features) {
    return {
      'BaseButton.vue': this.generateVueButton(),
      'BaseCard.vue': this.generateVueCard()
    };
  }
  
  generateVueButton() {
    return `<template>
  <button
    :class="['btn', \`btn-\${variant}\`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>`;
  }
  
  generateVueCard() {
    return `<template>
  <div class="card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>`;
  }
  
  generateVueViews(features) {
    return {
      'HomeView.vue': this.generateVueView('Home'),
      'AboutView.vue': this.generateVueView('About')
    };
  }
  
  generateVueView(name) {
    return `<template>
  <div class="view">
    <h1>${name}</h1>
  </div>
</template>

<script setup lang="ts">
// ${name} View
</script>`;
  }
  
  generateVueStores(features) {
    if (features.includes('state')) {
      return {
        'user.ts': this.generateVueUserStore()
      };
    }
    return {};
  }
  
  generateVueUserStore() {
    return `import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any,
    isAuthenticated: false,
  }),
  
  actions: {
    setUser(user: any) {
      this.user = user;
      this.isAuthenticated = true;
    },
    
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});`;
  }
  
  generateVueComposables(features) {
    return {
      'useApi.ts': this.generateVueUseApi()
    };
  }
  
  generateVueUseApi() {
    return `import { ref } from 'vue';

export function useApi<T>(url: string) {
  const data = ref<T | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  
  fetchData();
  
  return { data, loading, error };
}`;
  }
  
  generateNuxtPages(features) {
    return {
      'index.vue': this.generateNuxtPage('Home'),
      'about.vue': this.generateNuxtPage('About')
    };
  }
  
  generateNuxtPage(name) {
    return `<template>
  <div>
    <h1>${name}</h1>
  </div>
</template>

<script setup lang="ts">
// ${name} Page
</script>`;
  }
  
  generateNuxtComponents(features) {
    return this.generateVueComponents(features);
  }
  
  generateNuxtConfig(name) {
    return `export default defineNuxtConfig({
  app: {
    head: {
      title: '${name}',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  devtools: { enabled: true }
});`;
  }
  
  generateIOSAppDelegate(language) {
    if (language === 'swift') {
      return `import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }
}`;
    }
    return `#import "AppDelegate.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    return YES;
}

@end`;
  }
  
  generateIOSContentView(language) {
    if (language === 'swift') {
      return `import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .font(.largeTitle)
                .padding()
        }
    }
}`;
    }
    return '';
  }
  
  generateIOSInfoPlist(name) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>${name}</string>
    <key>CFBundleIdentifier</key>
    <string>com.app.${name.toLowerCase()}</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
</dict>
</plist>`;
  }
  
  generateAndroidMainActivity(language) {
    if (language === 'kotlin') {
      return `package com.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}`;
    }
    return `package com.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}`;
  }
  
  generateAndroidLayout() {
    return `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/app_name"
        android:textSize="24sp" />
        
</LinearLayout>`;
  }
  
  generateAndroidStrings(name) {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${name}</string>
</resources>`;
  }
  
  generateAndroidManifest(name) {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.app.${name.toLowerCase()}">
    
    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.AppCompat">
        
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>
</manifest>`;
  }
  
  generateAndroidBuildGradle() {
    return `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    compileSdk 34
    
    defaultConfig {
        applicationId "com.app"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
}`;
  }
  
  generateElectronMain(name) {
    return `const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});`;
  }
  
  generateElectronPreload() {
    return `const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});`;
  }
  
  generateElectronRenderer(features) {
    return `document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  app.innerHTML = \`
    <h1>Electron App</h1>
    <p>Platform: \${window.electronAPI.platform}</p>
  \`;
});`;
  }
  
  generatePWAHTML(name) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#000000">
</head>
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`;
  }
  
  generatePWAApp(features) {
    return `// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// App logic
const app = document.getElementById('app');
app.innerHTML = '<h1>Progressive Web App</h1>';`;
  }
  
  generateServiceWorker(name) {
    return `const CACHE_NAME = '${name.toLowerCase()}-v1';
const urlsToCache = [
  '/',
  '/app.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});`;
  }
  
  generatePWAManifest(name) {
    return JSON.stringify({
      name,
      short_name: name,
      start_url: '/',
      display: 'standalone',
      theme_color: '#000000',
      background_color: '#ffffff',
      icons: [
        {
          src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }, null, 2);
  }
  
  generateGodotMainScene(genre) {
    return `[gd_scene load_steps=2 format=2]

[ext_resource path="res://scripts/Main.gd" type="Script" id=1]

[node name="Main" type="Node2D"]
script = ExtResource( 1 )`;
  }
  
  generateGodotPlayerScene(genre) {
    return `[gd_scene load_steps=2 format=2]

[ext_resource path="res://scripts/Player.gd" type="Script" id=1]

[node name="Player" type="KinematicBody2D"]
script = ExtResource( 1 )

[node name="Sprite" type="Sprite" parent="."]

[node name="CollisionShape2D" type="CollisionShape2D" parent="."]`;
  }
  
  generateGodotMainScript(genre) {
    return `extends Node2D

func _ready():
    print("Game started")
    
func _process(delta):
    pass`;
  }
  
  generateGodotPlayerScript(genre) {
    return `extends KinematicBody2D

export var speed = 200
var velocity = Vector2()

func _ready():
    pass
    
func _physics_process(delta):
    velocity = Vector2()
    
    if Input.is_action_pressed("ui_right"):
        velocity.x += 1
    if Input.is_action_pressed("ui_left"):
        velocity.x -= 1
    if Input.is_action_pressed("ui_down"):
        velocity.y += 1
    if Input.is_action_pressed("ui_up"):
        velocity.y -= 1
        
    velocity = velocity.normalized() * speed
    move_and_slide(velocity)`;
  }
  
  generateGodotProject(name) {
    return `[application]

config/name="${name}"
run/main_scene="res://scenes/Main.tscn"

[physics]

common/enable_pause_aware_picking=true

[rendering]

environment/default_environment="res://default_env.tres"`;
  }
  
  generateUnityGameManager(genre) {
    return `using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    void Start()
    {
        Debug.Log("Game Started");
    }
}`;
  }
  
  generateUnityPlayerController(genre) {
    return `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;
    private Rigidbody2D rb;
    private Vector2 movement;
    
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update()
    {
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");
    }
    
    void FixedUpdate()
    {
        rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);
    }
}`;
  }
  
  generateReadme(name, description, type) {
    return `# ${name}

${description}

## Getting Started

### Prerequisites
${type === 'flutter' ? '- Flutter SDK' : '- Node.js'}

### Installation
\`\`\`bash
${type === 'flutter' ? 'flutter pub get' : 'npm install'}
\`\`\`

### Running the app
\`\`\`bash
${type === 'flutter' ? 'flutter run' : 'npm run dev'}
\`\`\`

## Built With
- ${type === 'flutter' ? 'Flutter' : 'React'}

## License
MIT`;
  }
  
  generateRoutes(framework, routes) {
    // Generate route configuration based on framework
    return routes.map(route => ({
      path: route.path || `/${route.name}`,
      component: `${this.toPascalCase(route.name)}Page`,
      name: route.name
    }));
  }
  
  generateLayouts(framework, layouts) {
    // Generate layout components
    return layouts.map(layout => ({
      name: layout.name,
      component: this.generateLayoutComponent(framework, layout)
    }));
  }
  
  generateLayoutComponent(framework, layout) {
    if (framework === 'react') {
      return `export const ${this.toPascalCase(layout.name)}Layout = ({ children }) => (
  <div className="${layout.name}-layout">
    {children}
  </div>
);`;
    }
    return '';
  }
  
  generateAPIClient(endpoints) {
    return {
      'apiClient.ts': `
class APIClient {
  private baseURL = process.env.API_URL || 'http://localhost:3001';
  
  ${endpoints.map(endpoint => `
  async ${endpoint.name}(${endpoint.params ? 'params' : ''}) {
    const response = await fetch(\`\${this.baseURL}${endpoint.path}\`, {
      method: '${endpoint.method || 'GET'}',
      ${endpoint.params ? 'body: JSON.stringify(params),' : ''}
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }`).join('\n')}
}

export default new APIClient();`
    };
  }
  
  generateStateManagement(framework) {
    if (framework === 'react') {
      return {
        'store.ts': this.generateReactStoreIndex()
      };
    }
    return {};
  }
  
  generateDataHooks(endpoints) {
    return endpoints.map(endpoint => ({
      name: `use${this.toPascalCase(endpoint.name)}`,
      code: `export function use${this.toPascalCase(endpoint.name)}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetch${this.toPascalCase(endpoint.name)} = async () => {
    setLoading(true);
    const result = await apiClient.${endpoint.name}();
    setData(result);
    setLoading(false);
  };
  
  return { data, loading, fetch${this.toPascalCase(endpoint.name)} };
}`
    }));
  }
  
  genericTaskExecution(task, dependencies) {
    return {
      task: task.name,
      status: 'completed',
      result: `Generic execution of ${task.name}`
    };
  }
  
  // Utility methods
  flattenStructure(structure, prefix = '') {
    const files = [];
    
    for (const [key, value] of Object.entries(structure)) {
      const path = prefix ? `${prefix}/${key}` : key;
      
      if (value === null || value === undefined) {
        continue;
      }
      
      if (typeof value === 'string') {
        files.push({ path, content: value });
      } else if (typeof value === 'object') {
        files.push(...this.flattenStructure(value, path));
      }
    }
    
    return files;
  }
  
  toPascalCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, c => c.toUpperCase());
  }
}

module.exports = { AppCreationEngine };