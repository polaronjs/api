import { Injectable } from '../injector';

// http
import { Route, Params } from '../http';
import { HttpMethod } from '../http/route';

// services
import { Hasher } from '../services';
import { Tokenizer } from '../services/tokenizer';

// entities
import { UserRepository, User } from '../data/entities/user';

@Injectable()
export class AuthComponent {
  constructor(
    private repo: UserRepository,
    private hasher: Hasher,
    private tokenizer: Tokenizer
  ) {}

  @Route({ method: HttpMethod.POST, route: '/users/tokens' })
  @Params('body.user')
  async getToken({ username, password }) {
    const user = await this.repo.findOneWithPassword(username);

    if (user && (await this.hasher.compare(password, user.password))) {
      // login successful, make a token and set the user's last login time
      return this.tokenizer.sign<User>(user);
    }
  }
}
