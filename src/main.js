(function () {
  'use strict'

  const _SCRIPT_VERSION = GM_info.script.version.toString()
  const _SETTINGS_PREFIX = 'URMPT_'
  const _RELEASE_HISTORY = ''
  const _FORUM_URL = ''
  const _IS_BETA = /beta/.test(GM_info.script.name)

  const wmeURMPT = {}

  wmeURMPT.settings = {}
  wmeURMPT.icons = {}
  wmeURMPT.requestParams = {
    bbox: null,
    cityId: null,
    countryId: null,
    fromCreationTime: null,
    fromUpdateTime: null,
    managedAreaId: null,
    stateId: null,
    toCreationTime: null,
    toUpdateTime: null,
    userPropertiesFilter: null,
    mapUpdateRequestsFilter: null,
    mapProblemsFilter: null,
    venueUpdateRequestsFilter: null
  }
  wmeURMPT.csrfCookie = null

  // #region Fetch code used to retrieve data from WME APIs

  wmeURMPT.getCsrfCookie = function () {
    const cookieRes = document.cookie.match(/_csrf_token=([^;]+)/)
    if (cookieRes !== null) {
      wmeURMPT.csrfCookie = cookieRes[1]
      return wmeURMPT.csrfCookie
    }
  }

  wmeURMPT.getHeaders = function () {
    const obj = {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json; charset=utf-8',
      'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-csrf-token': wmeURMPT.csrfCookie
    }
    return obj
  }

  wmeURMPT.getQueryBody = function () {
    // wmeURMPT.requestParams.countryId = 235
    // wmeURMPT.requestParams.stateId = 100000050
    wmeURMPT.requestParams.bbox = [-90.08062180795379, 29.941303001338028, -90.05746897972944, 29.95252376928844]

    wmeURMPT.requestParams.venueUpdateRequestsFilter = {
      categories: null,
      lockRanks: [0, 1, 2, 3, 4, 5],
      page: 1,
      residential: null,
      types: null
    }

    wmeURMPT.requestParams.mapUpdateRequestsFilter = {
      commentCountRanges: [
        {
          from: 0,
          to: 0
        },
        {
          from: 1,
          to: 1
        },
        {
          from: 2,
          to: 2
        },
        {
          from: 3,
          to: 3
        },
        {
          from: 4,
          to: null
        }
      ],
      fromLastCommentTime: null,
      lastCommentBy: null,
      toLastCommentTime: null,
      commentedByUser: false,
      hasDescription: null,
      isOpen: true,
      page: 1,
      reportedByUser: false,
      resolvedByUser: false,
      sources: null,
      types: null
    }

    return JSON.stringify(wmeURMPT.requestParams)
  }

  wmeURMPT.fetchIssues = function () {
    if (wmeURMPT.csrfCookie === null) {
      wmeURMPT.getCsrfCookie()
      if (wmeURMPT.csrfCookie === null) {
        console.error("Can't get CSRF token")
        return
      }
    }

    const appUrl = W.Config.paths.issueTrackerSearchList
    fetch(
      appUrl,
      {
        headers: wmeURMPT.getHeaders(),
        method: 'POST',
        body: wmeURMPT.getQueryBody(),
        mode: 'cors',
        credentials: 'include'
      }
    ).then((response) => {
      if (!response.ok) {
        console.error('Error fetching data')
      } else {
        return response.json()
      }
    }).then((data) => {
      wmeURMPT.processIssues(data)
    })
  }

  // #endregion

  // #region Process data from WME APIs

  wmeURMPT.processIssues = function (data) {
    console.log(data)
  }

  // #endregion

  // #region Display code for data
  wmeURMPT.filterURs = function () {

  }

  wmeURMPT.filterMPs = function () {

  }

  wmeURMPT.filterPURs = function () {

  }

  wmeURMPT.filterES = function () {

  }

  wmeURMPT.filterRecord = function () {

  }

  wmeURMPT.refreshTable = function () {
    // Find out which panel is visible and refresh the table //

  }
  // #endregion

  // #region Settings Handling
  wmeURMPT.loadSettings = function () {

  }

  // #endregion
})()
