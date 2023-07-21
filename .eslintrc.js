module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  },
  globals: {
    OpenLayers: 'readonly',
    W: 'readonly',
    I18n: 'readonly',
    GM_addElement: 'readonly',
    GM_getValue: 'readonly',
    GM_setValue: 'readonly',
    GM_xmlhttpRequest: 'readonly',
    GMStorageHelper: 'readonly',
    unsafeWindow: 'writeable',
    trustedTypes: 'readonly',
    ActiveXObject: 'readonly',
    cloneInto: 'readonly',
    $: 'readonly'
  }
}
