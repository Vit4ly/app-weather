export function REQUEST_GEO_POSITION (success, error, options) {
  navigator.geolocation.getCurrentPosition(success, error, options)
}
