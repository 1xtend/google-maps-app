import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Request, Response } from 'express';
import { Place } from './app/features/maps/models/place.interface';
import { PlacesCollection } from './app/features/maps/models/places-collection.interface';
import { environment } from './environments/environment';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const apiUrl: string = environment.placesApiUrl;

app.get('/api/places', async (req: Request, res: Response) => {
  const { search, county } = req.query;

  const normalizedSearch: string | undefined = search && typeof search === 'string'
    ? search.trim().toLowerCase()
    : undefined;
  const normalizedCounty: string | undefined = county && typeof county === 'string'
    ? county.trim().toLowerCase()
    : undefined;

  try {
    const response = await fetch(apiUrl);
    const collection: PlacesCollection = await response.json();
    let places: Place[] | undefined | null = collection.value;

    if (!places || places.length === 0) {
      res.status(200).json([]);
      return;
    }

    if (normalizedSearch) {
      places = places.filter((place) =>
        place.name.toLowerCase().includes(normalizedSearch) ||
        place.description.toLowerCase().includes(normalizedSearch)
      );
    }

    if (normalizedCounty) {
      places = places.filter((place) => place.address[0].addressRegion.trim().toLowerCase().includes(normalizedCounty));
    }

    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
})

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${ port }`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
