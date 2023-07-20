function GMStorageHelperInjected () {
  window.GMStorageHelper = {
    jobs: [],
    _waitForData: function (id) {
      if (this.jobs.length <= id) {
        if (this.jobs[id].callback) {
          this.jobs[id].callback({
            entry: null,
            data: null,
            callback: this.jobs[id].callback,
            status: 'error',
            error: 'Request not found'
          })
        }
      } else {
        if (this.jobs[id].status === 'done') {
          if (this.jobs[id].callback) {
            this.jobs[id].callback(this.jobs[id])
          }
        } else {
          const _this = this
          window.setTimeout(function () {
            _this._waitForData(id)
          }, 500)
        }
      }
    },
    load: function (entry, callback) {
      this.jobs.push({
        task: 'load',
        entry,
        data: null,
        callback,
        status: 'added',
        error: ''
      })
      const _this = this
      const jobId = this.jobs.length - 1
      window.setTimeout(function () {
        _this._waitForData(jobId)
      }, 500)
    },
    save: function (entry, data, callback) {
      this.jobs.push({
        task: 'save',
        entry,
        data,
        callback,
        status: 'added',
        error: ''
      })
      const _this = this
      const jobId = this.jobs.length - 1
      window.setTimeout(function () {
        _this._waitForData(jobId)
      }, 500)
    }
  }
}

GM_addElement('script', {
  // eslint-disable-next-line quotes
  textContent: '' + GMStorageHelperInjected.toString() + " \n" + 'GMStorageHelperInjected();'
})

if (typeof unsafeWindow === 'undefined') {
  unsafeWindow = (function () {
    const dummyElem = document.createElement('p')
    dummyElem.setAttribute('onclick', 'return window;')
    return dummyElem.onclick()
  }())
}

function lookForGMStorageHelperJob () {
  for (let i = 0; i < unsafeWindow.GMStorageHelper.jobs.length; i++) {
    if (unsafeWindow.GMStorageHelper.jobs[i].status === 'added') {
      if (unsafeWindow.GMStorageHelper.jobs[i].task === 'load') {
        unsafeWindow.GMStorageHelper.jobs[i].data = cloneInto(GM_getValue(unsafeWindow.GMStorageHelper.jobs[i].entry, null), unsafeWindow.GMStorageHelper.jobs[i])
      }
      if (unsafeWindow.GMStorageHelper.jobs[i].task === 'save') {
        GM_setValue(unsafeWindow.GMStorageHelper.jobs[i].entry, unsafeWindow.GMStorageHelper.jobs[i].data)
        unsafeWindow.GMStorageHelper.jobs[i].data = cloneInto(null, unsafeWindow.GMStorageHelper.jobs[i])
      }
      unsafeWindow.GMStorageHelper.jobs[i].status = cloneInto('done', unsafeWindow.GMStorageHelper.jobs[i])
    }
  }
  window.setTimeout(lookForGMStorageHelperJob, 2000)
}

window.setTimeout(lookForGMStorageHelperJob)
