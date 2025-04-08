import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Place } from './app/features/maps/models/place.interface';
import { PlacesCollection } from './app/features/maps/models/places-collection.interface';
import { environment } from './environments/environment';
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const apiUrl: string = environment.placesApiUrl;

const angularAppEngine = new AngularAppEngine()

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext()

  const result = await angularAppEngine.handle(request, context)
  return result || new Response('Not found', { status: 404 })
}

function normalizeString(value: string): string {
  return value.trim().toLowerCase();
}

app.get('/api/places', async (req, res) => {
  const { search, county, streetAddress, tags } = req.query;

  const normalizedSearch: string | undefined = search && typeof search === 'string' ? normalizeString(search) : undefined;
  const normalizedCounty: string | undefined = county && typeof county === 'string' ? normalizeString(county) : undefined;
  const normalizedStreetAddress: string | undefined = streetAddress && typeof streetAddress === 'string' ? normalizeString(streetAddress) : undefined;
  const normalizedTags: string[] | undefined = tags && typeof tags === 'string' ? tags.split(',') : undefined;

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
      places = places.filter((place) =>
        place.address[0].addressRegion?.trim().toLowerCase().includes(normalizedCounty));
    }

    if (normalizedStreetAddress) {
      places = places.filter((place) =>
        place.address[0].streetAddress?.trim().toLowerCase().includes(normalizedStreetAddress))
    }

    if (normalizedTags && normalizedTags.length > 0) {
      places = places.filter((place) => {
        let tagSource: string | string[] | undefined = place.additionalProperty?.[0]?.value;

        if (!tagSource) {
          return false;
        }

        if (typeof tagSource === 'string') {
          tagSource = [tagSource];
        }

        if (Array.isArray(tagSource) && tagSource.length > 0) {
          const normalizedTagSource: string[] = tagSource.map((tag) => tag.trim().toLowerCase());
          return normalizedTags.every((tag) => normalizedTagSource.includes(tag.toLowerCase()));
        }

        return false;
      })
    }

    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
})

app.get('/api/place/:placeId', async (req, res) => {
  const placeId: string | undefined = req.params['placeId'];

  if (!placeId) {
    res.status(404).json({ error: 'You must provide place id' });
  }

  try {
    const response = await fetch(apiUrl);
    const collection: PlacesCollection = await response.json();
    const place: Place | undefined = collection.value?.find((place) => place.id === placeId);

    res.status(200).json(place);
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
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
