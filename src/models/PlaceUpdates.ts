import { Point, Feature, Geometry, BBox } from "geojson";
import { BaseObject } from "./BaseType.js";
import type { Venue, VenueUpdateRequest, WmeSDK } from "wme-sdk-typings";
import { wmeVenue, WMEURMPT } from "./WMEURMPT.js";

declare const wmeSDK: WmeSDK;
declare const wmeURMPT: WMEURMPT;

interface VenueData {
  name?: string;
  approved?: boolean;
  categories?: string[];
  createdOn?: number | null;
  updatedOn?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  venueUpdateRequests?: VenueUpdateRequest[];
  dateAddedMin?: number;
  dateAddedMax?: number;
  bounds?: BBox | null;
}

export class PlaceUpdate extends BaseObject {
  declare id: string;
  data: VenueData = {};

  constructor(id: string, geometry: Geometry) {
    super(id,geometry);
  }

  refreshFromWMEData(): void {
    const thePUR: Venue | null = wmeSDK.DataModel.Venues.getById( { venueId: this.id });

    if (thePUR === null) {
      return;
    }

    this.data = {};
    this.data.name = thePUR.name;
    this.data.categories = thePUR.categories;
    this.data.createdOn = thePUR.modificationData.createdOn;
    this.data.createdBy = thePUR.modificationData.createdBy;
    
    this.data.updatedBy = thePUR.modificationData.updatedBy;
    this.data.updatedOn = thePUR.modificationData.updatedOn;

    this.data.venueUpdateRequests = []

    for (let n = 0; n < thePUR.venueUpdateRequests.length; n++) {
      this.data.venueUpdateRequests.push(thePUR.venueUpdateRequests[n]);
      wmeURMPT.logDebug(
        `this.id: ${this.id}; this.data.venueUpdateRequets[${n}].dateAdded: ${thePUR.venueUpdateRequests[n].dateAdded}`, this
      )
    }
  }

  refreshFromServer(): void {
    const purCentroid = turf.centroid(turf.feature({type: "Feature", geometry: this.geometry, properties: []}));
    const serverPUR: wmeVenue | null = wmeURMPT.getPUR(this.id, purCentroid.geometry.coordinates[0], purCentroid.geometry.coordinates[1]);

    if (serverPUR !== null) {
      this.data = {}
      this.data.approved = serverPUR.approved;
      this.data.categories = serverPUR.categories;
      this.geometry = serverPUR.geometry;

    }

  }
}