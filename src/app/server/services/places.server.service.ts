import { PlacesCollection } from '../../features/maps/models/places-collection.interface';
import { Place } from '../../features/maps/models/place.interface';
import { environment } from '../../../environments/environment';
import { PlacesFilters } from '../../features/maps/models/places-filters.interface';

export class PlacesServerService {
  private apiUrl: string = environment.placesApiUrl;

  async getPlaces(query: Partial<PlacesFilters>): Promise<Place[]> {
    const collection = await this.getPlacesCollection();
    let places: Place[] | undefined | null = collection.value ?? [];

    if (places.length === 0) {
      return [];
    }

    const { search, county, streetAddress, tags } = query;

    if (search) {
      places = this.filterBySearch(search, places);
    }

    if (county) {
      places = this.filterByCounty(county, places);
    }

    if (streetAddress) {
      places = this.filterByStreetAddress(streetAddress, places);
    }

    if (tags && tags.length > 0) {
      places = this.filterByTags(tags, places);
    }

    return places;
  }

  async getPlace(placeId: string): Promise<Place | undefined> {
    const collection = await this.getPlacesCollection();
    return collection.value?.find((place) => place.id === placeId);
  }

  private filterBySearch(value: string, places: Place[]): Place[] {
    const normalizedValue = this.normalizeString(value);
    return places.filter((place) =>
      place.name.toLowerCase().includes(normalizedValue) ||
      place.description.toLowerCase().includes(normalizedValue)
    );
  }

  private filterByCounty(value: string, places: Place[]): Place[] {
    const normalizedValue = this.normalizeString(value);
    return places.filter((place) =>
      place.address[0].addressRegion?.trim().toLowerCase().includes(normalizedValue));
  }

  private filterByStreetAddress(value: string, places: Place[]): Place[] {
    const normalizedValue = this.normalizeString(value);
    return places.filter((place) =>
      place.address[0].streetAddress?.trim().toLowerCase().includes(normalizedValue));
  }

  private filterByTags(value: string, places: Place[]): Place[] {
    const normalizedValue = value.split(',').map((tag) => this.normalizeString(tag));

    return places.filter((place) => {
      let tagSource: string[] = [];
      const rawTags: string[] | string | undefined = place.additionalProperty?.[0]?.value;

      if (!rawTags) {
        return false;
      }

      if (Array.isArray(rawTags)) {
        tagSource = rawTags;
      } else {
        tagSource = [rawTags];
      }

      const normalizedTagSource = tagSource.map((tag) => this.normalizeString(tag));
      return normalizedValue.every((tag) => normalizedTagSource.includes(tag));
    });
  }

  private async getPlacesCollection(): Promise<PlacesCollection> {
    const response = await fetch(this.apiUrl);
    return await response.json();
  }

  private normalizeString(value: string): string {
    return value.trim().toLowerCase();
  }
}
