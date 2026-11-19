/**
 * Host half of the session status colours bundle.
 *
 * All of the work happens in the browser: `client.js` installs one stylesheet
 * that colours sidebar session titles from the row state the Harness already
 * renders. Nothing is computed, stored, or requested on the Host, so this
 * entry exists only to keep the package in the profile's enabled bundle stack.
 */
export function apply() {}
