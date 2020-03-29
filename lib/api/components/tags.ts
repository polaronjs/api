import { Injectable } from '../injector';
import { TagRepository, Tag } from '../data/entities/tag';
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';

@Injectable()
export class TagsComponent {
  constructor(private repo: TagRepository) {}

  @Route({ method: HttpMethod.POST, route: '/tags' })
  @Params('body.tag')
  @StatusCode(201)
  createTag(document: Partial<Tag>) {
    return this.repo.create(document);
  }

  @Route({ method: HttpMethod.GET, route: '/tags/:id' })
  @Params('params.id')
  getTag(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/tags' })
  @Params('query')
  getTags(query?: any) {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/tags/:id' })
  @Params('params.id', 'body.updates')
  updateTag(id: string, updates: Partial<Tag>) {
    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.DELETE, route: '/tags/:id' })
  @Params('params.id')
  deleteTag(id: string) {
    return this.repo.delete(id);
  }
}
