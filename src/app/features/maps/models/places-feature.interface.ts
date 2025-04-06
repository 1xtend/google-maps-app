export interface PlacesFeature {
  type: string;
  properties: {
    _id: number;
    ADDRESS_INFO: string;
    NAME: string;
    CATEGORY: string;
    PHONE: string;
    EMAIL: string;
    WEBSITE: string;
    GEOID: number;
    RECEIVED_DATE: string;
    ADDRESS_POINT_ID: number;
    ADDRESS_NUMBER: number;
    LINEAR_NAME_FULL: string;
    ADDRESS_FULL: string;
    POSTAL_CODE: string;
    MUNICIPALITY: string;
    CITY: string;
    PLACE_NAME: string;
    GENERAL_USE_CODE: number;
    CENTRELINE: number;
    LO_NUM: number;
    LO_NUM_SUF: string;
    HI_NUM: string;
    HI_NUM_SUF: string;
    LINEAR_NAME_ID: number;
    WARD: string;
    WARD_2003: number;
    WARD_2021: number;
    MI_PRINX: number;
    ATTRACTION: string;
    MAP_ACCESS: 'Y' | 'N';
  };
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}
