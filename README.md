# Node REST API Starter
I made this because I don't particularly like copying out project structure from each of my projects, constantly forgetting to steal certain pieces, or bring in more than is necessary.
This isn't really something that should be cloned for anything, but rather downloaded and used as a first commit, or even the beginning of a first commit of a project that will host a REST API using Restify.

This is what this project skeleton includes:

1. Docs dependency
2. Tests dependency
3. Linter dependency
4. Code coverage dependency
5. Some tests that make sure that the framework is properly configured.

## Contents

It currently only includes a single controller with a few routes that can be used for testing error handlers.

The application follows a much more object oriented approach than I originally planned, but in the interest of good documentation, it turned out alright.

The `StatusController` is currently laid out so that it can easily be wired up using [Lumina](https://github.com/Eagerod/lumina), if it's required for the project.
If not, it's a little weirdly laid out, and can be modified. 

There is no database dependency, so it's up to you to decide what you want to do with the app's data. 

### Routes

#### Status

- `/status` - Simple status handler that just returns 200
- `/error` - Handler that responds with a restify error.
- `/exception` - Handler that raises an exception that's handled by the restify uncaught exception handler.
- `/echo` - Handler that responds with the body it's given. 

## Docs
```
npm run docs
```
Generates documentation nice and pretty. 
Only recurses through the `src` directory, because most things worthy of documenting should be in there anyways.

## Tests
```
npm test
```
Runs the tests in the `tests` folder with the application in debug mode. 
Comes set up with a few useful tests that can be used to make sure that error handlers are configured.
`test` runs with the debug flag set, which can be used anywhere in code as needed.

## Linter
```
npm run lint
```
Runs the linter on everything other than the output folders for `docs` and `coverage`. 

## Code coverage
```
npm run coverage
```
Runs the tests with the application in debug mode, and outputs the coverage report to a folder called `coverage`.
`coverage` runs with the debug flag set, so it uses the same paths as the normal `npm test` command.
