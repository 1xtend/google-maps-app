# GoogleMapsApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Setup

First you need to rename `environment.example.ts` to `environment.ts`.
Then replace `YOUR_API_KEY` with your Maps Platform API Key.

To start a local development server, run:

```bash
ng serve
```

## Unit tests
To start tests, run:
```bash
npm run test
```

## Description
The project is built using Angular 19 with SSR.
Application utilizes components from `Angular Material` for user-friendly layout and faster development.
Unit tests are written using Karma + Jasmine.
The application is deployed on Vercel.

For places of interests I use [Fáilte Ireland's Open Data API](https://failteireland.developer.azure-api.net/api-details#api=opendata-api-v1-v2&operation=attractions-items-get).
Sometimes api returns undefined, because of high number of requests.

### Key features:
- Google Map is dynamically loaded using specific service to secure api key.
- Custom endpoints for places of interests and filtering that is implemented on server side ([Fáilte Ireland's Open Data API](https://failteireland.developer.azure-api.net/api-details#api=opendata-api-v1-v2&operation=attractions-items-get) has only one endpoint which returns list of all places).
- Retrieved data is transferred from the server to browser using transferState to avoid double data fetching.
- Optimized performance by using @defer blocks, ChangeDetectionStrategy.OnPush, and lazy-loaded routes.
- Application is structured into smaller components to ensure encapsulation, maintainability and better code readability. 


