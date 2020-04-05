import { Injectable } from '../injector';
import { Route, StatusCode, Params } from '../http';
import { ArticleRepository, Article } from '../data/entities/article';
import { HttpMethod } from '../http/route';
import { Authorize } from '../http/authorize';
import { AccessLevel } from '../data/entities/user';
import { Query, ThrustrQuery } from '../http/query';

@Injectable()
export class ArticlesComponent {
  constructor(private repo: ArticleRepository) {}

  @Route({ method: HttpMethod.POST, route: '/articles' })
  @Params('body.article')
  @StatusCode(201)
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  createArticle(article: Partial<Article>): Promise<Article> {
    return this.repo.create(article);
  }

  @Route({ method: HttpMethod.GET, route: '/articles/:id' })
  @Params('params.id')
  getArticle(id: string): Promise<Article> {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/articles' })
  @Query()
  getArticles(query?: ThrustrQuery<Article>): Promise<Article[]> {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/articles/:id' })
  @Params('params.id', 'body.updates')
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.GET, route: '/artices/:id' })
  @Authorize({ minimumAccessLevel: AccessLevel.EDITOR })
  @Params('params.id')
  deleteArticle(id: string): Promise<Article> {
    return this.repo.delete(id);
  }
}
