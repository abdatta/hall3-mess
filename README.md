# Hall 3 Mess Automation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

## Installation

- Install node.js and mongoDB, if not installed already.
- Run `git clone https://github.com/abdatta/hall3-mess.git` to clone the repo.
- Run `cd hall3-mess && npm install` to install dependencies for the Angular frontend.
- Run `cd server && npm install` to install dependencies for the Node.js backend.
- [Optional] From the `server` directory, run `mongorestore --db Hall3_Mess mock_db/` to load a sample mock database.

- Ask for the missing `local.config.ts` file from any of the contributors and put it inside the folder `/server/src/config`.
- Run `npm start` from the root of the repository, and there you go!

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:8000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build (only for Production)

Run `npm run prod` to build the project for production. The build artifacts will be stored in the `mess-build/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
