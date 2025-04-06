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
import * as fs from 'node:fs';
import { PlacesCollection } from './app/features/maps/models/places-collection.interface';
import { Place } from './app/features/maps/models/place.interface';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.get('/api/places', (req: Request, res: Response) => {
  const filePath = resolve(process.cwd(), 'src', 'assets', 'data', 'places.json');

  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      res.status(500).json({ error: 'Failed to load data' });
      return;
    }

    try {
      const collection: PlacesCollection = JSON.parse(data);
      const places: Place[] = collection.features.map(({ properties, geometry }) => ({
        id: properties._id,
        name: properties.NAME,
        coords: {
          latitude: geometry.coordinates[0][1],
          longitude: geometry.coordinates[0][0],
        }
      }));

      res.json(places);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load data' });
    }
  });
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
