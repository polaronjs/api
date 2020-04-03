import { Injectable } from '../injector';

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
import { triggerEvent, EventBus } from '../events';

@Injectable()
export class AuthComponent {
  constructor(
    private repo: UserRepository,
    private hasher: Hasher,
    private tokenizer: Tokenizer,
    private events: EventBus
  ) {}

  @Route({ method: HttpMethod.POST, route: '/users/tokens' })
  @Params('body.user')
  async getToken({ username, password }) {
    const user = await this.repo.findOneWithPassword(username);

    if (user && (await this.hasher.compare(password, user.password))) {
      // login successful, make a token and set the user's last login time
      this.events.emit('USER_LOGIN', {
        updates: { id: user.id, lastLoginDate: new Date() },
      });
      return {
        id: user,
        token: this.tokenizer.sign<User>(user, { expiresIn: '24h' }),
      };
    } else {
      throw new UnauthorizedError();
    }
  }
}
