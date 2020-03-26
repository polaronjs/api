import { INJECTABLE_HYDRATED } from '../messages';

export type Injectable<T> = new (...args: any[]) => T;

export class Injector {
  private static instance: Injector;

  private hydrated: boolean;
  private tokens = new Set<Injectable<any>>();
  private injectables = new Map<Injectable<any>, any>();

  private constructor() {}

  /**
   * Register a token with the Injector
   * @param {Injectable<T>} token
   * @param config
   */
  static register(
    token: Injectable<any>,
    config?: { force?: boolean; immediate?: boolean; useValue?: any }
  ) {
    if (!this.instance) {
      this.instance = new Injector();
    }

    if (config && config.useValue) {
      // never hydrate and simply use the provided value
      this.instance.injectables.set(token, config.useValue);
    } else if (config && config.immediate) {
      // perform hydration of this Injectable now
      if (this.instance.injectables.has(token)) {
        throw new Error(
          `Cannot register token \`${token.name}\` with Injector: token exists. Try using the 'force' option.`
        );
      }

      this.hydrateToken(token);
    } else {
      if (this.instance.tokens.has(token)) {
        throw new Error(
          `Cannot register token \`${token.name}\` with Injector: token exists. Try using the 'force' option.`
        );
      }

      // defer hydration to hydration step
      this.instance.tokens.add(token);
    }
  }

  /**
   * Retrieve a dependency from the Injector, keyed by token
   * @param {Injectable<T>} token
   */
  static resolve<T>(token: Injectable<T>): T {
    if (!this.instance) {
      this.instance = new Injector();
    }

    return this.instance.injectables.get(token);
  }

  /**
   * Create and store instances of all tokens not already provided
   */
  static hydrate() {
    if (this.instance.hydrated) {
      throw new Error('Cannot hydrate injector: already hydrated');
    }

    if (!this.instance.tokens.size) {
      throw new Error('Cannot hydrate injector: injector empty');
    }

    for (const token of this.instance.tokens) {
      this.hydrateToken(token);
    }
  }

  /**
   * Hydrate a provided token and store in the INjector
   * @param {Injectable<any>} token
   */
  private static hydrateToken(token: Injectable<any>) {
    const orderedDepdencies = resolveContructorDependencies(token);

    if (orderedDepdencies) {
      // this token relies on other injectable dependencies, provide them

      this.instance.injectables.set(token, new token(...orderedDepdencies));
    } else {
      // this token doesn't rely on other injectable dependencies, simply call the constructor
      this.instance.injectables.set(token, new token());
    }

    INJECTABLE_HYDRATED(token.name);
  }
}

/**
 * Class decorator for providing depdencies defined in constructor
 * @param config
 */
export function Injectable(config?: { force?: boolean; immediate?: boolean }) {
  return function (ctor: Injectable<any>) {
    Injector.register(ctor, config);
  };
}

/**
 * Property decorator for injecting a dependency directly to a class property
 * @param token
 */
export function inject(token: Injectable<any>) {
  return function (target, key) {
    Reflect.set(target, key, Injector.resolve(token));
  };
}

/**
 * Returns a list of required dependencies from the Injector as specified by the token's constructor
 * @param {Injectable<any>} token
 */
function resolveContructorDependencies(token: Injectable<any>) {
  const injectionTokens = Reflect.getMetadata('design:paramtypes', token);

  if (injectionTokens) {
    const orderedDepdencies = [];

    injectionTokens.map((x) => {
      const dependency = Injector.resolve(x);

      if (dependency) {
        orderedDepdencies.push(dependency);
      } else {
        throw new Error(`Cannot resolve dependency \`${token.name}\``);
      }
    });

    return orderedDepdencies;
  } else {
    return [];
  }
}
