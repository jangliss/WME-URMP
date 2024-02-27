class wmeURMPTDB {
  #dbVer = 1
  #winDB
  constructor () {
    const openCreateDB = window.indexedDB.open('wmeURMPT', this.#dbVer)
    openCreateDB.addEventListener(
      'error', () => console.error('Error opening DB')
    ).addEventListener(
      'success', () => {
        console.log('Successfuly opened DB')
        this.#winDB = openCreateDB.result
      }
    ).addEventListener(
      'upgradeneeded', init => {
        this.#winDB = init.target.result
        this.#winDB.addEventListener('onerror', () => {
          console.error('Error loading database')
        })
      }
    )
  }
}
