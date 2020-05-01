import { Injectable } from '@phantomcms/injector';
import { Route, StatusCode, Params } from '../http';
import { ArticleRepository, Article } from '../data/entities/article';
import { HttpMethod } from '../http/route';
import { Authorize } from '../http/authorize';
import { AccessLevel, User } from '../data/entities/user';
import { Query, PhantomQuery } from '../http/query';

@Injectable()
export class ArticlesComponent {
  constructor(private repo: ArticleRepository) {}

  @Route({ method: HttpMethod.POST, route: '/articles' })
  @Params('body.article')
  @StatusCode(201)
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  createArticle(
    article: Partial<Article>,
    { requester }: { requester: User }
  ): Promise<Article> {
    return this.repo.create(article, requester);
  }

  @Route({ method: HttpMethod.GET, route: '/articles/:id' })
  @Params('params.id')
  getArticle(id: string): Promise<Article> {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/articles' })
  @Query()
  getArticles(query?: PhantomQuery<Article>): Promise<Article[]> {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/articles/:id' })
  @Params('params.id', 'body.updates')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  updateArticle(
    id: string,
    updates: Partial<Article>,
    { requester }: { requester: User }
  ): Promise<Article> {
    return this.repo.update(id, updates, requester);
  }

  @Route({ method: HttpMethod.GET, route: '/artices/:id' })
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  @Params('params.id')
  deleteArticle(id: string): Promise<Article> {
    return this.repo.delete(id);
  }
}
