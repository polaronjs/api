import { Injectable } from '../injector';
import { TagRepository, Tag } from '../data/entities/tag';
import { ThrustrCore } from '../core';
import { Route, StatusCode } from '../http';

@Injectable()
export class TagsComponent {
  constructor({ router }: ThrustrCore, private repo: TagRepository) {
    router
      .route('/tags')
      .get(this.getTags.bind(this))
      .post(this.createTag.bind(this));

    router
      .route('/tags/:id')
      .get(this.getTag.bind(this))
      .patch(this.updateTag.bind(this))
      .delete(this.deleteTag.bind(this));
  }

  @Route('body.tag')
  @StatusCode(201)
  createTag(document: Partial<Tag>) {
    return this.repo.create(document);
  }

  @Route('params.id')
  getTag(id: string) {
    return this.repo.findOne(id);
  }

  @Route('query')
  getTags(query?: any) {
    return this.repo.find(query);
  }

  @Route('params.id', 'body.updates')
  updateTag(id: string, updates: Partial<Tag>) {
    return this.repo.update(id, updates);
  }

  @Route('params.id') s;
  deleteTag(id: string) {
    return this.repo.delete(id);
  }
}
