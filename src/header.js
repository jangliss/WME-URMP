// ==UserScript==
// @name        WME UR-MP tracking
// @version     {{version}}
// @description Track UR and MP in the Waze Map Editor
// @namespace   https://greasyfork.org/fr/scripts/368141-wme-ur-mp-tracking
// @match       https://www.waze.com/editor*
// @match       https://www.waze.com/*/editor*
// @match       https://beta.waze.com/editor*
// @match       https://beta.waze.com/*/editor*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @icon        data:image/png;base64,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
// @grant       GM_addElement
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @copyright   2023, dummyd2, seb-d59, jangliss
// @author      dummyd2, seb-d59, jangliss
// @connect     waze.netdork.net
// ==/UserScript==

/*******
 *
 *  You are free to:
 *   Share, copy, and redistribute the script in any medium or format
 *   under the following terms:
 *   Attribution - You must give appropriate credit. You may do so in any
 *     reasonable manner, but not in any way that suggests the licensor
 *     endorses you or your use.
 *
 *   NonCommercial - You may not use the script for commercial purposes.
 *
 *   NoModifications - You may NOT MODIFY the script.
 *
 *  You are invited to contact the author: jangliss on waze forum for more details.
 *
********/
