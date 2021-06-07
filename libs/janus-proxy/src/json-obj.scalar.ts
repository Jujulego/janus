import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

// Types
export const JsonObj = Symbol('jujulego:janus-proxy:JsonObj');

// Scalar
@Scalar('JSON', () => JsonObj)
export class JsonObjScalar implements CustomScalar<any, any> {
  // Attributes
  description = 'JSON data';

  // Methods
  parseValue(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }

    return null;
  }
}
