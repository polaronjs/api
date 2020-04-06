import { Injectable } from '../injector';
import { CategoryRepository, Category } from '../data/entities/category';
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';
import { AccessLevel, User } from '../data/entities/user';
import { Authorize } from '../http/authorize';
import { Query, ThrustrQuery } from '../http/query';

@Injectable()
export class CategoriesComponent {
  constructor(private repo: CategoryRepository) {}

  @Route({ method: HttpMethod.POST, route: '/categories' })
  @Params('body.category')
  @StatusCode(201)
  @Authorize({ minimumAccessLevel: AccessLevel.ADMIN })
  createCategory(
    category: Partial<Category>,
    { requester }: { requester: User }
  ) {
    return this.repo.create(category, requester);
  }

  @Route({ method: HttpMethod.GET, route: '/categories/:id' })
  @Params('params.id')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  getCategory(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/categories' })
  @Query()
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  getCategories(query?: ThrustrQuery<Category>) {
    return this.repo.find({ query });
  }

  @Route({ method: HttpMethod.PATCH, route: '/categories/:id' })
  @Params('params.id', 'body.updates')
  @Authorize({ minimumAccessLevel: AccessLevel.ADMIN })
  updateCategories(
    id: string,
    updates: Partial<Category>,
    { requester }: { requester: User }
  ) {
    return this.repo.update(id, updates, requester);
  }

  @Route({ method: HttpMethod.GET, route: '/categories/:id' })
  @Params('params.id')
  @Authorize({ minimumAccessLevel: AccessLevel.ADMIN })
  deleteCategory(id: string) {
    return this.repo.delete(id);
  }
}
