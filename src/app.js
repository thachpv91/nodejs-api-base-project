import express from 'express';
import chalk from 'chalk';
import config from 'config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import passport from 'passport';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import cors from 'cors';
import './database';
import errorLogger from './middlewares/error-logger';
import errorHandler from './middlewares/error-handler';

import winstonInstance from './winston';
import apiV1 from './api/v1';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(helmet());
app.use(cors());
if (isDev && !isTest) {
  app.use(morgan('dev'));
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true,
    }),
  );
} else {
    app.use(morgan('combined'));
}

// Add the apiRoutes stack to the server
app.use('/api/v1', apiV1);

app.use(errorLogger);
app.use(errorHandler());

// We need this to make sure we don't run a second instance
if (!module.parent) {
  app.listen(config.get('port'), err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(chalk.red('Cannot run!'));
    } else {
      // eslint-disable-next-line no-console
      console.log(
        chalk.green.bold(
          `
        Yep this is working 🍺
        App listen on: ${config.get('host')}:${config.get('port')} 🍕
        Env: ${process.env.NODE_ENV} 🦄
      `,
        ),
      );
    }
  });
}

export default app;
