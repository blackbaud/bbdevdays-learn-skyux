# [BarkBack](https://blackbaud.github.io/bbdevdays-learn-skyux/)

[![ci](https://github.com/blackbaud/bbdevdays-learn-skyux/actions/workflows/ci.yml/badge.svg)](https://github.com/blackbaud/bbdevdays-learn-skyux/actions/workflows/ci.yml)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/)

"Bark Back" is a fictional animal shelter that shows how to build a web
application with SKY UX components.

## Overview

This project builds a single-page application (SPA) with Angular and SKY UX.

### Choose Your Learning Path

- **Path A: Interactive Exploration (Fastest)**: Fork the project in StackBlitz using the buttons at each step, or clone the repository locally and check out milestone branches (e.g., `git checkout 01-create-project`, `git checkout 02-create-data-service`) to inspect and run pre-built code.
- **Path B: Build From Scratch (Hands-On)**: Follow the step-by-step CLI commands and code snippets below to build the application milestone by milestone from an empty workspace.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v22.x` or `v24.x`
- **npm**: `v10.x` or `v11.x`
- **Git**: CLI for version control
- **Web Browser**: Modern browser (Chrome / Chromium recommended for headless tests)

## Running the Application

When running the project locally, execute these commands from inside the `bark-back/` project root directory:

**Start command:** serve the SPA while developing locally with hot reloading (available at `http://localhost:4200`):

```bash
npx ng serve --open
```

**Test command:** run unit tests in interactive browser mode:

```bash
npm test
```

**Lint command:** check the syntax and style of the code:

```bash
npm run lint
```

**Test command for continuous integration:** run unit tests in a headless browser:

```bash
npm run test:ci
```

## Using StackBlitz

You can use StackBlitz to run this project in your browser without local installation. Within each section below, click the **Open in StackBlitz** button to get started.

Look at [Configuring your browser to run WebContainers](https://developer.stackblitz.com/platform/webcontainers/browser-config) for help with running StackBlitz, as well as [troubleshooting tips](https://developer.stackblitz.com/platform/webcontainers/troubleshooting-webcontainers).

## AI-Assisted Development (Optional)

[Agent skills](https://agentskills.io/) provide domain-specific knowledge about SKY UX and Angular to AI assistants (such as Claude Code, GitHub Copilot, ChatGPT, or Junie) in this repository:

```bash
npx skills add https://github.com/blackbaud/skyux-skills
npx skills add https://github.com/angular/skills
```

## Building the Project

### Steps <a id="steps"></a>

1. [Create the project](#create-the-project)
2. [Create data services](#create-data-services)
3. [Create a view](#create-a-view)
4. [Create an edit form](#create-an-edit-form)
5. [Add a data grid](#add-a-data-grid)
6. [Use Action Hub](#use-action-hub)

### 1. Create the project <a id="create-the-project"></a>

Set up the initial Angular application configured with SKY UX styling, ESLint, Prettier, and Vitest:

- **Client-Side SPA (`--no-ssr`)**: Builds a client-only app with no server rendering.
- **Zone.js (`--no-zoneless`)**: Keeps the Zone.js change detection that SKY UX components require.
- **Vitest Testing (`@skyux-sdk/vitest`)**: Configures fast unit testing with Vitest.
- **SKY UX Packages**: Core component packages (layout, forms, data grid, modals, and more) install upfront, so later steps need no new installs.

#### Scaffolding and Configuration

Start with the Angular CLI to create a new project:

```bash
npx @angular/cli@^22 new bark-back --routing --style=css --no-ssr --no-zoneless
cd bark-back
```

Inside the project directory, `npx @angular/cli` shortens to `npx ng`. `ng` is the Angular CLI command.

Raise the bundle budget so SKY UX fits, and turn on code coverage reporting:

```bash
npx ng config 'projects.bark-back.architect.build.configurations.production.budgets[0].maximumError' 2mb
npx ng config 'projects.bark-back.architect.test.options' '{}'
npx ng config 'projects.bark-back.architect.test.options.coverage' true
npx ng config 'projects.bark-back.architect.test.options.coverageExclude' '["**/fixtures/**"]'
```

Configure the test scripts used throughout this tutorial. `test:ci` runs headless; `test:wc` runs in a StackBlitz web container:

```bash
npx ng config 'projects.bark-back.architect.test.options.browserViewport' '1280x1024'
npx ng config 'projects.bark-back.architect.test.options.setupFiles' '["node_modules/@skyux-sdk/vitest/matchers-setup.ts"]'
npm pkg set scripts.test:ci='ng test --browsers=ChromiumHeadless --no-progress --no-watch'
npm pkg set scripts.test:wc='ng test --browsers=preview'
```

Add Prettier and ESLint support:

```bash
npx ng add angular-eslint@^22
npx ng add eslint-config-skyux@^15
```

Add `@skyux/packages` to the project, which adds SKY UX stylesheets and enables `ng update` for SKY UX, and `@skyux-sdk/vitest` for supporting [SKY UX testing matchers](https://developer.blackbaud.com/skyux/learn/develop/testing/vitest-matchers):

```bash
npx ng add @skyux/packages@^15
npx ng add @skyux-sdk/vitest@^15
```

Install the SKY UX packages used in later steps (easier than installing in Stackblitz later):

```bash
npm install \
  @skyux/ag-grid@^15 \
  @skyux/autonumeric@^15 \
  @skyux/avatar@^15 \
  @skyux/data-grid@^15 \
  @skyux/data-manager@^15 \
  @skyux/datetime@^15 \
  @skyux/errors@^15 \
  @skyux/flyout@^15 \
  @skyux/forms@^15 \
  @skyux/icon@^15 \
  @skyux/indicators@^15 \
  @skyux/inline-form@^15 \
  @skyux/layout@^15 \
  @skyux/lookup@^15 \
  @skyux/modals@^15 \
  @skyux/pages@^15 \
  @skyux/popovers@^15 \
  @skyux/router@^15 \
  skyux-eslint@^15
```

Create the welcome page:

```bash
npx ng generate component welcome-to-skyux
```

_(Note: `ng generate` can be shortened to `ng g`)_

#### Code Implementation

1. **Configure SKY UX Theme Provider** in `src/app/app.config.ts`:
   Add `provideInitialTheme('modern')` to the application providers:

   ```typescript
   import { ApplicationConfig } from '@angular/core';
   import { provideRouter, withComponentInputBinding } from '@angular/router';
   import { provideInitialTheme } from '@skyux/theme';

   import { routes } from './app.routes';

   export const appConfig: ApplicationConfig = {
     providers: [provideInitialTheme('modern'), provideRouter(routes, withComponentInputBinding())],
   };
   ```

2. **Add Welcome Content** in `src/app/welcome-to-skyux/welcome-to-skyux.html`:
   Use SKY UX alert and action button components:

   ```html
   <sky-alert alertType="warning">Training content is currently under development.</sky-alert>

   <p class="sky-theme-font-body-l">
     SKY UX is a design system for web applications. It provides a collection of reusable HTML, CSS,
     and JavaScript components that can be used to build modern, responsive web applications.
   </p>

   <sky-action-button-container>
     <sky-action-button [permalink]="{ url: 'https://developer.blackbaud.com/skyux/' }">
       <sky-action-button-icon iconName="question-circle" />
       <sky-action-button-header>Learn More about SKY UX</sky-action-button-header>
       <sky-action-button-details>
         The documentation site includes design principles and code examples.
       </sky-action-button-details>
     </sky-action-button>
   </sky-action-button-container>
   ```

3. **Update App Component** in `src/app/app.html`:
   Clear default boilerplate and include the welcome component:

   ```html
   <div class="sky-padding-even-md">
     <app-welcome-to-skyux />
   </div>
   <router-outlet />
   ```

4. Format and commit (`ng new` already initialized the Git repository):

   ```bash
   npx prettier -w .
   git add -A
   git commit -m "Add SKY UX"
   ```

#### Verification Checkpoint

- Run `npx ng serve --open` → Verify the welcome page renders at `http://localhost:4200` with SKY UX theme styling.
- Run `npm test` → Verify unit tests execute and pass.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

[**Back to steps list**](#steps)

### 2. Create data services <a id="create-data-services"></a>

_Git branch: `02-create-data-service`_

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/01-create-project?template=node)

This step introduces services to manage animal data and persistent user interface settings:

- **Data Service (`DataService`)**: Fetches animal records from `records.json` over HTTP and persists modifications in the browser's session storage.
- **UI Config Service (`AppUiConfigService`)**: Implements [SkyUIConfigService](https://developer.blackbaud.com/skyux/learn/develop/sticky-settings/overview) using session storage to persist user view settings (such as grid column widths and sorting).
- **Data Models**: Defines TypeScript interfaces `AnimalProfile` and `AnimalProfileSerialized`.

#### Scaffolding

Generate the services and data models:

```bash
npx ng g service services/app-ui-config/app-ui-config
npx ng g service services/data/data
npx ng g service services/data/fixtures/mock-data --skip-tests
npx ng g interface types/animal-profile
npx ng g interface types/animal-profile-serialized
```

#### Implementation Overview

Angular CLI creates the scaffolding files. Implement the service logic for session storage persistence and CRUD methods. Review the reference implementation:

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-data-service?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-data-service?template=node&startScript=test:wc)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/01-create-project...02-create-data-service?diff=unified&w=)

#### Verification Checkpoint

- Run `npm test` → Verify that unit tests for `DataService` and `AppUiConfigService` pass.

[**Back to steps list**](#steps)

### 3. Create a view <a id="create-a-view"></a>

_Git branch: `03-create-view`_

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/02-create-data-service?template=node)

Create a record view component to display animal profile details:

- **Record View Component (`AnimalProfilesViewComponent`)**: Displays animal photos, breed, status, and description using SKY UX avatars, labels, and action buttons. Designed to be reused both as a standalone page and inside a flyout.
- **Age Pipe (`AgePipe`)**: Custom pipe converting birthdates into human-readable years and months.
- **Routing**: Configures `animal-profiles/view/:id` in `app.routes.ts` to display individual profiles.
- **Edit Modal Service:** a placeholder to build out later.

#### Scaffolding

```bash
npx ng g component animal-profiles/view
npx ng g pipe animal-profiles/view/age/age
npx ng g service animal-profiles/edit/edit-modal
```

#### Implementation Overview

Implement the `AgePipe` formatting logic and connect `AnimalProfilesViewComponent` to `DataService` to load animal details by ID.

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node&startScript=test:wc)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/02-create-data-service...03-create-view?diff=unified&w=)

#### Verification Checkpoint

- Run `npx ng serve --open` → Navigate to `http://localhost:4200/#/animal-profiles/view/<id>`, where `<id>` is any `id` from `public/records.json`, and verify the animal record view renders with formatted age.
- Run `npm test` → Verify `AgePipe` and `AnimalProfilesViewComponent` tests pass.

[**Back to steps list**](#steps)

### 4. Create an edit form <a id="create-an-edit-form"></a>

_Git branch: `04-create-form`_

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/03-create-view?template=node)

Add the ability to edit animal profiles using Angular reactive forms and SKY UX modal dialogs:

- **Modal Host (`AnimalProfilesEditModalService`)**: Uses `SkyModalService` to open the edit form within a SKY UX modal.
- **Reactive Form Component (`AnimalProfilesEditComponent`)**: Implements [Angular reactive forms](https://angular.dev/guide/forms/reactive-forms) with validation, accessible `labelText` attributes, datepicker (`@skyux/datetime`), and autonumeric currency/number controls (`@skyux/autonumeric`).
- **Standalone View Page**: Dedicated wrapper page component for navigating directly to an animal profile.

#### Scaffolding

```bash
npx ng g component animal-profiles/view/view-page --flat --style=none
npx ng g component animal-profiles/edit --style=none
```

#### Implementation Overview

Construct the form controls using `FormBuilder` and connect save/cancel handlers to update `DataService` and close the modal.

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node&startScript=test:wc)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/03-create-view...04-create-form?diff=unified&w=)

#### Verification Checkpoint

- Run `npx ng serve --open` → Open a profile, click **Edit**, modify values in the modal dialog, save, and confirm that the updated values appear on the page.
- Run `npm test` → Verify edit form and modal unit tests pass.

[**Back to steps list**](#steps)

### 5. Add a data grid <a id="add-a-data-grid"></a>

_Git branch: `05-data-grid`_

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/04-create-form?template=node)

Create a searchable, filterable list view of all animals:

- **Data Manager (`@skyux/data-manager`)**: Manages active view state, search queries, column visibility, and filter criteria using [SkyDataManagerService](https://developer.blackbaud.com/skyux/components/data-manager).
- **Data Grid (`@skyux/data-grid`)**: Renders tabular animal data using [SKY UX data grid](https://developer.blackbaud.com/skyux/components/data-grid-component), which requires the AG Grid stylesheet.
- **Flyout (`@skyux/flyout`)**: Uses [SkyFlyoutService](https://developer.blackbaud.com/skyux/components/flyout) to slide out the animal profile view when clicking a row in the grid.

#### Scaffolding

```bash
npx ng g interface types/animal-profile-row
npx ng g component animal-profiles/list
npx ng g @skyux/packages:add-ag-grid-styles
```

#### Implementation Overview

Register the grid view with `SkyDataManagerService`, define the `sky-data-grid` columns, and wire row selection to open the profile flyout.

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node&startScript=test:wc)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/04-create-form...05-data-grid?diff=unified&w=)

#### Verification Checkpoint

- Run `npx ng serve --open` → Navigate to the list view, search and filter records, and click a row to verify the flyout opens with profile details.
- Run `npm test` → Verify list component and data manager unit tests pass.

[**Back to steps list**](#steps)

### 6. Use Action Hub <a id="use-action-hub"></a>

_Git branch: `06-action-hub`_

Start with the project from the previous step:
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/05-data-grid?template=node)

Create an action hub page to serve as the landing dashboard:

- **Action Hub Component (`@skyux/pages`)**: Uses [SkyActionHub](https://developer.blackbaud.com/skyux/components/action-hub) to present key summary metrics (e.g., animals needing medical attention or foster placement).
- **Quick Links & Actions**: Directs shelter staff to filtered lists, recent records, and external resources.

#### Scaffolding

```bash
npx ng g component hub --style=none
```

#### Implementation Overview

Inject `DataService` into the hub component to calculate summary metrics and configure action hub buttons and related links.

- [▶️ Run app in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node)
- [⚖️ Run tests in StackBlitz](https://stackblitz.com/fork/github/blackbaud/bbdevdays-learn-skyux/tree/06-action-hub?template=node&startScript=test:wc)
- [Review the code changes](https://github.com/blackbaud/bbdevdays-learn-skyux/compare/05-data-grid...06-action-hub?diff=unified&w=)

#### Verification Checkpoint

- Run `npx ng serve --open` → Open the Action Hub page (`http://localhost:4200/`), check that summary metrics display accurate counts, and click actions to verify navigation.
- Run `npm run test:ci` → Ensure all project unit tests pass cleanly.

[**Back to steps list**](#steps)

## Next Steps

- More code examples and documentation: [SKY UX Documentation](https://developer.blackbaud.com/skyux)
- For supporting additional languages: [Angular localization](https://angular.dev/guide/i18n)
- Deploying Angular applications: [Angular deployment](https://angular.dev/tools/cli/deployment)
- For [new SKY UX releases](https://github.com/blackbaud/skyux/releases), use [ng update](https://angular.dev/cli/update): `npx ng update @skyux/packages`
