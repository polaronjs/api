export function StatusCode(status: number) {
  return function (target, name, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args: any[]) {
        const isExpress = args.slice(-1)[0];

        if (typeof isExpress === 'boolean' && isExpress) {
          // this was forwarded from express, handle route
          const result = await original.apply(this, args);
          return { status, payload: result };
        } else {
          // function was called directly, ignore express overhead
          return original.apply(this, args);
        }
      };
    }

    return descriptor;
  };
}
