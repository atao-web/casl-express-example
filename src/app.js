const process = require('process');

const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { accessibleRecordsPlugin } = require('@casl/mongoose');
const errorHandler = require('./error-handler');

const MONGO_PORT = process.env.MONGO_PORT || '27017';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'blog';

const MONGOOSE_OPTIONS = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const MODULES = ['auth', 'comments', 'posts', 'users'];

module.exports = function createApp() {
  const app = express();

  mongoose.plugin(accessibleRecordsPlugin);
  app.use(bodyParser.json());

  MODULES.forEach((moduleName) => {
    const appModule = require(`./modules/${moduleName}`);

    if (typeof appModule.configure === 'function') {
      appModule.configure(app);
    }
  });

  app.use(errorHandler);

  mongoose.Promise = global.Promise;
  return mongoose.connect(
    `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
    MONGOOSE_OPTIONS)
    .then(() => app);
};
