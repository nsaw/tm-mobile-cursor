export interface NativeModule {
  name: string;
  version: string;
  methods: string[];
  events: string[];
}

export interface NativeCapability {
  name: string;
  available: boolean;
  permissions: string[];
  config: any;
}

export interface NativeError {
  code: string;
  message: string;
  nativeError?: any;
}

export interface NativeResult<T = any> {
  success: boolean;
  data?: T;
  error?: NativeError;
}
