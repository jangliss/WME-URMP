import {BaseObject} from "./BaseType.js";
import type { WmeSDK } from "wme-sdk-typings";

class UpdateRequest extends BaseObject {
  lastVisitedCommentCount: number = 0;

  refreshFromServer(): void {

  }

  refreshFromWMEData(): void {

  }

}