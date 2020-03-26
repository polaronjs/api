import { Injectable } from '../injector';
import { ThrustrCore } from '../core';
import { Route, StatusCode } from '../http';
import { ArticleRepository, Article } from '../data/entities/article';

@Injectable()
export class ArticlesComponent {
  constructor({ router }: ThrustrCore, private repo: ArticleRepository) {
    router
      .route('/articles/:id')
      .get(this.getArticle.bind(this))
      .patch(this.updateArticle.bind(this))
      .delete(this.deleteArticle.bind(this));

    router
      .route('/articles')
      .post(this.createArticle.bind(this))
      .get(this.getArticles.bind(this));
  }

  @Route('body.article')
  @StatusCode(201)
  createArticle(article: Partial<Article>): Promise<Article> {
    return this.repo.create(article);
  }

  @Route('params.id')
  getArticle(id: string): Promise<Article> {
    return this.repo.findOne(id);
  }

  @Route('query')
  getArticles(query: any): Promise<Article[]> {
    return this.repo.find(query);
  }

  @Route('params.id', 'body.updates')
  updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    return this.repo.update(id, updates);
  }

  @Route('params.id')
  deleteArticle(id: string): Promise<Article> {
    return this.repo.delete(id);
  }
}
