# Warriors Web Design Final Project

This project is books store app using Google books api with MEAN stack.

## Installation
1. Clone or download code to your local.
2. Direct to your local folder.
3. Run `npm install` to install all the dependencies.
4 Run `npm run web` for a dev server. Then you can open the page on: [http://localhost:3000/](http://localhost:3000/).
5. Run `npm run debug` for a debug dev server. Navigate to [http://localhost:3000/](http://localhost:3000/). And you can use chrome debug tools to debug backEnd for this app.

## Features and Functions
1. Display and Search books.
2. Sort and Filter books. User has ability to sort or filter books by using our app.
3. Add books to shopping cart.
4. Authentication, user have to login before the checkout. We are using Auth0 for user authentication.
5. Edit shopping cart. Includes add, remove, edit and checkout.
6. Cloud: all the data we are saving to mLab, which is a cloud mongoDB server.
7. Security: On backEnd we are using Middleware to protect our apis. For some Api we require user to login, other wise user can not get the data. On frontEnd, we are using Auth Guard to protect our router links, for some url, user have to log in.

## Code scaffolding

Run `ng g component components/<name> ---module ../app` to generate a new component. 

Run `ng g service services/<name>` to generate a new service.

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `public/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## CSS Framework - ngx-bootstrap

[Documentation: https://valor-software.com/ngx-bootstrap/#/getting-started](https://valor-software.com/ngx-bootstrap/#/getting-started)

## Further help & References

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Take `https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli` as a reference.

`https://auth0.com/blog/real-world-angular-series-part-1/` Very good resource.
