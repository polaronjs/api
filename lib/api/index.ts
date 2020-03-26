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

// configure cors
app.use(cors({ origin: '*' }));

// load standard components
import './components';

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
