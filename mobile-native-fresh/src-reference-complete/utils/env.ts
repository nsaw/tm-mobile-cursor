/* PERSISTED PATCH */
import * as FileSystem from 'expo-file-system';

export async function hydrateEnvFromAppFile(): Promise<'legacy' | 'nextgen'> {
  try {
    const envPath = `${FileSystem.documentDirectory}env.app`;
    const contents = await FileSystem.readAsStringAsync(envPath);
    
    // Parse the env.app file content to extract environment setting
    const lines = contents.split('\n');
    for (const line of lines) {
      if (line.startsWith('EXPO_PUBLIC_ENVIRONMENT=')) {
        const environment = line.split('=')[1]?.trim();
        if (environment === 'nextgen') {
          console.log('✅ Hydrated environment from file: nextgen');
          return 'nextgen';
        }
      }
    }
  } catch (error) {
    console.log('⚠️ Could not hydrate from env.app file:', error);
  }
  
  console.log('📋 Defaulting to legacy environment');
  return 'legacy';
}

export async function getCurrentEnvironment(): Promise<'legacy' | 'nextgen'> {
  // Always hydrate from file as source of truth, ignore process.env
  return await hydrateEnvFromAppFile();
} 