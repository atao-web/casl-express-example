import { MongoClient, MongoClientOptions } from 'mongodb';

const TIME_INC = 2000; // 2 secondes
const DEFAULT_TIMEOUT = 1000 * 60 * 2; // 2 minutes;

const MONGO_OPTIONS: MongoClientOptions = {
  poolSize: 1,
  readPreference: 'primary',
  useNewUrlParser: true
};

export function waitOnMongo(mongoUrl: string, options: { timeout?: number } = {}, callback = (error?: Error, data?: any) => { }) {

  options.timeout = options.timeout || DEFAULT_TIMEOUT;

  const startTime = new Date().getTime();

  var timeoutHandler = setTimeout(() => {
    this.timeout = true;
    callback(new Error('TIMEOUT_WAITING_OUT_MONGO'));
  }, options.timeout);

  var timeout = false;
  connectAgain();

  function connectAgain() {
    MongoClient.connect(mongoUrl, MONGO_OPTIONS, function (err, db) {
      if (timeout) {
        return;
      }
      if (err) {
        console.log('wait-on-mongo: ' + err.message);
        setTimeout(connectAgain, TIME_INC);
        return;
      }

      clearTimeout(timeoutHandler);
      timeoutHandler = null;
      db.close();
      const endTime = new Date().getTime() - startTime;
      console.log("wait-on-mongo: waited %sms", endTime);
      callback(null, endTime);

    });
  }
}
