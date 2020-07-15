import { Injectable } from '@phantomcms/injector';
import { TagRepository, Tag } from '../data/entities/tag';
import { Route, StatusCode, Params } from '../http';
import { HttpMethod } from '../http/route';
import { Authorize } from '../http/authorize';
import { AccessLevel, User } from '../data/entities/user';
import { Query, PolaronQuery } from '../http/query';

@Injectable()
export class TagsComponent {
  constructor(private repo: TagRepository) {}

  @Route({ method: HttpMethod.POST, route: '/tags' })
  @Params('body.tag')
  @StatusCode(201)
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  createTag(document: Partial<Tag>, { requester }: { requester: User }) {
    return this.repo.create(document, requester);
  }

  @Route({ method: HttpMethod.GET, route: '/tags/:id' })
  @Params('params.id')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  getTag(id: string) {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/tags' })
  @Query()
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  getTags(query?: PolaronQuery<Tag>) {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/tags/:id' })
  @Params('params.id', 'body.updates')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  updateTag(
    id: string,
    updates: Partial<Tag>,
    { requester }: { requester: User }
  ) {
    return this.repo.update(id, updates, requester);
  }

  @Route({ method: HttpMethod.DELETE, route: '/tags/:id' })
  @Params('params.id')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  deleteTag(id: string) {
    return this.repo.delete(id);
  }
}
