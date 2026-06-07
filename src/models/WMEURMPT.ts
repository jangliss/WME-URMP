import type { Point, Feature, Geometry, BBox, Polygon, MultiPolygon } from "geojson";
import { distance } from "turf";
import type { Country, KeyboardShortcut, Selection, UserSession, WmeSDK } from "wme-sdk-typings";
import type { PlaceUpdate } from "./PlaceUpdates.js"

interface wmeVenuUpdate {
  createdBy?: number;
  dateAdded?: number;
  id?: string;
  isRead?: boolean;
  isStarred?: boolean;
  mapIssueId?: number;
  type?: string;
}

export interface wmeVenue {
  id: string;
  name: string;
  lockRank?: number;
  active?: boolean;
  approved?: boolean;
  categories?: string[];
  createdBy?: string;
  createdOn?: number;
  updatedBy?: string;
  updatedOn?: number;
  geometry: Geometry;
  venueUpdateRequests?: wmeVenuUpdate[];
}

interface wmeMPVenue {
  catagoryBrands?: {
    GAS_STATION?: string[];
    PARKING_LOT?: string[];
    CHARGING_STATION?: string[];
  };
  objects?: wmeVenue[];
  venueLevel?: number;
}

interface wmeMPUser {
  id?: number;
  rank?: number;
  userName?: string;
}

interface MPs {
  mapUpdateRequests?: object[];
  venues?: wmeMPVenue;
  mapSuggestions?: object[];
  mapComments?: object[];
  mapProblems?: object[];
  userAreas?: object[];
  users?: wmeMPUser[];
}

export class WMEURMPT {
  isDebug: boolean = false;
  version: string = '4.0.0';
  PURList: PlaceUpdate[] = [];

  scanUR: boolean = true;
  scanMC: boolean = true;
  scanMP: boolean = true;
  scanPUR: boolean = true;

  constructor() {
    // Do something in here //
  }

  logDebug( msg: string, obj: Object): void {
    if (this.isDebug) {
      this.log('UR-MP Tracking - DEBUG - ' + msg, obj)
    }
  }

  log(msg: string, obj: Object): void {
    if (obj == null) {
      console.log('UR-MP Tracking v' + this.version + ' - ' + msg)
    } else {
      console.debug('UR-MP Tracking v' + this.version + ' - ' + msg + ' ', obj)
    }
  }

  getMPs(bounds: number[], filter?: string): MPs {
    let mapProblemData: MPs = {};
    let serverResults = null;
    const url = '/Descartes/app/Features?language=en' + (this.scanUR ? '&mapUpdateRequestFilter=3%2C0' : '') + (this.scanMP ? '&problemFilter=3%2C3' : '') + '&mapComments=' + (this.scanMC ? 'true' : 'false') + '&venueLevel=3&venueFilter=' + (this.scanPUR ? '3%2C3%2C3' : '0%2C0%2C0') + '&editableAreas=true&bbox=' + bounds[0] + '%2C' + bounds[1] + '%2C' + bounds[2] + '%2C' + bounds[3];
    let xhr3Object: XMLHttpRequest = new XMLHttpRequest()

    xhr3Object.withCredentials = true;
    xhr3Object.open('GET', url, false);
    xhr3Object.send(null);
    if (xhr3Object.status === 200) {
      const r = xhr3Object.responseText
      try {
        serverResults = JSON.parse(r)
      } catch (e: any) {
        this.log("Error: can't read server response: ", e)
        this.log('Response from server: ', r)
        this.log('Query: ', url)
        serverResults = null
      }
    }

    // No results in the data or there was an error //
    if (serverResults === null) {
      return mapProblemData;
    }

    // Returned data is missing all the necessary feature items //
    if (!Object.prototype.hasOwnProperty.call(serverResults, 'mapUpdateRequests') && !Object.prototype.hasOwnProperty.call(serverResults, 'problems') && !Object.prototype.hasOwnProperty.call(serverResults, 'mapComments') && !Object.prototype.hasOwnProperty.call(serverResults, 'venues')) {
      return mapProblemData;
    }


    return mapProblemData;
  }

  getPUR(id: string, lon: number, lat: number): wmeVenue | null {
    let returnPUR = null;

    const turfLine = turf.lineString([[lon - 0.01, lat - 0.01], [lon + 0.01, lat + 0.01]]);
    const bounds = turf.bbox( turfLine );

    const MPs = this.getMPs(bounds);

    if (MPs.venues?.objects !== undefined && MPs.venues?.objects.length > 0) {
      const matchedPUR = MPs.venues.objects.filter(purs => purs.id === id);
      if (matchedPUR.length > 0) {
        // We'll always use the first entry returned //
        returnPUR = matchedPUR[0]
      }
    }

    return returnPUR;

  }
}