import { GeoCoordinates } from './geo-coordinates.interface';
import { PostalAddress } from './postal-address.interface';
import { AdditionalProperty } from './additional-property.inteface';

export interface Place {
  "@context": string;
  "@type": string[];
  name: string;
  description: string;
  url: string;
  telephone: string;
  geo: GeoCoordinates;
  address: PostalAddress[];
  additionalProperty: AdditionalProperty[];
  id: string;
}
