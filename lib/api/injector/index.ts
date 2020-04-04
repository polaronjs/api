import { INJECTABLE_HYDRATED } from '../messages';

export type Injectable<T> = new (...args: any[]) => T;

export class Injector {
  private static instance: Injector;

  private injectables = new Map<Injectable<any> | any, any>();

  private constructor() {}

  /**
   * Register a token with the Injector
   * @param {Injectable<T>} token
   * @param config
   */
  static register(
    token: Injectable<any> | any,
    config?: {
      force?: boolean;
      useValue?: any;
      useClass?: Injectable<any>;
    }
  ) {
    if (!this.instance) {
      this.instance = new Injector();
    }

    if (config && config.useValue) {
      // never hydrate and simply use the provided value
      this.instance.injectables.set(token, config.useValue);
    } else if (config && config.useClass) {
      // perform hydration of the supplied class now
      this.hydrateToken(token, config.useClass);
    } else {
      // perform hydration of this Injectable now
      if (this.instance.injectables.has(token) && !config.force) {
        throw new Error(
          `Cannot register token \`${token.name}\` with Injector: token exists. Try using the 'force' option.`
        );
      }

      this.hydrateToken(token);
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
   * Hydrate a provided token and store in the INjector
   * @param {Injectable<any>} token
   */
  private static hydrateToken(
    token: Injectable<any> | any,
    useClass?: Injectable<any>
  ) {
    const orderedDepdencies = resolveContructorDependencies(useClass || token);

    if (orderedDepdencies) {
      // this token relies on other injectable dependencies, provide them

      this.instance.injectables.set(
        token,
        new (useClass || token)(...orderedDepdencies)
      );
    } else {
      // this token doesn't rely on other injectable dependencies, simply call the constructor
      this.instance.injectables.set(token, new (useClass || token)());
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
        throw new Error(
          `Error resolving dependencies for ${token.name}: cannot resolve dependency '${dependency}'`
        );
      }
    });

    return orderedDepdencies;
  } else {
    return [];
  }
}
