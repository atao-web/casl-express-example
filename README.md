# Example of CASL integration with Express.js

[CASL](https://stalniy.github.io/casl/) is an isomorphic authorization JavaScript library which restricts what resources a given user is allowed to access.

This example is based on a blog application to show how to integrate [CASL](https://stalniy.github.io/casl/) with an [Express.js](https://expressjs.com) server. Read [CASL in Expressjs app][casl-express-example] for details.

It is quite possible to code with [Typescript](https://www.typescriptlang.org/), [Ecmascript 2018](http://ecma-international.org/ecma-262/9.0/) or even both together, thanks to [Babel 7](https://babeljs.io/docs/en/). See branch [babel7-ts](https://github.com/atao-web/casl-express-example/tree/babel7-ts).

It uses:
* [**M**ongoDB](https://www.mongodb.com): database,
* [**E**xpress.js](https://expressjs.com): backend web application framework running on top of [Node.js](https://nodejs.org),
* [**N**ode.js](https://nodejs.org): JavaScript runtime environment – lets you implement your application back-end in JavaScript.

Other tools and technologies used:
* [Mongoose.js](https://mongoosejs.com): MongoDB object modeling,
* [Passport](http://www.passportjs.org) with [JWT]([JSON Web Token](https://jwt.io)): authentication,
* and indeed [CASL](https://stalniy.github.io/casl/): authorization.

## Code outlines

There are 3 entities:
* User
* Post
* Comment

Permission logic (i.e., abilities) are define in `src/auth/abilities.js`. Rules can be specified for authenticated and anonymous users, so potentially it's quite easy to give access anonymous users to leave comments in blog.
The main logic is built on top of modules (`src/modules`)

**Note**: refactored to use CASL 2.0. See [@casl/ability][casl-ability] and [@casl/mongoose][casl-mongoose] for details.
**Warning**: this code is just an example and doesn't follow best practices everywhere (e.g. it stores passwords without hashing).

**Note #2**: in order to use [Vuex example](https://github.com/stalniy/casl-vue-api-example) switch to branch [vue-api](https://github.com/stalniy/casl-express-example/tree/vue-api).

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/download/)
* [Npm](https://www.npmjs.com/) - comes with Node.js
* [MongoDB](https://www.mongodb.com/download-center/community)

Check prerequisites' status:
```bash
git --version
mongod --version
node --version
npm --version 
```

## Installation

The shell used here is [Bash](https://www.gnu.org/software/bash/) under [Linux](https://www.linuxfoundation.org/). However it should be straightforward to work under any other usual OS as eg Windows:
* [npm](https://www.npmjs.com/) scripts should work as it,
* query instructions below (using [curl](https://curl.haxx.se/)) should be easy to adapt.

[MongoDB](https://www.mongodb.com) must be at least installed on the workstation, if not running:

* the script *`start`* will use a `blog` database on an already running instance of Mongo with URL `mongodb://localhost:27017/blog`
* the script *`dev`* will start a dedicated instance, eg:

```bash
git clone https://github.com/atao-web/casl-express-example.git && cd casl-express-example

npm install
npm run mongo:bson2json # allow to fill embedded database if empty (in development mode)
npm run dev
```

## Instruction to login

To call the API endpoints, [curl](https://curl.haxx.se/) will be used as client (°), with some other tools for conveniency, ie:
* [json-parse-cli](https://www.npmjs.com/package/json-parse-cli), 
* [jq](https://stedolan.github.io/jq/). 

> The query reponses are provided as a guide.

> (°) An alternative would be [Postman](https://www.getpostman.com/).

### 1. Create new user

```bash

NEW_USER=$(curl -X POST "http://localhost:3002/users" -H "Content-Type: application/json" -d '{"user":{"email":"dummy@alavista.bl","password":"dummy"}}' -w '\n' -sSv)
# Trying ::1...
# * TCP_NODELAY set
# * Connected to localhost (::1) port 3002 (#0)
# > POST /users HTTP/1.1
# > Host: localhost:3002
# > User-Agent: curl/7.58.0
# > Accept: */*
# > Content-Type: application/json
# > Content-Length: 57
# > 
# } [57 bytes data]
# * upload completely sent off: 57 out of 57 bytes
# < HTTP/1.1 201 Created
# < Content-Type: application/json; charset=utf-8
# < Content-Length: 175
# < ETag: W/"af-NyhVk/npqNDaY6rka7B9jXGeOG4"
# < Date: Sun, 08 Dec 2019 07:19:32 GMT
# < Connection: keep-alive
# < 
# { [175 bytes data]
# * Connection #0 to host localhost left intact


echo $NEW_USER | json-parse -f json -i 4
# {
#     "user": {
#         "_id": "5deca4047f1bda6e3127d7f3",
#         "__t": "UserInput",
#         "email": "dummy@alavista.bl",
#         "createdAt": "2019-12-08T07:19:32.321Z",
#         "updatedAt": "2019-12-08T07:19:32.321Z",
#         "__v": 0
#     }
# }

USER_ID=$(echo $NEW_USER | jq -r '.user._id')

echo $USER_ID
# 5deca4047f1bda6e3127d7f3

```

### 2. Create new session

```bash
SESSION=$(curl -H "Content-Type: application/json" -d '{"session":{"email":"dummy@alavista.bl","password":"dummy"}}' -X POST "http://localhost:3002/session" -w '\n' -sSv)
# *   Trying ::1...
# * TCP_NODELAY set
# * Connected to localhost (::1) port 3002 (#0)
# > POST /session HTTP/1.1
# > Host: localhost:3002
# > User-Agent: curl/7.58.0
# > Accept: */*
# > Content-Type: application/json
# > Content-Length: 60
# > 
# } [60 bytes data]
# * upload completely sent off: 60 out of 60 bytes
# < HTTP/1.1 200 OK
# < Content-Type: application/json; charset=utf-8
# < Content-Length: 308
# < ETag: W/"134-MOZtklZhtqZRdW2EStJ5NM2wS2I"
# < Date: Sun, 08 Dec 2019 07:19:32 GMT
# < Connection: keep-alive
# < 
# { [308 bytes data]
# * Connection #0 to host localhost left intact

echo $SESSION | json-parse -f json -i 4
# {
#     "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzYzOTQzNzIsImlkIjoiNWRlY2E0MDQ3ZjFiZGE2ZTMxMjdkN2YzIiwiaWF0IjoxNTc1Nzg5NTcyLCJhdWQiOiJjYXNsLmlvIiwiaXNzIjoiQ0FTTC5FeHByZXNzIn0.spW_RyEtpsj9W_NuHJ0mTM-ddhPX8xJyx8jGsKWbaoE",
#     "expires": "2019-12-15T08:19:32+01:00",
#     "user": "5deca4047f1bda6e3127d7f3"
# }

ACCESS_TOKEN=$(echo $SESSION | jq -r '.token')

echo $ACCESS_TOKEN
# JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzYzOTQzNzIsImlkIjoiNWRlY2E0MDQ3ZjFiZGE2ZTMxMjdkN2YzIiwiaWF0IjoxNTc1Nzg5NTcyLCJhdWQiOiJjYXNsLmlvIiwiaXNzIjoiQ0FTTC5FeHByZXNzIn0.spW_RyEtpsj9W_NuHJ0mTM-ddhPX8xJyx8jGsKWbaoE

```

### 3. Put access token in `Authorization` header for all future requests

Available entry points:
* /posts
* /posts/:id/comments
* /users
* /session

To create or update an entity you need to send parameters in wrapper object, which key equals entity name.
For example, to get current user data:

```bash 

curl -X GET "http://localhost:3002/users/$USER_ID" -H "Authorization: $ACCESS_TOKEN" -H "Content-Type: application/json" -w '\n' -sS | json-parse -f json -i 4
# {
#     "user": {
#         "__t": "UserInput",
#         "_id": "5deca4047f1bda6e3127d7f3",
#         "email": "dummy@alavista.bl",
#         "createdAt": "2019-12-08T07:19:32.321Z",
#         "updatedAt": "2019-12-08T07:19:32.321Z",
#         "__v": 0
#     }
# }

```

To create a comment on a existing post:

```bash

curl -X POST "http://localhost:3002/posts/59761ba80203fb638e9bd85c/comments" -H "Content-Type: application/json" -H "Authorization: $ACCESS_TOKEN" -d '{"comment":{"text":"Ouahh ... Too good!"}}' -w '\n' -sS | json-parse -f json -i 4
# {
#     "comment": {
#         "_id": "5deca4047f1bda6e3127d7f4",
#         "text": "Ouahh ... Too good!",
#         "post": "59761ba80203fb638e9bd85c",
#         "author": "5deca4047f1bda6e3127d7f3",
#         "createdAt": "2019-12-08T07:19:32.964Z",
#         "updatedAt": "2019-12-08T07:19:32.964Z",
#         "__v": 0
#     }
# }

curl -X GET "http://localhost:3002/posts/59761ba80203fb638e9bd85c/comments" -H "Content-Type: application/json" -w '\n' -sS | json-parse -f json -i 4
# {
#     "comments": [
#         {
#             "_id": "59763c7f6882927829c9265e",
#             "updatedAt": "2017-07-24T18:29:19.646Z",
#             "createdAt": "2017-07-24T18:29:19.646Z",
#             "text": "[Updated] opa?",
#             "post": "59761ba80203fb638e9bd85c",
#             "author": "5975b833a9c0631a35509bbf",
#             "__v": 0
#         },
#         {
#             "_id": "5deca4047f1bda6e3127d7f4",
#             "text": "Ouahh ... Too good!",
#             "post": "59761ba80203fb638e9bd85c",
#             "author": "5deca4047f1bda6e3127d7f3",
#             "createdAt": "2019-12-08T07:19:32.964Z",
#             "updatedAt": "2019-12-08T07:19:32.964Z",
#             "__v": 0
#         }
#     ]
# }

curl -X PATCH "http://localhost:3002/posts/59761ba80203fb638e9bd85c" -H "Content-Type: application/json" -H "Authorization: $ACCESS_TOKEN" -d '{"post":{"title":"Some changes"}}' -w '\n' -sS | json-parse -f json -i 4
# {
#     "status": "forbidden",
#     "message": "Cannot execute \"update\" on \"Post\""
# }

POST_CREATE=$(curl -X POST "http://localhost:3002/posts/" -H "Content-Type: application/json" -H "Authorization: $ACCESS_TOKEN" -d '{"post":{"title":"Yet a first article...","text":"Ouahh ... Too good!"}}' -w '\n' -sSv)
# *   Trying ::1...
# * TCP_NODELAY set
# * Connected to localhost (::1) port 3002 (#0)
# > POST /posts/ HTTP/1.1
# > Host: localhost:3002
# > User-Agent: curl/7.58.0
# > Accept: */*
# > Content-Type: application/json
# > Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzYzOTQzNzIsImlkIjoiNWRlY2E0MDQ3ZjFiZGE2ZTMxMjdkN2YzIiwiaWF0IjoxNTc1Nzg5NTcyLCJhdWQiOiJjYXNsLmlvIiwiaXNzIjoiQ0FTTC5FeHByZXNzIn0.spW_RyEtpsj9W_NuHJ0mTM-ddhPX8xJyx8jGsKWbaoE
# > Content-Length: 72
# > 
# } [72 bytes data]
# * upload completely sent off: 72 out of 72 bytes
# < HTTP/1.1 200 OK
# < Content-Type: application/json; charset=utf-8
# < Content-Length: 227
# < ETag: W/"e3-ETQSumjsO+QfJiRaEE0XK4j2BYA"
# < Date: Sun, 08 Dec 2019 07:19:33 GMT
# < Connection: keep-alive
# < 
# { [227 bytes data]
# * Connection #0 to host localhost left intact

echo $POST_CREATE | json-parse -f json -i 4
# {
#     "post": {
#         "_id": "5deca4057f1bda6e3127d7f6",
#         "title": "Yet a first article...",
#         "text": "Ouahh ... Too good!",
#         "author": "5deca4047f1bda6e3127d7f3",
#         "createdAt": "2019-12-08T07:19:33.293Z",
#         "updatedAt": "2019-12-08T07:19:33.293Z",
#         "__v": 0
#     }
# }

curl -X PATCH "http://localhost:3002/posts/$POST_ID" -H "Content-Type: application/json" -H "Authorization: $ACCESS_TOKEN" -d '{"post":{"title":"Some changes"}}' -w '\n' -sS | json-parse -f json -i 4
# {
#     "post": {
#         "_id": "5deca4057f1bda6e3127d7f6",
#         "title": "Some changes",
#         "text": "Ouahh ... Too good!",
#         "author": "5deca4047f1bda6e3127d7f3",
#         "createdAt": "2019-12-08T07:19:33.293Z",
#         "updatedAt": "2019-12-08T07:19:33.435Z",
#         "__v": 0
#     }
# }

```

## References

* [casl-express-example](https://medium.com/@sergiy.stotskiy/authorization-with-casl-in-express-app-d94eb2e2b73b)
* [casl-ability](https://github.com/stalniy/casl/tree/master/packages/casl-ability)
* [casl-mongoose](https://github.com/stalniy/casl/tree/master/packages/casl-mongoose)

## License

[MIT License](https://opensource.org/licenses/MIT). See [LICENSE](LICENSE).

## Credits

* [What is CASL or how can you build a castle around your application? 🏰](https://medium.com/dailyjs/what-is-casl-or-how-can-you-build-a-castle-around-your-application-4d2daa0b1ab4), Sergii Stotskyi, Jul 27, 2017

* [Using ESLint and Prettier in a TypeScript Project](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project), Robert Cooper, October 06, 2019

* [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/), by Matt Turnbull, Last updated: Feb 12 (2019)

* [TypeScript and Babel 7](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/), Daniel Rosenwasser, August 27th, 2018

* [Token based authentication in Node.js with Passport, JWT and bcrypt](https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/), Jonathas Ribeiro,  October 21, 2017.
