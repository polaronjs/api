function inject(location: 'params' | 'body' | 'query', propertyName: string) {
  return function (target, propertyKey, parameterIndex) {
    console.log(propertyKey, parameterIndex);
  }
}