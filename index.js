const observe = ( operation, error, done ) => source => {
  source(0, (t, d) => {
    if (t === 1) operation(d);
    if (t === 2 && !d && done ) done();
    if (t === 2 && !!d && error ) error( d );
  });
}

module.exports = observe;
