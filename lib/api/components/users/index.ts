import { Component } from '../../decorators/component';
import { Route } from '../../decorators/route';
import { ThrustrCore } from '../../core';
import { UserEntity } from '../../data/entities/user';

@Component('users')
export class Users {

  users = new UserEntity();

  constructor({ router }: ThrustrCore) {
    router.get('/users/:id', this.findOneById.bind(this));
  }
  
  @Route('params.id')
  findOneById(id: string) {
    return `Yeet: ${id}`;
  }

}