# Example of CASL integration in expressjs app

Read [CASL in Expressjs app][casl-express-example] for details.

[CASL](https://stalniy.github.io/casl/) is an isomorphic authorization JavaScript library which restricts what resources a given user is allowed to access.

This is an example application which shows how integrate CASL in blog application. There are 3 entities:
* User
* Post
* Comment

Application uses `passport-jwt` for authentication.
Permission logic (i.e., abilities) are define in `src/auth/abilities.js`. Rules can be specified for authenticated and anonymous users, so potentially it's quite easy to give access anonymous users to leave comments in blog.
The main logic is built on top of modules (`src/modules`)

**Note**: refactored to use CASL 2.0. See [@casl/ability][casl-ability] and [@casl/mongoose][casl-mongoose] for details.
**Warning**: this code is just an example and doesn't follow best practices everywhere (e.g. it stores passwords without hashing).

**Note #2**: in order to use [Vuex example](https://github.com/stalniy/casl-vue-api-example) switch to branch [vue-api](https://github.com/stalniy/casl-express-example/tree/vue-api).

**Note #3**: branch [babel7-ts](https://github.com/atao-web/casl-express-example/tree/babel7-ts) is setup to be agnostic: [Typescript](https://www.typescriptlang.org/) and [Ecmascript 2018](http://ecma-international.org/ecma-262/9.0/) can be used alike, even both together, thanks to [Babel 7](https://babeljs.io/docs/en/).

## Installation

The shell used here is [Bash](https://www.gnu.org/software/bash/) under [Linux](https://www.linuxfoundation.org/). However under any other usual OS as eg Windows:
* the [npm](https://www.npmjs.com/) scripts should work as it,
* the adaptation of query instructions below (using [curl](https://curl.haxx.se/)) should be straightforward.

Mongodb must be at least installed on the workstation, if not running:

* the script *`start`* will use a `blog` database on an already running instance of Mongo with URL `mongodb://localhost:27017/blog`
* the script *`dev`* will start a dedicated instance, eg:

```bash
git clone https://github.com/atao-web/casl-express-example.git && cd casl-express-example

npm install
npm run mongo:bson2json # allow to fill embedded database if empty (in development mode)
npm run dev
```

## Instruction to login

Used tools: [curl](https://curl.haxx.se/), [json-parse-cli
](https://www.npmjs.com/package/json-parse-cli), [jq](https://stedolan.github.io/jq/). This tools are just convenient for this presentation and in no way required to run the application.

1. Create new user

```bash

NEW_USER=$(curl -X POST "http://localhost:3002/users" -H "Content-Type: application/json" -d '{"user":{"email":"dummy@alavista.bl","password":"dummy"}}' -w '\n' -sS)

echo $NEW_USER | json-parse -f json -i 4
# {
#     "user": {
#         "_id": "5de0b86f76ce2519553449ef",
#         "email": "dummy@alavista.bl",
#         "password": "dummy",
#         "createdAt": "2019-11-29T06:19:27.205Z",
#         "updatedAt": "2019-11-29T06:19:27.205Z",
#         "__v": 0
#     }
# }

ID_USER=$(echo $NEW_USER | jq -r '.user._id')

echo $ID_USER
# 5de0b86f76ce2519553449ef

```

2. Create new session

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
# < Content-Length: 215
# < ETag: W/"d7-fol5aTHrxD40x6Yndb/BHRazDEU"
# < Date: Fri, 29 Nov 2019 06:20:42 GMT
# < Connection: keep-alive
# < 
# { [215 bytes data]
# * Connection #0 to host localhost left intact

echo $SESSION | json-parse -f json -i 4
# {
#     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZTBiODZmNzZjZTI1MTk1NTM0NDllZiIsImlhdCI6MTU3NTAwODQ0MiwiYXVkIjoiY2FzbC5pbyIsImlzcyI6IkNBU0wuRXhwcmVzcyJ9.Y_y_lGgOm9UP3c1T6-CLVEVC4YpCZjOjdkox9L9WUuU"
# }

ACCESS_TOKEN=$(echo $SESSION | jq -r '.accessToken')

echo $ACCESS_TOKEN
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZTBiODZmNzZjZTI1MTk1NTM0NDllZiIsImlhdCI6MTU3NTAwODQ0MiwiYXVkIjoiY2FzbC5pbyIsImlzcyI6IkNBU0wuRXhwcmVzcyJ9.Y_y_lGgOm9UP3c1T6-CLVEVC4YpCZjOjdkox9L9WUuU

```

3. Put access token in `Authorization` header for all future requests

Available entry points:
* /posts
* /posts/:id/comments
* /users
* /session

To create or update an entity you need to send parameters in wrapper object, which key equals entity name.
For example, to get current user data:

```bash 

curl -X GET "http://localhost:3002/users/$ID_USER" -H "Authorization: $ACCESS_TOKEN" -H "Content-Type: application/json" -w '\n' -sS | json-parse -f json -i 4
# {
#     "user": {
#         "_id": "5de0b86f76ce2519553449ef",
#         "email": "dummy@alavista.bl",
#         "password": "dummy",
#         "createdAt": "2019-11-29T06:19:27.205Z",
#         "updatedAt": "2019-11-29T06:19:27.205Z",
#         "__v": 0
#     }
# }

```

To create a comment on a existing post:

```bash

curl -X POST "http://localhost:3002/posts/59761ba80203fb638e9bd85c/comments" -H "Content-Type: application/json" -H "Authorization: $ACCESS_TOKEN" -d '{"comment":{"text":"Ouahh ... Too good!"}}' -w '\n' -sS | json-parse -f json -i 4
# {
#     "comment": {
#         "_id": "5de0b92676ce2519553449f0",
#         "text": "Ouahh ... Too good!",
#         "post": "59761ba80203fb638e9bd85c",
#         "author": "5de0b86f76ce2519553449ef",
#         "createdAt": "2019-11-29T06:22:30.427Z",
#         "updatedAt": "2019-11-29T06:22:30.427Z",
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
#             "_id": "5de0b92676ce2519553449f0",
#             "text": "Ouahh ... Too good!",
#             "post": "59761ba80203fb638e9bd85c",
#             "author": "5de0b86f76ce2519553449ef",
#             "createdAt": "2019-11-29T06:22:30.427Z",
#             "updatedAt": "2019-11-29T06:22:30.427Z",
#             "__v": 0
#         }
#     ]
# }

```

## References

* [casl-express-example](https://medium.com/@sergiy.stotskiy/authorization-with-casl-in-express-app-d94eb2e2b73b)
* [casl-ability](https://github.com/stalniy/casl/tree/master/packages/casl-ability)
* [casl-mongoose](https://github.com/stalniy/casl/tree/master/packages/casl-mongoose)

## License

[MIT License](https://opensource.org/licenses/MIT). See [LICENSE](LICENSE).

