# Nestjs GraphQL Best Practice
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

> ### NestJS (Express + Typeorm) codebase containing real world examples (CRUD, auth, advanced patterns, etc).

[![Build Status](https://travis-ci.org/chnirt/nestjs-graphql-best-practice.svg?branch=cicd)](https://travis-ci.org/chnirt/nestjs-graphql-best-practice)
[![CircleCI](https://circleci.com/gh/chnirt/nestjs-graphql-best-practice/tree/cicd.svg?style=svg)](https://circleci.com/gh/chnirt/nestjs-graphql-best-practice/tree/cicd)
[![Known Vulnerabilities](https://snyk.io//test/github/chnirt/nestjs-graphql-best-practice/badge.svg?targetFile=package.json)](https://snyk.io//test/github/chnirt/nestjs-graphql-best-practice?targetFile=package.json) [![Greenkeeper badge](https://badges.greenkeeper.io/chnirt/nestjs-graphql-best-practice.svg)](https://greenkeeper.io/)

<h1 align="center">
  <img src="src/assets/images/project-logo.png" alt="Node.js Best Practices">
</h1>

## Table of Contents

- [Nestjs GraphQL Best Practice](#nestjs-graphql-best-practice)
  - [Table of Contents](#table-of-contents)
  - [Function](#function)
  - [Usage](#usage)
  - [Starting the Server](#starting-the-server)
- [Node.js Best Practices](#nodejs-best-practices)
    - [1. Project Structure Practices](#1-project-structure-practices)
    - [2. Error Handling Practices](#2-error-handling-practices)
    - [3. Code Style Practices](#3-code-style-practices)
    - [4. Testing And Overall Quality Practices](#4-testing-and-overall-quality-practices)
    - [5. Going To Production Practices](#5-going-to-production-practices)
    - [6. Security Best Practices](#6-security-best-practices)
    - [7. Performance Best Practices](#7-performance-best-practices)

## Function

1. Dynamic import
2. Authenticate with jsonwebtoken ( access-token, refresh-token )
3. Upload file with cloudinary
4. Send mail with nodemailer
5. Task scheduler with timeout, interval, cron
6. Unit, e2e, coverage testing
7. Logger ( wiston )

## Usage

1. Clone repository

```
  git clone https://github.com/chnirt/nestjs-graphql-best-practice.git
```

2. Cd into directory

```
  cd nestjs-graphql-best-practice/
```

3. Create .env

```
  touch .env
```

4. Add to .env

```
  PORT=<yourport>
```

5. Install dependencies using npm

```
  npm i
```

## Starting the Server

1. Generate graphql.schema.ts

```
  npm run gen
```

2. Start in development

```
  npm run start:dev
```

# Node.js Best Practices

<h1 align="center">
  <img src="src/assets/images/banner-2.jpg" alt="Node.js Best Practices">
</h1>

### 1. Project Structure Practices

[✔️] 1.1 Structure your solution by components

[✔️] 1.2 Layer your components, keep Express within its boundaries

[✔️] 1.3 Wrap common utilities as npm packages

[❌] No neccessary - 1.4 Separate Express 'app' and 'server'

[✔️] 1.5 Use environment aware, secure and hierarchical config

### 2. Error Handling Practices

[✔️] 2.1 Use Async-Await or promises for async error handling

[✔️] 2.2 Use only the built-in Error object

![❔] 2.3 Distinguish operational vs programmer errors

[✔️] 2.4 Handle errors centrally, not within an Express middleware

[✔️] 2.5 Document API errors using Swagger or GraphQL

![❔] 2.6 Exit the process gracefully when a stranger comes to town

[✔️] 2.7 Use a mature logger to increase error visibility

[✔️️] use Jest - 2.8 Test error flows using your favorite test framework

![❔] 2.9 Discover errors and downtime using APM products

![❔] 2.10 Catch unhandled promise rejections

[✔️] 2.11 Fail fast, validate arguments using a dedicated library

### 3. Code Style Practices

[❌] No neccessary - 3.1 Use ESLint

[❔] 3.2 Node.js specific plugins

[✔️] 3.3 Start a Codeblock's Curly Braces on the Same Line

[✔️] 3.4 Separate your statements properly

[✔️] 3.5 Name your functions

[✔️] 3.6 Use naming conventions for variables, constants, functions and classes

[✔️] 3.7 Prefer const over let. Ditch the var

[✔️] 3.8 Require modules first, not inside functions

[✔️] Nest must import files directly - 3.9 Require modules by folders, opposed to the files directly

[✔️] 3.10 Use the `===` operator

[✔️] 3.11 Use Async Await, avoid callbacks

[✔️] 3.12 Use arrow function expressions (=>)

### 4. Testing And Overall Quality Practices

[✔️] 4.1 At the very least, write API (component) testing

[✔️] use Jest - 4.2 Include 3 parts in each test name

[✔️] use Jest - 4.3 Structure tests by the AAA pattern

[✔️] 4.4 Detect code issues with a linter

[〽️] use Jest - 4.5 Avoid global test fixtures and seeds, add data per-test

![❔] 4.6 Constantly inspect for vulnerable dependencies

![❔] 4.7 Tag your tests

[✔️] 4.8 Check your test coverage, it helps to identify wrong test patterns

![❔] 4.9 Inspect for outdated packages

[✔️] 4.10 Use production-like env for e2e testing

[✔️] 4.11 Refactor regularly using static analysis tools

[✔️] 4.12 Carefully choose your CI platform (Jenkins vs CircleCI vs Travis vs Rest of the world)

### 5. Going To Production Practices

![❔] 5.1. Monitoring!

![❔] 5.2. Increase transparency using smart logging

![❔] 5.3. Delegate anything possible (e.g. gzip, SSL) to a reverse proxy

[✔️] 5.4. Lock dependencies

![❔] 5.5. Guard process uptime using the right tool

[✔️] 5.6. Utilize all CPU cores

[✔️] 5.7. Create a ‘maintenance endpoint’

![❔] 5.8. Discover errors and downtime using APM products

[✔️] 5.9. Make your code production-ready

![❔] 5.10. Measure and guard the memory usage

![❔] 5.11. Get your frontend assets out of Node

![❔] 5.12. Be stateless, kill your servers almost every day

![❔] 5.13. Use tools that automatically detect vulnerabilities

![❔] 5.14. Assign a transaction id to each log statement

[✔️] 5.15. Set NODE_ENV=production

![❔] 5.16. Design automated, atomic and zero-downtime deployments

![❔] 5.17. Use an LTS release of Node.js

![❔] 5.18. Don't route logs within the app

### 6. Security Best Practices

[✔️] 6.1. Embrace linter security rules

[✔️] 6.2. Limit concurrent requests using a middleware

[✔️] 6.3 Extract secrets from config files or use packages to encrypt them

[✔️] 6.4. Prevent query injection vulnerabilities with ORM/ODM libraries

![❔] 6.5. Collection of generic security best practices

[✔️] 6.6. Adjust the HTTP response headers for enhanced security

![❔] 6.7. Constantly and automatically inspect for vulnerable dependencies

[✔️] 6.8. Avoid using the Node.js crypto library for handling passwords, use Bcrypt

![❔] 6.9. Escape HTML, JS and CSS output

[✔️] 6.10. Validate incoming JSON schemas

![❔] 6.11. Support blacklisting JWTs

![❔] 6.12. Prevent brute-force attacks against authorization

[✔️] 6.13. Run Node.js as non-root user

[✔️] 6.14. Limit payload size using a reverse-proxy or a middleware

![❔] 6.15. Avoid JavaScript eval statements

![❔] 6.16. Prevent evil RegEx from overloading your single thread execution

[✔️] 6.17. Avoid module loading using a variable

![❔] 6.18. Run unsafe code in a sandbox

![❔] 6.19. Take extra care when working with child processes

[✔️] 6.20. Hide error details from clients

[✔️] 6.21. Configure 2FA for npm or Yarn

[❌] No neccessary - 6.22. Modify session middleware settings

![❔] 6.23. Avoid DOS attacks by explicitly setting when a process should crash

[❌] No neccessary - 6.24. Prevent unsafe redirects

![❔] 6.25. Avoid publishing secrets to the npm registry

### 7. Performance Best Practices

Our contributors are working on this section. [Would you like to join?](https://github.com/i0natan/nodebestpractices/issues/256)

[✔️] 7.1. Prefer native JS methods over user-land utils like Lodash

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/minhieutran"><img src="https://avatars1.githubusercontent.com/u/23243396?v=4" width="100px;" alt="minhieutran"/><br /><sub><b>minhieutran</b></sub></a><br /><a href="#projectManagement-minhieutran" title="Project Management">📆</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!