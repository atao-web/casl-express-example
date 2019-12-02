import { env } from 'process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import express from 'express';
import { json, urlencoded } from 'express';
import 'express-async-errors';

import { plugin, connect } from 'mongoose';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import { errorHandler } from './error-handler';
import { Model, Document } from 'mongoose';

const MONGO_PORT = env.MONGO_PORT || '27017';
const MONGO_HOST = env.MONGO_HOST || 'localhost';
const MONGO_DB_NAME = env.MONGO_DB_NAME || 'blog';

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

export async function createApp () {
  const app = express();

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true }));
  app.disable('x-powered-by');

  plugin(accessibleRecordsPlugin);

  const models: Model<Document, {}>[] = [];
  for (const moduleName of MODULES) {
    const appModule = await import(`./modules/${moduleName}`);

    if (typeof appModule.configure === 'function') {
      appModule.configure(app);
    }
    if (appModule.model) {
      models.push(appModule.model);
    }
  };

  app.use(errorHandler);

  await connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`, MONGOOSE_OPTIONS);
  loadFixtures(models);
  return app;

};

function loadFixtures (models: Model<Document, {}>[]) {
  models.forEach((model: Model<Document, {}>) => {

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

function caslReviver (key: string, value: any) {
  if (value["$date"]) {
    return value["$date"];
  }
  if (value['$oid']) {
    return value["$oid"];
  }
  return value;
}
