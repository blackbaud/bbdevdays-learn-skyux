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
npx ng test
```

**Lint command:** check the syntax of the code

```bash
npx ng lint
```

**Test command for continuous integration:** run unit tests in a headless browser

```bash
npx ng test --browsers=ChromeHeadless --no-watch --no-progress
```

## Using StackBlitz

You can use StackBlitz to run this project in your browser. Within each section below, click the "Open in StackBlitz" button to get started.

Look at [Configuring your browser to run WebContainers](https://developer.stackblitz.com/platform/webcontainers/browser-config) for help with running StackBlitz, as well as [troubleshooting tips](https://developer.stackblitz.com/platform/webcontainers/troubleshooting-webcontainers).

## Building the Project

Jump to the section you'd like to explore and click ▶︎ to show details:

<details>
<summary>1. Create the project</summary>

- Basic Angular application.
- ES Lint and Prettier for code quality.
- SKY UX design system to provide a consistent look and feel.

Start with the Angular CLI to create a new project.

```bash
npx @angular/cli@^17 new bark-back \
  --routing \
  --skip-git \
  --style=scss \
  --no-ssr
cd bark-back
```

Add ES Lint and Prettier support:

```bash
npx ng add @angular-eslint/schematics --skip-confirmation
npm i -D \
  prettier \
  prettier-eslint \
  eslint-config-prettier \
  eslint-plugin-prettier
npx ng add @skyux-sdk/eslint-config --skip-confirmation
```

Add `@skyux/packages` to the project, which adds SKY UX stylesheets and sets up upgrades:

```bash
npx ng add @skyux/packages \
  --project bark-back \
  --skip-confirmation
```

Install NPM packages that we plan to use:

```bash
npm install \
  @ng-web-apis/common \
  @skyux-sdk/testing \
  @skyux/ag-grid \
  @skyux/animations \
  @skyux/autonumeric \
  @skyux/avatar \
  @skyux/data-manager \
  @skyux/datetime \
  @skyux/flyout \
  @skyux/forms \
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

</details>

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

<details>
<summary>2. Create an HTTP Service</summary>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

```bash
npx ng generate class settings --skip-tests
npx ng generate service services/app-ui-config/app-ui-config --skip-tests
npx ng generate interface types/animal-profile
npx ng generate service services/data/data
npx ng generate service services/data/persistence
```

- Create a `settings` file to hold application settings.
- Wire up HTTP client.
- Implement `SkyUIConfigService`.
- Write tests.
- Write test service to simplify testing consuming components.

[▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node) ⁄
[⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node&startScript=test)

</details>

[**Review the code changes**](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/01-create-project...02-create-http-service?diff=unified&w=)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node&file=src%2Fapp%2Fservices%2Fdata%2Fdata.service.ts)

<details>
<summary>3. Create a view</summary>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-http-service?template=node)

```bash
npx ng generate component animal-profiles/view
npx ng generate component animal-profiles/view/description-list
npx ng generate component animal-profiles/view/description-list/description-list-item --flat --inline-template --style=none --skip-tests
```

- Create a reusable description list component to simplify a pattern.
- Create a view component to use in both a flyout and as a standalone page.

[▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node) ⁄
[⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node&startScript=test)

</details>

[**Review the code changes**](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/02-create-http-service...03-create-view?diff=unified&w=)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node&file=src%2Fapp%2Fanimal-profiles%2Fview%2Fview.component.html)

<details>
<summary>4. Create an edit form</summary>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node)

```bash
npx ng generate component animal-profiles/view/view-page --flat --style=none
npx ng generate component animal-profiles/edit
npx ng generate service animal-profiles/edit/edit
```

- Use reactive forms for more programmatic control.
- Use SKY UX components for a consistent look and feel.
- Provide informative `labelText` for accessibility.
- Set up a route to see the view.

[▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node) ⁄
[⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node&startScript=test)

</details>

[**Review the code changes**](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/03-create-view...04-create-form?diff=unified&w=)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node&file=src%2Fapp%2Fanimal-profiles%2Fedit%2Fedit.component.html)

<details>
<summary>5. Add a Data Grid</summary>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node)

```bash
npx ng generate interface types/animal-profile-row
npx ng generate component animal-profiles/list
npx ng generate @skyux/packages:add-ag-grid-styles --project bark-back
```

- Use the SKY UX [data grid](https://developer.blackbaud.com/skyux/components/data-grid) to display a list of animal profiles.
- Use the SKY UX [data manager](https://developer.blackbaud.com/skyux/components/data-manager) to manage the data view.
- Use [flyouts](https://developer.blackbaud.com/skyux/components/flyout) to show animal profile details.
- Use [modals](https://developer.blackbaud.com/skyux/components/modal) to edit animal profiles.

[▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node) ⁄
[⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node&startScript=test)

</details>

[**Review the code changes**](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/04-create-form...05-data-grid?diff=unified&w=)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node&file=src%2Fapp%2Fanimal-profiles%2Flist%2Flist.component.html)

<details>
<summary>6. Use Action Hub</summary>

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node)

```bash
npx ng generate component hub
```

- Create an [Action Hub](https://developer.blackbaud.com/skyux/components/action-hub) page.
- Use the data service to get a count of animals needing attention.

[▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node) ⁄
[⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node&startScript=test)

</details>

[**Review the code changes**](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/05-data-grid...06-action-hub?diff=unified&w=)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node&file=src%2Fapp%2Fhub%2Fhub.component.html)

## Next Steps

- More code examples and documentation: [SKY UX Documentation](https://developer.blackbaud.com/skyux)
- For supporting additional languages: [Angular localization](https://angular.dev/guide/i18n)
- Deploying Angular applications: [Angular deployment](https://angular.dev/tools/cli/deployment)
- For [new SKY UX releases](https://github.com/blackbaud/skyux/releases), use [ng update](https://angular.dev/cli/update): `npx ng update @skyux/packages`
