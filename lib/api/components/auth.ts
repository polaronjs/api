import { Injectable } from '@phantomcms/injector';

// http
import { Route, Params } from '../http';
import { HttpMethod } from '../http/route';

// services
import { Hasher } from '../services';
import { Tokenizer } from '../services/tokenizer';

// entities
import { UserRepository, User } from '../data/entities/user';

// errors
import { UnauthorizedError } from '../errors';
import { TriggerEvent } from '../events';
import { Authorize } from '../http/authorize';

@Injectable()
export class AuthComponent {
  constructor(
    private repo: UserRepository,
    private hasher: Hasher,
    private tokenizer: Tokenizer
  ) {}

  @Route({ method: HttpMethod.POST, route: '/users/tokens' })
  @TriggerEvent('USER_LOGIN')
  @Params('body.user')
  async getToken({ username, password }) {
    const user = await this.repo.findOneWithPassword(username);

    if (user && (await this.hasher.compare(password, user.password))) {
      // login successful, make a token and set the user's last login time

      delete user.password;

      return {
        user,
        token: this.tokenizer.sign<User>(user, { expiresIn: '24h' }),
      };
    } else {
      throw new UnauthorizedError();
    }
  }

  @Route({ method: HttpMethod.GET, route: '/users/tokens/' })
  @Authorize()
  async translateToken({ requester: user }: { requester: User }) {
    delete user['iat'];
    delete user['exp'];
    return user;
  }
}
