import { Route, StatusCode } from '../http';
import { ThrustrCore } from '../core';
import { Injectable } from '../injector';

@Injectable()
export class UsersComponent {

  constructor({ router }: ThrustrCore) {
    router.get('/users/:id', this.findOneById.bind(this));
  }
  
  @Route('params.id')
  findOneById(id: string) {
    return `Yeet: ${id}`;
  }

}