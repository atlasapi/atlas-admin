# Atlas admin

Admininstation front end for Atlas 4.0.

## Setup

Install dependencies

```
npm install && bower install
```

## Run

```
gulp dev
```

Running gulp dev will compile all javascript, scss and also create a server which runs on <http://dev.mbst.tv:8080/#/>

## E2E Tests

### Test config

A config file must be setup in the `tests\login` directory. There is a template file for structure, simply add twitter login details. This is temporary until open am in integrated.

### Run tests

To run the protractor tests you must have a local instance of the app running. Then simply run:

```
gulp protractor
```

This will open up a new chrome window and will run through the front end tests.
