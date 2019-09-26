import { Resolver, ResolveProperty } from '@nestjs/graphql';

@Resolver('Result')
export class ResultResolver {
  @ResolveProperty()
  __resolveType(obj) {
    if (obj.email) {
      return 'User';
    }
    if (obj.name) {
      return 'Site';
    }
    return null;
  }
}
