import { Route, StatusCode } from '../http';
import { ThrustrCore } from '../core';
import { Injectable } from '../injector';
import { Hasher } from '../services';

// entities
import { UserRepository, User } from '../data/entities/user';

@Injectable()
export class UsersComponent {
  constructor(
    { router }: ThrustrCore,
    private repo: UserRepository,
    private hasher: Hasher
  ) {
    router
      .route('/users')
      .get(this.getUsers.bind(this))
      .post(this.createUser.bind(this));

    router
      .route('/users/:id')
      .get(this.getUser.bind(this))
      .patch(this.updateUser.bind(this))
      .delete(this.deleteUser.bind(this));
  }

  @Route('body.user')
  @StatusCode(201)
  async createUser(user: Partial<User>): Promise<User> {
    if (!user.password) {
      throw new Error('Cannot create a user without a password');
    }

    user.password = await this.hasher.hash(user.password);

    return this.repo.create(user);
  }

  @Route('params.id')
  getUser(id: string) {
    return this.repo.findOne(id);
  }

  @Route('query')
  getUsers(query?: any): Promise<User[]> {
    return this.repo.find({ query });
  }

  @Route('params.id', 'body.updates')
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (updates.password) {
      updates.password = await this.hasher.hash(updates.password);
    }

    return this.repo.update(id, updates);
  }

  @Route('params.id')
  deleteUser(id: string): Promise<User> {
    return this.repo.delete(id);
  }
}
