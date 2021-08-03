const debug = require('debug')('app:home');

export function home(req, res) {

  const message = "Hello, world!";
  debug(message);
  res.send(message);

}
