// Model
export interface IRoute {
  // Attributes
  name: string;
  url: string;
  targets: string[];
}

export interface IAddRoute {
  // Attributes
  url: string;
  target: string;
}

export interface IUpdateRoute {
  // Attributes
  target: string;
}
