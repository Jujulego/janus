// Interfaces
export interface ConfigGate {
  // Attributes
  target: string;
  enabled?: boolean;
  changeOrigin?: boolean;
  secure?: boolean;
  ws?: boolean;
}

export interface ConfigService {
  // Attributes
  url: string;
  gates: Record<string, ConfigGate>;
}

export interface Config {
  // Attributes
  proxy?: {
    port?: number;
  };

  server?: {
    port?: number;
  };

  services: Record<string, ConfigService>;
}
