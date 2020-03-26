import { Injectable } from '../injector';
import { CategoryRepository, Category } from '../data/entities/category';
import { ThrustrCore } from '../core';
import { Route, StatusCode } from '../http';

@Injectable()
export class CategoriesComponent {
  constructor({ router }: ThrustrCore, private repo: CategoryRepository) {
    router
      .route('/categories')
      .get(this.getCategories.bind(this))
      .post(this.createCategory.bind(this));

    router
      .route('/categories/:id')
      .get(this.getCategory.bind(this))
      .patch(this.updateCategories.bind(this))
      .delete(this.deleteCategory.bind(this));
  }

  @Route('body.category')
  @StatusCode(201)
  createCategory(category: Partial<Category>) {
    return this.repo.create(category);
  }

  @Route('params.id')
  getCategory(id: string) {
    return this.repo.findOne(id);
  }

  @Route('query')
  getCategories(query?: any) {
    return this.repo.find({ query });
  }

  @Route('params.id', 'body.updates')
  updateCategories(id: string, updates: Partial<Category>) {
    return this.repo.update(id, updates);
  }

  @Route('params.id')
  deleteCategory(id: string) {
    return this.repo.delete(id);
  }
}
