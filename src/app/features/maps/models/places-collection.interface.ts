import { PlacesFeature } from './places-feature.interface';

export interface PlacesCollection {
  type: string;
  name: string;
  crs: {
    type: string;
    properties: {
      name: string;
    }
  };
  features: PlacesFeature[];
}
