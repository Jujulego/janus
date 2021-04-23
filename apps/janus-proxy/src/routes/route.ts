import { IsString } from 'class-validator';

// Model
export interface IRoute {
  // Attributes
  name: string;
  url: string;
  targets: string[];
}

export class AddRoute {
  // Attributes
  @IsString()
  url: string;

  @IsString()
  target: string;
}

export class UpdateRoute {
  // Attributes
  @IsString()
  target: string;
}
