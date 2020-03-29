import { Injectable } from '../injector';
import { Route, StatusCode, Params } from '../http';
import { ArticleRepository, Article } from '../data/entities/article';
import { HttpMethod } from '../http/route';

@Injectable()
export class ArticlesComponent {
  constructor(private repo: ArticleRepository) {}

  @Route({ method: HttpMethod.POST, route: '/articles' })
  @Params('body.article')
  @StatusCode(201)
  createArticle(article: Partial<Article>): Promise<Article> {
    return this.repo.create(article);
  }

  @Route({ method: HttpMethod.GET, route: '/articles/:id' })
  @Params('params.id')
  getArticle(id: string): Promise<Article> {
    return this.repo.findOne(id);
  }

  @Route({ method: HttpMethod.GET, route: '/articles' })
  @Params('query')
  getArticles(query: any): Promise<Article[]> {
    return this.repo.find(query);
  }

  @Route({ method: HttpMethod.PATCH, route: '/articles/:id' })
  @Params('params.id', 'body.updates')
  updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return this.repo.update(id, updates);
  }

  @Route({ method: HttpMethod.GET, route: '/artices/:id' })
  @Params('params.id')
  deleteArticle(id: string): Promise<Article> {
    return this.repo.delete(id);
  }
}
