import { Injectable } from '@angular/core';
import { Place } from '../../features/maps/models/place.interface';
import { PlaceDetails } from '../../features/maps/models/place-details.inteface';

@Injectable({
  providedIn: 'root'
})
export class PlaceDetailsService {

  getDetailsArray(place: Place): PlaceDetails[] {
    const detailsArray: PlaceDetails[] = [];

    const streetAddress: string | undefined = place.address?.[0]?.streetAddress;
    if (streetAddress) {
      detailsArray.push({ label: 'Street Address', value: streetAddress, type: 'text' });
    }

    const county: string | undefined = place.address?.[0]?.addressRegion;
    if (county) {
      detailsArray.push({ label: 'County', value: county, type: 'text' });
    }

    const postalCode: string | undefined = place.address?.[0]?.postalCode;
    if (postalCode) {
      detailsArray.push({ label: 'Postal Code', value: postalCode, type: 'text' });
    }

    const telephone: string | undefined = place.telephone;
    if (telephone) {
      detailsArray.push({ label: 'Phone number', value: telephone, type: 'text' });
    }

    const url: string | undefined = place.url;
    if (url) {
      detailsArray.push({ label: 'Visit website', value: url, type: 'link' });
    }

    return detailsArray;
  }
}
