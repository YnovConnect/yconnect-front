import isPlainObject from 'lodash/isPlainObject'

/**
 * Check if a string value is empty.
 * Is considered empty:
 *   - null
 *   - undefined
 *   - ''
 *   - string composed only of spaces
 *   - empty array (`[]`)
 *   - object with no key (`{}`)
 * @param {*} value the value to check.
 * @returns {Boolean}
 */
export const isEmpty = (value) => {
  const emptyString =
    typeof value === 'undefined' ||
    value === null ||
    value === '' ||
    (typeof value === 'string' && value.trim().length === 0)

  const emptyArray = Array.isArray(value) && value.length === 0
  const emptyObject = isObject(value) && Object.keys(value).length === 0

  return emptyString || emptyArray || emptyObject
}

/**
 * Check if a variable is a native javascipt object (`{}`).
 * @param {*} value the variable to test.
 * @returns {boolean}
 * @see https://stackoverflow.com/a/16608074/9925718
 */
export const isObject = isPlainObject

/**
 * Check if current browser supports number format.
 */
export const hasNumberFormat = !!(
  typeof Intl === 'object' &&
  Intl &&
  typeof Intl.NumberFormat === 'function'
)

/**
 * Format a number for a given local.
 * @param {Number} value the value to format.
 * @param {String} locale the current locale.
 * @returns {String}
 */
export const formatNumber = (value, locale) => {
  if (typeof value !== 'number') {
    return value
  }

  if (hasNumberFormat) {
    return value.toLocaleString(locale, {
      style: 'decimal',
      maximumFractionDigits: 20,
    })
  }

  return value
}

/**
 * Get the timezone from the browser.
 * Compatible with modern browsers.
 * @returns {String} the timezone name.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
 */
export const getBrowserTimezone = () =>
  typeof Intl === 'object'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : null

/**
 * Round a number.
 * @param {number|string} value the number to round.
 * @param {number} decimals the number of decimals to use to round.
 */
export const round = (value, decimals = 2) =>
  Number(value).toFixed(decimals) * 1

/**
 * Build a picture url from its url with security token and authorization token.
 * @param {String|Object} picture the picture data or the picture url.
 * @returns {String}
 */
export const buildPictureUrl = (picture) => {
  if (typeof picture === 'string') {
    return picture
  }

  if (
    picture &&
    picture.host &&
    picture.x_amz_content_sha256 &&
    picture.x_amz_security_token
  ) {
    return `${picture.host}?x_amz_content_sha256=${picture.x_amz_content_sha256}&x_amz_security_token=${picture.x_amz_security_token}`
  }

  if (picture) {
    return URL.createObjectURL(picture)
  }

  return undefined
}

/**
 * Build user full name from its profile.
 * @param {Object} user the user.
 * @returns {String}
 */
export const buildUserFullName = (user) =>
  user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : undefined

/**
 * Get the attribute to use to display a sport name, depending on current locale.
 * Use this helper because there is `name_en` and no `name_fr`.
 * @param {VueComponent} self the component requesting for sport name.
 * @returns {String}
 */
export const getSportNameAttribute = (self) => {
  const locale = self.$i18n.locale
  const availableLocales = self.$config.apiLocales.filter(
    // there is no `name_fr` in sports (but there is in sport/positions!)
    (locale) => locale.toLowerCase() !== 'fr'
  )

  if (availableLocales.includes(locale)) {
    return `name_${locale}`
  }

  return 'name'
}

/**
 * Get the message related to the error returned by an HTTP response.
 * @param {Object} error the error.
 * @param {Object} responses responses a list of error messages overriding the default error messages.
 * @returns {String}
 */
export const getMessageFromErrorResponse = (error, responses = {}) => {
  console.error(error)
  const status = error.response?.status

  if (responses[status]) {
    return responses[status]
  }

  switch (status) {
    case 400:
      return 'error.common.invalid_data'
    case 403:
      return 'error.common.not_allowed'
    case 404:
      return 'error.common.not_found'
    default:
      return 'error.common.unknown_error'
  }
}

/**
 * Whether if the timezone is the french one.
 * @param {Object} timezones the timezones.
 * @param {String} timezoneId the id of the timezone that will be checked.
 * @returns {Boolean}
 */
export const isFrenchTimezone = (timezones, timezoneId) => {
  const frenchTz = timezones.find((t) => t.name === 'Europe/Paris')
  return frenchTz && frenchTz.id === timezoneId
}

/**
 * Format date.
 * @param {self} VueComponent the component requesting for date format.
 * @param {Date} date the date to format.
 * @returns {String}
 */
export const formatDate = (self, date) => {
  const locale = self.$i18n.locale
  const newDate = new Date(date)
  return newDate.toLocaleDateString(locale)
}

/**
 * Format number with currency.
 * @param {self} VueComponent the component requesting for number format.
 * @param {Number} number the number to format.
 * @returns {String}
 */
export const formatNumberWithCurrency = (self, number) => {
  const locale = self.$i18n.locale
  const currency = 'EUR'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(number)
}
