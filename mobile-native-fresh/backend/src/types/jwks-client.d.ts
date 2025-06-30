declare module 'jwks-client' {
  interface JwksClient {
    getSigningKey(kid: string, callback: (err: any, key: any) => void): void;
  }

  interface JwksClientOptions {
    jwksUri: string;
    cache?: boolean;
    cacheMaxEntries?: number;
    cacheMaxAge?: number;
  }

  function JwksClient(options: JwksClientOptions): JwksClient;
  export = JwksClient;
} 