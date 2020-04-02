// express
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

// system messages
import { INTERFACE_AVAILABLE } from './messages';

// load variables from environment file
dotenv.config();

// core
import { ThrustrCore } from './core';

// injector
import { Injector } from './injector';

// errors
import { NotFoundError } from './errors';
import { mapErrorToHttp } from './errors/http';

const app = express();
const router = Injector.resolve<ThrustrCore>(ThrustrCore).router;

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cors
app.use(cors({ origin: '*' }));

// TODO add default prefix
app.use(`/${process.env.API_PREFIX}`, router);

// define Thrustr default welcome message
router.get('/', (_, res) => {
  res.send(`Welcome to the Thrustr API for ${process.env.SITE_NAME}!`);
});

app.use('**', (req, res, next) => {
  // catch all, throw a not found error and pass to default error handler
  next(new NotFoundError());
});

// load standard components
import './components';

// default error handler
app.use((err, req, res, next) => {
  const { code, ...payload } = mapErrorToHttp(err);

  if (payload.message) {
    res.status(code).send(payload);
  } else {
    res.sendStatus(code);
  }
});

// exports
export const start = (callback?: () => void) => {
  // TODO add default port
  app.listen(process.env.PORT, () => {
    INTERFACE_AVAILABLE('HTTP', process.env.PORT);

    if (callback) {
      callback();
    }
  });
};
