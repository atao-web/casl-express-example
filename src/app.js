const process = require('process');
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');

const express = require('express');
const { json, urlencoded } = require('express');
require('express-async-errors');

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

const FIXT_DIR = 'src/fixtures';

const FIXT_FILE_EXT = '.json';

const FIXTURES = {
  'Comment': 'comments',
  'Post': 'posts',
  'User': 'users'
};

const MODULES = ['auth', ...Object.values(FIXTURES)];

module.exports = function createApp() {
  const app = express();

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true }));
  app.disable('x-powered-by');

  mongoose.plugin(accessibleRecordsPlugin);

  const models = MODULES.reduce((modelList, moduleName) => {
    const appModule = require(`./modules/${moduleName}`);

    if (typeof appModule.configure === 'function') {
      appModule.configure(app);
    }
    if (appModule.model) {
      modelList.push(appModule.model);
    }
    return modelList;
  }, []);

  app.use(errorHandler);

  mongoose.Promise = global.Promise;
  return mongoose.connect(
    `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
    MONGOOSE_OPTIONS)
    .then(() => {
      loadFixtures(models);
      return app;
    });
    
};

function loadFixtures(models) {
  models.forEach(model => {

    model.find({}, (error, data) => {
      if (error) {
        throw new Error(`Mongo error as asking for '${model.modelName}' data: ` + JSON.stringify(error));
      }
      if (data && data.length > 0) {
        console.log(`Development or stage phase, Mongo '${model.modelName}' data: ${data.length} already existing`);
        return;
      }
      const fixturePath = resolve(FIXT_DIR, FIXTURES[model.modelName] + FIXT_FILE_EXT);
      const fileContent = existsSync(fixturePath) ? readFileSync(fixturePath, 'utf8') : null;
      const initData = fileContent ? JSON.parse(fileContent, caslReviver) : null;
      if (!initData || initData.length < 1) {
        console.error(`Development or stage phase: no data available to create any ${model.modelName}`);
        return;
      }

      console.log(`Development or stage phase, creating '${model.modelName}' documents: ${initData.length}`);
      initData.forEach((item) => {
        new model(item).save();
      });
    })
  });
}

function caslReviver(key, value) {
  if (value["$date"]) {
    return value["$date"];
  }
  if (value['$oid']) {
    return value["$oid"];
  }
  return value;
}
