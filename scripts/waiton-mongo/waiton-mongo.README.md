wait-on-mongo
==============

Simple utility which waits until mongodb comes online

## Usage

### As a Command Line tool

~~~
ts-node waiton-mongo-cli.ts <mongo url> <timeout millies>
~~~

Or

~~~
export MONGO_URL=<mongo url>
export TIMEOUT=<timeout millies>
ts-node waiton-mongo-cli.ts
~~~

### As a NodeJS module

See [waiton-mongo-cli](./waiton-mongo-cli.ts)

### Credits & License

[mkg20001/wait-for-mongo](https://github.com/mkg20001/wait-for-mongo)

License MIT
