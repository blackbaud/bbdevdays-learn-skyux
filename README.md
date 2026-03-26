# [BarkBack](https://blackbaud.github.io/bbdevdays-learn-skyux/)

[![ci](https://github.com/blackbaud/bbdevdays-learn-skyux/actions/workflows/ci.yml/badge.svg)](https://github.com/blackbaud/bbdevdays-learn-skyux/actions/workflows/ci.yml)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/)

"Bark Back" is a fictional animal shelter that demonstrates using SKY UX
components to build a web application.

## Overview

This project is designed to demonstrate some basic features of building a Single Page Application (SPA) using Angular and SKY UX.

Each of the steps under [Building the Project](#building-the-project) adds a new feature. You can follow along by forking the project in StackBlitz and running the code in your browser.

If you want to run the project locally, you can clone the repository and check out the branch for the step you're interested in.

**Start command:** serve the SPA while developing locally

```bash
npx ng serve --open
```

**Test command:** run unit tests in the browser

```bash
npm test
```

**Lint command:** check the syntax of the code

```bash
npm run lint
```

**Test command for continuous integration:** run unit tests in a headless browser

```bash
npm run test:ci
```

## Using StackBlitz

You can use StackBlitz to run this project in your browser. Within each section below, click the "Open in StackBlitz" button to get started.

Look at [Configuring your browser to run WebContainers](https://developer.stackblitz.com/platform/webcontainers/browser-config) for help with running StackBlitz, as well as [troubleshooting tips](https://developer.stackblitz.com/platform/webcontainers/troubleshooting-webcontainers).

## Building the Project

### Steps <a id="steps"></a>

1. [Create the project](#create-the-project)
2. [Create Data Services](#create-data-services)
3. [Create a view](#create-a-view)
4. [Create an edit form](#create-an-edit-form)
5. [Add a Data Grid](#add-a-data-grid)
6. [Use Action Hub](#use-action-hub)

### 1. Create the project <a id="create-the-project"></a>

- Basic Angular application.
- ES Lint and Prettier for code quality.
- SKY UX design system to provide a consistent look and feel.

Start with the Angular CLI to create a new project.

```bash
npx @angular/cli@^20 new bark-back --routing --style=css --no-ssr --no-zoneless
cd bark-back
```

Once the project is created, within the project directory, `npx @angular/cli` can be
shortened to `npx ng` — `ng` is the command for the Angular CLI.

For convenience, set a generous budget for the bundle size. Also, turn on code coverage reporting.

```bash
npx ng config 'projects.bark-back.architect.build.configurations.production.budgets[0].maximumError' 2mb
npx ng config 'projects.bark-back.architect.test.options.codeCoverage' true
```

Add Prettier and ES Lint support:

```bash
npm install -D prettier@^3 eslint-config-prettier@^10 @trivago/prettier-plugin-sort-imports@^5
npx ng add @angular-eslint/schematics@^20 --skip-confirmation
npx ng add eslint-config-skyux --skip-confirmation
```

Add `@skyux/packages` to the project, which adds SKY UX stylesheets and sets up upgrades:

```bash
npx ng add @skyux/packages --skip-confirmation
```

Install NPM packages that we plan to use:

```bash
npm install \
  @skyux-sdk/testing \
  @skyux/ag-grid \
  @skyux/animations \
  @skyux/autonumeric \
  @skyux/avatar \
  @skyux/data-manager \
  @skyux/datetime \
  @skyux/flyout \
  @skyux/forms \
  @skyux/icon \
  @skyux/indicators \
  @skyux/inline-form \
  @skyux/layout \
  @skyux/lookup \
  @skyux/modals \
  @skyux/pages
```

Create the welcome page:

```bash
npx ng generate component welcome-to-skyux
```

The `ng generate` command can be shortened to `ng g`.

- Clear the boilerplate from the app component.
- Add a welcome message to the welcome component.
- Add the initial theme provider.

Format and commit:

```bash
npx prettier -w .
git init
git add -A
git commit -m "Initial commit"
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

[**Back to steps list**](#steps)

### 2. Create Data Services <a id="create-data-services"></a>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

This demo app will use a data service that loads data from a static file and saves it to the browser's session storage.
It also uses browser storage for an implementation of [SkyUIConfigService](https://developer.blackbaud.com/skyux/learn/develop/sticky-settings/overview).
A more complex application would leverage authentication and a backend API.

First, let's generate some code:

- Create a session storage handler for talking to the browser's session storage.
- Create a mock session storage service to use in tests.
- Implement `SkyUIConfigService`.

```bash
npx ng g service services/app-ui-config/app-ui-config
npx ng g service services/data/data
npx ng g service services/data/mock-data --skip-tests
```

Next, let's generate the data model:

- Define the data model for an animal profile, including a serialized version for
  saving to session storage.
- Create a file for an ID token.
- Define the interface for a persistence service.

```bash
npx ng g interface types/animal-profile
npx ng g interface types/animal-profile-serialized
npx ng g interface types/id
npx ng g interface services/data/persistence-service-interface
```

Angular CLI will create the scaffolding, but you will need to implement the logic in the files. Here's what that might look like:

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node&startScript=test)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/01-create-project...02-create-http-service?diff=unified&w=)
- [**Back to steps list**](#steps)

### 3. Create a view <a id="create-a-view"></a>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node)

Getting into user interface design, we need to create a record view for the profiles:

- Create a view component to use in both a flyout and as a standalone page.
- Create a reusable description list component to simplify a pattern.

```bash
npx ng g component animal-profiles/view
npx ng g component animal-profiles/view/description-list
npx ng g component animal-profiles/view/description-list/description-list-item --flat --inline-template --style=none --skip-tests
npx ng g pipe animal-profiles/view/age/age
```

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node&startScript=test)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/02-create-http-service...03-create-view?diff=unified&w=)
- [**Back to steps list**](#steps)

### 4. Create an edit form <a id="create-an-edit-form"></a>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node)

In order to edit the animal profiles, we need to create a form:

- Create a form component that loads in a SKY UX modal.
- Use Angular's [reactive forms](https://angular.dev/guide/forms/reactive-forms).
- Use SKY UX components for a consistent look and feel.
- Provide informative `labelText` for accessibility.
- Set up a route to see the view.
- Create a service to make it easier to load the form from different contexts.

```bash
npx ng g component animal-profiles/view/view-page --flat --style=none
npx ng g component animal-profiles/edit
npx ng g service animal-profiles/edit/edit --type service
```

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node&startScript=test)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/03-create-view...04-create-form?diff=unified&w=)
- [**Back to steps list**](#steps)

### 5. Add a Data Grid <a id="add-a-data-grid"></a>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node)

Now that we have a record view and edit form, we need to create a data grid where we can see all the animal profiles:

- Use the SKY UX [data grid](https://developer.blackbaud.com/skyux/components/data-grid) to display a list of animal profiles, including the [additional styles](https://developer.blackbaud.com/skyux/components/data-grid?docs-active-tab=development#ag-grid-styles).
- Use the SKY UX [data manager](https://developer.blackbaud.com/skyux/components/data-manager) to manage the data view.
- Use [flyouts](https://developer.blackbaud.com/skyux/components/flyout) to show animal profile details.

```bash
npx ng g interface types/animal-profile-row
npx ng g component animal-profiles/list
npx ng g component animal-profiles/list/context-menu --style=none
npx ng g @skyux/packages:add-ag-grid-styles
```

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node&startScript=test)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/04-create-form...05-data-grid?diff=unified&w=)
- [**Back to steps list**](#steps)

### 6. Use Action Hub <a id="use-action-hub"></a>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node)

Lastly, we need to create an action hub to show the number of animals needing attention:

- Create an [Action Hub](https://developer.blackbaud.com/skyux/components/action-hub) page.
- Use the data service to get a count of animals needing attention.

```bash
npx ng g component hub
```

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node&startScript=test)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/05-data-grid...06-action-hub?diff=unified&w=)
- [**Back to steps list**](#steps)

## Next Steps

- More code examples and documentation: [SKY UX Documentation](https://developer.blackbaud.com/skyux)
- For supporting additional languages: [Angular localization](https://angular.dev/guide/i18n)
- Deploying Angular applications: [Angular deployment](https://angular.dev/tools/cli/deployment)
- For [new SKY UX releases](https://github.com/blackbaud/skyux/releases), use [ng update](https://angular.dev/cli/update): `npx ng update @skyux/packages`
