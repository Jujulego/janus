// Interfaces
export interface IGateConfig {
  // Attributes
  target: string;
  enabled?: boolean;
  changeOrigin?: boolean;
  secure?: boolean;
  ws?: boolean;
}

export interface IServiceConfig {
  // Attributes
  url: string;
  gates: Record<string, IGateConfig>;
}

export interface IControlServerConfig {
  // Attributes
  port?: number;
}

export interface IProxyConfig {
  // Attributes
  port?: number;
}

export interface IJanusConfig {
  // Attributes
  pidfile: string;
  proxy?: IProxyConfig;
  control?: IControlServerConfig;
  services: Record<string, IServiceConfig>;
}
