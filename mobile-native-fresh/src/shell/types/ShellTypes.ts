export interface ShellConfig {
  version: string;
  environment: 'legacy' | 'nextgen';
  debug: boolean;
}

export interface ShellContext {
  config: ShellConfig;
  version: string;
  environment: 'legacy' | 'nextgen';
} 