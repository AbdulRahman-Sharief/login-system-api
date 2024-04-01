<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
a backend login system that I'll use as a boilerplate in my future projects.
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## ⚙️Tech Stack: 

➡️NestJS: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

➡️TypeORM: An Object-Relational Mapping (ORM) library for TypeScript and JavaScript, which works with a variety of SQL databases, including PostgreSQL (as indicated by the "pg" dependency).

➡️Passport.js: A middleware for Node.js used for authentication. It supports various authentication methods and strategies, including JWT, local username/password, OAuth, etc.

➡️bcrypt: A library for hashing passwords securely.

➡️nodemailer: A module for sending emails.

➡️dotenv: A module for loading environment variables from a .env file.

➡️reflect-metadata: A library used for introspecting metadata about classes.

➡️class-transformer and class-validator: Libraries used for transforming plain JavaScript objects to class instances and for input validation, respectively.



## Key features: 

✅allow users to register their with email , username and password.

✅authenticate users' emails via verification tokens sent to their emails.

✅forget password/reset password process with reset tokens sent to user's email in a one-time-link.

✅allow users to fast register and login using google account.

✅ allow users to fast login using github account.

✅all endpoints are protected with different Guards with different strategies.

✅all the project is dockerized.

## Installation

```bash
$ npm install
```
## Add env variables to .env file in the root folder

- `PORT`: your port.
- `DATABASE_URL`: your database URL.
- `DATABASE_DB`: your database name.

- `DATABASE_PASSWORD`: database password.
- `DATABASE_PORT`: database port.
- `DATABASE_USER`: database user.
- `DATABASE_HOST`: database host.

- `AUTH_SECRET`: auth secret.
- `JWT_SECRET`: JWT secret.

- `GITHUB_CLIENT_ID`: GitHub client ID.
- `GITHUB_CLIENT_SECRET`: GitHub client secret.

- `GOOGLE_CLIENT_ID`: Google client ID.
- `GOOGLE_CLIENT_SECRET`: Google client secret.
- `GOOGLE_CALLBACK_URL`: Google callback URL.

- `GITHUB_CALLBACK_URL`: GitHub callback URL.

- `MAIL_HOST`: mail host.
- `MAIL_PORT`: mail port.
- `MAIL_USER`: mail user.
- `MAIL_PASS`: mail pass.

- `TZ`: Africa/Cairo.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
