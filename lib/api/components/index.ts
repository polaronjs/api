import {
  ThrustrComponentToken,
  ThrustrComponent
} from '../typings/ThrustrComponent';
import { ThrustrCore } from '../core';

// system messages
import { COMPONENT_HYDRATED } from '../messages';

export class ComponentLayer {
  private hydrated: boolean;
  private tokens = new Set<ThrustrComponentToken>();
  private components = new Map<ThrustrComponentToken, ThrustrComponent>();

  private static instance: ComponentLayer;

  private constructor() {}

  static register(token: ThrustrComponentToken, force?: boolean) {
    if (!this.instance) {
      this.instance = new ComponentLayer();
    }

    if (this.instance.hydrated) {
      throw new Error(
        'Components cannot be added to store after it has been initialized'
      );
    }

    if (this.instance.components.get(token) &&  !force) {
      throw new Error(`Cannot register a component that already exists! ${token} is already registered. You can call \`.register\` with the \`force\` parameter to override this check.`);
    }

    this.instance.tokens.add(token);
  }

  static resolve(token: ThrustrComponentToken): ThrustrComponent {
    if (!this.instance || !this.instance.hydrated) {
      throw new Error('Component cannot be retrieved before it is hydrated');
    }

    return this.instance.components.get(token);
  }

  static hydrate() {
    if (!this.instance) {
      throw new Error('Cannot hydrate Component Layer: Layer is empty');
    }

    if (this.instance.hydrated) {
      throw new Error('Cannot hydrate Component Layer: Layer is already hydrated');
    }

    this.instance.hydrated = true;

    this.instance.tokens.forEach(token => {
      this.instance.components.set(
        token,
        new token(ThrustrCore.resolveInstance())
      );

      COMPONENT_HYDRATED(token.name);
    });
  }
}

// import components
import './users';
