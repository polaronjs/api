import { Injectable } from '../injector';
import { CategoryRepository, Category } from '../data/entities/category';
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';

@Injectable()
export class CategoriesComponent {
  constructor(private repo: CategoryRepository) {}

  @Route({ method: HttpMethod.POST, route: '/categories' })
  @Params('body.category')
  @StatusCode(201)
  createCategory(category: Partial<Category>) {
    return this.repo.create(category);
  }

  @Route({ method: HttpMethod.GET, route: '/categories/:id' })
  @Params('params.id')
  getCategory(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/categories' })
  @Params('query')
  getCategories(query?: any) {
    return this.repo.find({ query });
  }

  @Route({ method: HttpMethod.PATCH, route: '/categories/:id' })
  @Params('params.id', 'body.updates')
  updateCategories(id: string, updates: Partial<Category>) {
    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.GET, route: '/categories/:id' })
  @Params('params.id')
  deleteCategory(id: string) {
    return this.repo.delete(id);
  }
}
