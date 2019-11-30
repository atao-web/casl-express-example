import { argv, env, exit } from 'process';

import { waitOnMongo } from './waiton-mongo';

// const MONGO_URL = argv[2] || env.MONGO_URL;
const MONGO_PORT = +(env.MONGO_PORT || 27017);
const MONGO_HOST = env.MONGO_HOST || "localhost";
const MONGO_DB_NAME = env.MONGO_DB_NAME || "demoaktea";
const TIMEOUT = +(argv[3] || env.TIMEOUT);

// const url = MONGO_URL ? MONGO_URL : config.mongodb.url;
const url = [
    'mongodb://',
    MONGO_HOST,
    ':',
    MONGO_PORT,
    '/',
    (env.NODE_ENV === 'test' && env.MONGO_TEST_DB_NAME && env.MONGO_TEST_DB_NAME.trim()) ? env.MONGO_TEST_DB_NAME.trim() : MONGO_DB_NAME
].join('');

if (!url) {
    console.error("MONGO_URL is not provided either as first paramater or as env variable, or through MONGO_HOST");
    exit(1);
}

const options = (TIMEOUT != null) ? { timeout: TIMEOUT } : undefined;

waitOnMongo(url, options, (error: Error) => {
    if (error) {
        throw error;
    }

    console.log('Mongo is running: connected with success');
    exit(0);

});
