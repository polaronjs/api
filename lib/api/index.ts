// TODO websockets?
// TODO config?

import * as chalk from 'chalk';

// express
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

// load variables from environment file
dotenv.config();

// core
import { ThrustrCore as core } from './core';

const app = express();
const router = express.Router();

// register the router with thrustr core
core.resolve().router = router;

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cors
app.use(cors({ origin: '*' }));

// TODO add default prefix
app.use(`/${process.env.API_PREFIX}`, router);

// define Thrustr default welcome message
router.get('/', (_, res) => {
  res.send(`Welcome to the Thrustr API for ${process.env.SITE_NAME}!`)
});

// configure cors
app.use(cors({ origin: '*' }));

// load standard components
import './components'


// exports
export const start = (callback?: () => void) => {  
  // TODO add default port
  app.listen(process.env.PORT, () => {
    console.log(chalk.green(`Thrustr HTTP Interface listening on port ${process.env.PORT}`));

    if (callback) {
      callback();
    }
  })
}