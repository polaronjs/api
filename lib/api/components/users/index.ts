import { Component } from '../../decorators/component';
import { Route } from '../../decorators/route';
import { StatusCode } from '../../decorators/status';
import { ThrustrCore } from '../../../api/core';

@Component('users')
export class Users {

  constructor({ router }: ThrustrCore) {
    router.get('/users/:id', this.findOneById.bind(this));
  }
  
  @Route('params.id')
  findOneById(id: string) {
    return `Yeet: ${id}`;
  }

}