import {
  AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Place } from './app/features/maps/models/place.interface';
import { PlacesServerService } from './app/server/services/places.server.service';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const placesService = new PlacesServerService();

app.get('/api/places', async (req, res) => {
  try {
    const places = await placesService.getPlaces(req.query);
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.get('/api/place/:placeId', async (req, res) => {
  const placeId: string | undefined = req.params['placeId'];

  if (!placeId) {
    res.status(404).json({ error: 'You must provide place id' });
  }

  try {
    const place: Place | undefined = await placesService.getPlace(placeId)
    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

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
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
