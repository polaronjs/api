import { Injector, Injectable } from '../injector';
import { Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';

export interface Event<T> {
  name: string;
  payload?: any;
}

/**
 * Fire the decorated function on the specified events
 * @param events
 * @param {(eventPayload) => any[]}[mapPayloadToArgs]
 */
export function onEvent(
  events: string | string[],
  mapPayloadToArgs?: (eventPayload: any) => any[]
) {
  return function (target, name, descriptor) {
    const original: Function = descriptor.value;

    if (typeof original === 'function') {
      const eventBus = Injector.resolve(EventBus);
      let callback = original.bind(Injector.resolve(target.constructor));

      if (mapPayloadToArgs) {
        // there's a provided function for mapping params between functions, use it
        callback = function ({ payload }: Event<any>) {
          return original
            .bind(Injector.resolve(target.constructor))
            .apply(this, mapPayloadToArgs(payload));
        };
      }

      eventBus.on(events, callback);
    }

    return descriptor;
  };
}

/**
 * Fire the specified event when this function is called
 * @param eventName
 */
export function triggerEvent(eventName: string) {
  return function (target, name, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args: any) {
        const result = await original
          // we bind the original function to the instance of `target` from the Injector store for the `this` context
          .bind(Injector.resolve(target.constructor))
          .apply(this, args);

        const eventBus = Injector.resolve<EventBus>(EventBus);
        eventBus.emit(eventName, result);

        return result;
      };
    }

    return descriptor;
  };
}

@Injectable()
export class EventBus {
  private events: Subject<Event<any>> = new Subject();

  on(events: string | string[], callback: (event: Event<any>) => void) {
    this.events
      .pipe(
        filter(
          (e) =>
            e.name === events ||
            (Array.isArray(events) && events.includes(name))
        )
      )
      .subscribe((event) => {
        callback(event);
      });
  }

  once(events: string | string[], callback: (event: Event<any>) => void) {
    this.events
      .pipe(
        filter(
          (e) =>
            e.name === events ||
            (Array.isArray(events) && events.includes(name))
        ),
        take(1)
      )
      .subscribe((event) => {
        callback(event);
      });
  }

  emit(name: string, payload?: any) {
    this.events.next({ name, payload });
  }
}
