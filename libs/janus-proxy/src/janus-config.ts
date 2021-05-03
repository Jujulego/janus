// Constants
export const DEFAULT_CONTROL_PORT = 5000;
export const DEFAULT_PROXY_PORT = 3000;

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

export interface JanusConfig {
  // Attributes
  proxy?: {
    port?: number;
  };

  control?: {
    port?: number;
  };

  services: Record<string, ConfigService>;
}
