import type { Point, Feature, Geometry } from "geojson";
import * as turf from "@turf/turf";
import type { KeyboardShortcut, Selection, UserSession, WmeSDK } from "wme-sdk-typings";

declare const wmeSDK: WmeSDK;
declare const WMEURMPT: any;

export class BaseObject {
  geometry: Geometry;
  id: number | string;
  blockItem: boolean = false;
  visited: boolean = false;
  distanceToMapCenter: number = 0;

  constructor(id: number | string, geometry: Geometry) {
    this.id = id;
    this.geometry = geometry;

  }

  updateDistanceToMapCenter(mapCenter: Feature<Point> ): void {
    if (!WMEURMPT.isComputeDistances) {
      return;
    }

    const centerPoint : Feature<Point> = turf.centroid(turf.feature({type: "Feature", geometry: this.geometry, properties: []}));
    this.distanceToMapCenter = turf.distance(mapCenter, centerPoint);
  }

}

