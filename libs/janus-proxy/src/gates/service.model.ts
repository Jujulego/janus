import { Field, ObjectType } from '@nestjs/graphql';
import { plainToClass, Type } from 'class-transformer';

import { IService } from '@jujulego/janus-common';
import { IServiceConfig } from '@jujulego/janus-config';

import { Gate } from './gate.model';

// Model
@ObjectType()
export class Service implements IService {
  // Attributes
  @Field()
  name: string;

  @Field()
  url: string;

  @Type(() => Gate)
  @Field(() => [Gate])
  gates: Gate[];

  // Statics
  static fromConfig(name: string, config: IServiceConfig): Service {
    return plainToClass(Service, {
      name: name,
      url: config.url,
      gates: Object.keys(config.gates).map((name, i) =>
        Gate.fromConfig(name, i, config.gates[name]),
      ),
    });
  }

  // Methods
  getGate(name: string): Gate | null {
    return this.gates.find((g) => g.name === name) || null;
  }
}
