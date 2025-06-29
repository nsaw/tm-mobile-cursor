import * as Linking from 'expo-linking';

export interface DeepLinkParams {
  path: string;
  params: Record<string, string>;
  fullUrl: string;
}

export interface NavigationHandler {
  navigate: (screen: string, params?: any) => void;
}

export class DeepLinkService {
  private static instance: DeepLinkService;
  private navigationHandler: NavigationHandler | null = null;

  static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService();
    }
    return DeepLinkService.instance;
  }

  setNavigationHandler(handler: NavigationHandler) {
    this.navigationHandler = handler;
  }

  parseDeepLink(url: string): DeepLinkParams | null {
    try {
      const parsed = Linking.parse(url);
      console.log('Deep link parsed:', parsed);
      
      // Extract path and query parameters
      const { path, queryParams } = parsed;
      
      // Convert queryParams to Record<string, string>
      const params: Record<string, string> = {};
      if (queryParams) {
        Object.keys(queryParams).forEach(key => {
          const value = queryParams[key];
          if (typeof value === 'string') {
            params[key] = value;
          } else if (Array.isArray(value) && value.length > 0) {
            params[key] = value[0]; // Take first value if array
          }
          // Skip undefined values
        });
      }
      
      return {
        path: path || '',
        params,
        fullUrl: url
      };
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  }

  handleDeepLink(url: string): boolean {
    const parsed = this.parseDeepLink(url);
    if (!parsed || !this.navigationHandler) {
      console.log('No navigation handler or invalid URL:', url);
      return false;
    }

    console.log('Handling deep link:', parsed);

    // Route based on path
    switch (parsed.path) {
      case 'home':
      case 'dashboard':
        this.navigationHandler.navigate('Dashboard');
        return true;
      case 'search':
        this.navigationHandler.navigate('Search');
        return true;
      case 'thoughtmarks':
      case 'all-thoughtmarks':
        this.navigationHandler.navigate('AllThoughtmarks');
        return true;
      case 'ai-tools':
        this.navigationHandler.navigate('AITools');
        return true;
      case 'create':
      case 'new':
        this.navigationHandler.navigate('CreateThoughtmark');
        return true;
      case 'thoughtmark':
        if (parsed.params.id) {
          this.navigationHandler.navigate('ThoughtmarkDetail', { thoughtmarkId: parsed.params.id });
          return true;
        }
        break;
      case 'bin':
        if (parsed.params.id) {
          this.navigationHandler.navigate('AllThoughtmarks', { 
            filterParams: { filter: 'bin', binId: parsed.params.id, binName: parsed.params.name }
          });
          return true;
        }
        break;
      case 'tag':
        if (parsed.params.tag) {
          this.navigationHandler.navigate('AllThoughtmarks', { 
            filterParams: { filter: 'tag', tag: parsed.params.tag }
          });
          return true;
        }
        break;
      case 'tasks':
        this.navigationHandler.navigate('AllThoughtmarks', { 
          filterParams: { filter: 'tasks' }
        });
        return true;
      case 'settings':
        this.navigationHandler.navigate('Settings');
        return true;
      case 'premium':
        this.navigationHandler.navigate('Premium');
        return true;
      default:
        console.log('Unknown deep link path:', parsed.path);
        // Default to dashboard
        this.navigationHandler.navigate('Dashboard');
        return true;
    }

    return false;
  }

  // Generate deep link URLs for sharing
  generateDeepLink(path: string, params: Record<string, string> = {}): string {
    const baseUrl = 'thoughtmarks://';
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const url = queryString 
      ? `${baseUrl}${path}?${queryString}`
      : `${baseUrl}${path}`;
    
    return url;
  }

  // Test deep link functionality
  async testDeepLink(url: string): Promise<boolean> {
    try {
      const canOpen = await Linking.canOpenURL(url);
      console.log(`Can open URL ${url}:`, canOpen);
      return canOpen;
    } catch (error) {
      console.error('Error testing deep link:', error);
      return false;
    }
  }
}

export default DeepLinkService; 