import memoize from 'lodash/memoize'

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape

/**
 * Check if a variable is empty or not.
 * Is considered empty :
 * - undefined
 * - null
 * - empty string
 * - string with only spaces characters
 * - an array with length = 0
 * @param {*} value the value to check
 * @returns {Boolean}
 */
const isEmpty = (value) =>
  typeof value === 'undefined' ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

/**
 * Get a list of input validators.
 * @param {Function} $t the translation function
 * @returns {Object}
 */
const validators = ({ $t, $tc }) => {
  /**
   * Returns an error if the value is not a boolean.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const boolean =
    (message = 'validation.boolean') =>
    (value) =>
      !isEmpty(value) && typeof value !== 'boolean' ? $t(message) : true

  /**
   * Returns an error if the value is not among the list passed as parameter.
   * @param {Array} choices a list of possible choices
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const choices =
    (choices, message = 'validation.oneOf') =>
    (value) =>
      !isEmpty(value) && !choices.includes(value)
        ? $t(message, { options: choices })
        : true

  /**
   * Returns an error if the value is not a number.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const number =
    (message = 'validation.number') =>
    (value) =>
      !isEmpty(value) && isNaN(Number(value)) ? $t(message) : true
  /**
   * Returns an error if the value has a length higher than the parameter.
   * @param {Number} max the maximum length.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const maxLength =
    (max, message = 'validation.maxLength') =>
    (value) =>
      !isEmpty(value) && value.length > max ? $t(message, { max }) : true

  /**
   * Returns an error if the value is higher than the parameter.
   * @param {Number} max the maximum value.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const maxValue =
    (max, message = 'validation.maxValue') =>
    (value) =>
      !isEmpty(value) && value > max ? $t(message, { max }) : true

  /**
   * Returns an error if the value has a length less than the parameter.
   * @param {Number} min the minimum length.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const minLength =
    (min, message = 'validation.minLength') =>
    (value) =>
      !isEmpty(value) && value.length < min ? $t(message, { min }) : true

  /**
   * Returns an error if the value is less than the parameter.
   * @param {Number} min the minimum value.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const minValue =
    (min, message = 'validation.minValue') =>
    (value) =>
      !isEmpty(value) && value < min ? $t(message, { min }) : true

  /**
   * Returns an error if the value does not match the pattern given as parameter.
   * @param {RegExp} pattern the regex to test.
   * @param {*} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const regex = (pattern, message) => (value) =>
    !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
      ? $t(message, { pattern })
      : true

  /**
   * Returns an error if the value is not a valid email.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const email = (message = 'validation.email') => regex(EMAIL_REGEX, message)

  /**
   * Returns an error if the value is null, undefined, or empty.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const required = (message = 'validation.required') =>
    function required(value) {
      // set function instead of `() => {}` to use the name `required` in TInput
      return isEmpty(value) ? $t(message) : true
    }

  /**
   * Returns an error if the provided value is different than the expected value.
   * @param {*} expected the expected value.
   * @param {String} message the error message.
   * @returns {String|Boolean} `true` if value is correct, else an error message.
   */
  const value =
    (expected, message = 'validation.value') =>
    (val) =>
      expected !== val ? $tc(message, [expected]) : true

  return {
    boolean,
    choices,
    email,
    number,
    minLength,
    minValue,
    maxLength,
    maxValue,
    regex,
    required,
    value,
  }
}

export default function (_, inject) {
  /**
   * Get the list of validators.
   * @returns {Object} a list of validators
   * @see https://stackoverflow.com/a/54539713/9925718
   */
  function getValidators() {
    // `this` represents the component calling this method.
    const $t = memoize((...args) => this.$t(...args))
    const $tc = memoize((...args) => this.$tc(...args))
    return validators({ $t, $tc })
  }

  inject('validators', getValidators)
}
