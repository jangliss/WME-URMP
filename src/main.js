(function () {
  'use strict'

  const _SCRIPT_VERSION = GM_info.script.version.toString()
  const _SETTINGS_PREFIX = 'URMPT_'
  const _RELEASE_HISTORY = ''
  const _FORUM_URL = 'https://www.waze.com/discuss/t/script-wme-ur-mp-tracking/146173'
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
    venueUpdateRequestsFilter: null,
    mapSuggestionsFilter: null
  }
  wmeURMPT.csrfCookie = null
  wmeURMPT.mapIssues = {
    mapProblems: {},
    mapSuggestions: {},
    mapUpdateRequests: {},
    venueUpdateRequests: {}
  }

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
      // 'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      // 'sec-ch-ua-mobile': '?0',
      // 'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'WME URMP-T v' + _SCRIPT_VERSION,
      'x-csrf-token': wmeURMPT.getCsrfCookie()
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
  }

  wmeURMPT.fetchIssues = function (firstRun = false) {
    if (wmeURMPT.csrfCookie === null) {
      wmeURMPT.getCsrfCookie()
      if (wmeURMPT.csrfCookie === null) {
        console.error("Can't get CSRF token")
        return
      }
    }

    if (firstRun) {
      wmeURMPT.getQueryBody()
    }

    const appUrl = W.Config.paths.issueTrackerSearchList
    fetch(
      appUrl,
      {
        headers: wmeURMPT.getHeaders(),
        method: 'POST',
        body: (JSON.stringify(wmeURMPT.requestParams)),
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
    console.log('running processIssues')
    let fetchMore = false
    if ((typeof data === 'object') && (data !== null) && (typeof data.mapIssues === 'object') && (data.mapIssues !== null)) {
      const issueTypes = [
        { n: 'mapProblems', f: 'mapProblemsFilter', c: 'processMP' },
        { n: 'mapSuggestions', f: 'mapSuggestionsFilter', c: 'processMS' },
        { n: 'mapUpdateRequests', f: 'mapUpdateRequestsFilter', c: 'processMUR' },
        { n: 'venueUpdateRequests', f: 'venueUpdateRequestsFilter', c: 'processVUR' }
      ]
      // Loop through issue types from IssueTracker and call respective functions //
      issueTypes.forEach((issue) => {
        if ((typeof data.mapIssues[issue.n] !== 'undefined') && (data.mapIssues[issue.n] !== null) && (typeof data.mapIssues[issue.n].objects !== 'undefined')) {
          if ((typeof data.mapIssues[issue.n].hasMore !== 'undefined') && (data.mapIssues[issue.n].hasMore === true)) {
            fetchMore = true
            wmeURMPT.requestParams[(issue.f)].page += 1
          } else {
            wmeURMPT.requestParams[(issue.f)] = null
          }
          if (data.mapIssues[issue.n].objects.length > 0) {
            wmeURMPT[issue.c](data)
          }
        }
      })
    }
    if (fetchMore) {
      wmeURMPT.fetchIssues()
    }
  }

  wmeURMPT.getUserData = function (userData, userId) {
    let findRes = null
    findRes = userData.filter(elem => elem.id === userId)
    if (findRes.length !== 0) {
      return findRes[0]
    } else {
      return null
    }
  }

  wmeURMPT.processMP = function (data) {
    console.log('running processMP')
  }

  wmeURMPT.processMS = function (data) {
    console.log('running processMS')
    data.mapIssues.mapProblems.objects.forEach(problem => {
      const nativeProblemId = problem.nativeId
      if (typeof data[nativeProblemId.type] === 'object' && data[nativeProblemId.type] !== null) {
        const nativeProblem = data[nativeProblemId.type].objects.filter(elem => elem.id === nativeProblemId.id)
        if (typeof nativeProblem === 'object' && nativeProblem !== null) {
          wmeURMPT.mapIssues.mapSuggestions[nativeProblemId.id] = {
            problemType: nativeProblemId.type,
            id: nativeProblemId.id,
            createdOn: nativeProblem.createdOn,
            createdBy: nativeProblem.createdBy,
            edits: nativeProblem.edits.length
          }
        }
      }
    })
  }

  wmeURMPT.processMUR = function (data) {
    console.log('running processMUR')
    const fetchCommentList = []
    data.mapIssues.mapUpdateRequests.objects.forEach((issue) => {
      const murObj = data.mapUpdateRequests.objects.filter(elem => elem.mapIssueId === issue.mapIssueId)[0]
      wmeURMPT.mapIssues.mapUpdateRequests[issue.mapIssueId] = {
        id: murObj.id,
        description: murObj.description,
        hasComments: murObj.hasComments,
        commentCount: 0,
        lastComment: null,
        lastCommentBy: -1,
        isRead: murObj.isRead,
        isStarred: murObj.isStarred,
        isOpen: murObj.open,
        driveDate: murObj.driveDate,
        updatedOn: murObj.updatedOn,
        updatedBy: wmeURMPT.getUserData(murObj.updatedBy)
      }
      if (murObj.hasComments) {
        fetchCommentList.push(issue.mapIssueId)
      }
    })
  }

  wmeURMPT.processVUR = function (data) {
    console.log('running processVUR')
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

  wmeURMPT.saveSettings = function () {

  }

  // #endregion
})()
