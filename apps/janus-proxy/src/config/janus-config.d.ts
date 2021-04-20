// Model
export interface JanusProxyConfig {
  port?: number;
}

export interface JanusServerConfig {
  port?: number;
}

export interface JanusService {
  url: string;
  target: string;
}

export interface JanusConfig {
  proxy?: JanusProxyConfig;
  server?: JanusServerConfig;
  services: Record<string, JanusService>;
}
