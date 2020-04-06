import { Injectable } from '../injector';
import { Hasher } from '../services';

// http
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';
import { Query, ThrustrQuery } from '../http/query';

// entities
import { UserRepository, User, AccessLevel } from '../data/entities/user';

// errors
import { BadRequestError } from '../errors';
import { OnEvent } from '../events';
import { Authorize } from '../http/authorize';

@Injectable()
export class UsersComponent {
  constructor(public repo: UserRepository, public hasher: Hasher) {}

  @Route({ method: HttpMethod.POST, route: '/users' })
  @Authorize({ minimumAccessLevel: AccessLevel.SUPER })
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
  @Authorize({
    preExecAuth: (user, req) => {
      return user.id === req.params.id || user.accessLevel >= AccessLevel.ADMIN;
    },
  })
  @Params('params.id')
  async getUser(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/users' })
  @Authorize({ minimumAccessLevel: AccessLevel.SUPER })
  @Query()
  getUsers(query?: ThrustrQuery<User>): Promise<User[]> {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/users/:id' })
  @Authorize({
    preExecAuth: (user, req) => {
      return user.id === req.params.id || user.accessLevel >= AccessLevel.SUPER;
    },
  })
  @Params('params.id', 'body.updates')
  @OnEvent('USER_LOGIN', (payload) => {
    return [payload.user.id, { lastLogin: new Date() }];
  })
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (updates.username) {
      throw new BadRequestError({
        message: "A user's username cannot be changed",
      });
    }

    if (updates.password) {
      updates.password = await this.hasher.hash(updates.password);
    }

    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.DELETE, route: '/users/:id' })
  @Authorize({ minimumAccessLevel: AccessLevel.SUPER })
  @Params('params.id')
  deleteUser(id: string): Promise<User> {
    return this.repo.delete(id);
  }
}
