/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // for parsing application/json

// websockets
const http = require('http').createServer(app);
require('./socket').default(http);

// init scorekeepr api
const connection = require('./database').default;
connection.init();

const scorekeeprApi = require('./api/router');
app.use('/api', scorekeeprApi);

// todo: move this to another file
const { handleGracefully } = require('./database');
const { Game } = require('./models/game');
const { scorekeeprBaseUrl } = require('./global-config');

app.get('/g/:shareId', (req, res) => {
  Game.findOne({
    shareId: req.params.shareId,
  }, (err, result) => {
    handleGracefully(res, err, result, () => {
      res.redirect(301, `${scorekeeprBaseUrl}games/${result._id}`); // eslint-disable-line no-underscore-dangle
    });
  });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  if (res.headersSent) {
    next(err);
  }

  res.send(500, 'Something broke!');
});


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
http.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
