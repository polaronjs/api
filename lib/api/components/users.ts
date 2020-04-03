import { Injectable } from '../injector';
import { Hasher } from '../services';

// http
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';

// entities
import { UserRepository, User } from '../data/entities/user';

// errors
import { BadRequestError } from '../errors';
import { onEvent } from '../events';

@Injectable()
export class UsersComponent {
  constructor(public repo: UserRepository, public hasher: Hasher) {}

  @Route({ method: HttpMethod.POST, route: '/users' })
  @StatusCode(201)
  @Params('body.user')
  async createUser(user: Partial<User>): Promise<User> {
    if (!user.password) {
      throw new BadRequestError({
        message: 'Cannot create a user without a password',
      });
    }

    user.password = await this.hasher.hash(user.password);

    return this.repo.create(user);
  }

  @Route({ method: HttpMethod.GET, route: '/users/:id' })
  @Params('params.id')
  async getUser(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/users' })
  @Params('query')
  getUsers(query?: any): Promise<User[]> {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/users/:id' })
  @Params('params.id', 'body.updates')
  @onEvent('USER_LOGIN', (payload) => {
    return [payload.user._id, { lastLogin: new Date() }];
  })
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (updates.password) {
      updates.password = await this.hasher.hash(updates.password);
    }

    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.DELETE, route: '/users/:id' })
  @Params('params.id')
  deleteUser(id: string): Promise<User> {
    return this.repo.delete(id);
  }
}
