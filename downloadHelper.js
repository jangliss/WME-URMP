function downloadHelperInjected () {
  window.downloadHelper = {
    jobs: [],
    _waitForData: function (id) {
      if (this.jobs.length <= id) {
        this.jobs[id].callback({
          url: null,
          data: null,
          callback: this.jobs[id].callback,
          status: 'error',
          error: 'Request not found'
        })
      } else {
        if (this.jobs[id].status === 'success' || this.jobs[id].status === 'error') {
          this.jobs[id].callback(this.jobs[id])
        } else {
          if (this.jobs[id].status === 'downloading' && this.jobs[id].progressCallback) {
            this.jobs[id].progressCallback(this.jobs[id])
          }
          const _this = this
          window.setTimeout(function () {
            _this._waitForData(id)
          }, 500)
        }
      }
    },
    add: function (url, callback, progressCallback) {
      this.jobs.push({
        url,
        data: null,
        callback,
        progressCallback,
        status: 'added',
        progression: 0,
        error: ''
      })
      const _this = this
      window.setTimeout(function () {
        _this._waitForData(_this.jobs.length - 1)
      }, 500)
    }
  }
}

GM_addElement('script', {
  // eslint-disable-next-line quotes
  textContent: '' + downloadHelperInjected.toString() + " \n" + 'downloadHelperInjected();'
})

if (typeof unsafeWindow === 'undefined') {
  unsafeWindow = (function () {
    const dummyElem = document.createElement('p')
    dummyElem.setAttribute('onclick', 'return window;')
    return dummyElem.onclick()
  }())
}

function lookFordownloadHelperJob () {
  for (let i = 0; i < unsafeWindow.downloadHelper.jobs.length; i++) {
    if (unsafeWindow.downloadHelper.jobs[i].status === 'added') {
      unsafeWindow.downloadHelper.jobs[i].status = cloneInto('downloading', unsafeWindow.downloadHelper.jobs[i])
      const f = (function () {
        const job = i
        GM_xmlhttpRequest({
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: 'text/plain'
          },
          synchronous: false,
          timeout: 10000,
          url: unsafeWindow.downloadHelper.jobs[job].url,
          onerror: function (r) {
            unsafeWindow.downloadHelper.jobs[job].status = cloneInto('error', unsafeWindow.downloadHelper.jobs[job])
          },
          ontimeout: function (r) {
            console.debug('TOTO Timeout while getting area from server: ', r)
            unsafeWindow.downloadHelper.jobs[job].status = cloneInto('error', unsafeWindow.downloadHelper.jobs[job])
          },
          onload: function (r) {
            unsafeWindow.downloadHelper.jobs[job].status = cloneInto('success', unsafeWindow.downloadHelper.jobs[job])
            unsafeWindow.downloadHelper.jobs[job].data = cloneInto(r.responseText, unsafeWindow.downloadHelper.jobs[job])
          },
          onprogress: function (r) {
            unsafeWindow.downloadHelper.jobs[job].progression = cloneInto(r.total === 0 ? 0 : r.loaded / r.total, unsafeWindow.downloadHelper.jobs[job])
          }
        })
      }())
    }
  }
  window.setTimeout(lookFordownloadHelperJob, 2000)
}

window.setTimeout(lookFordownloadHelperJob)
