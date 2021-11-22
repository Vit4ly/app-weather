const API_KEY = process.env.VUE_APP_API_KEY_WEATHER

export async function REQUEST_CITY_WEATHER (city) {
  const URL = `http://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&APPID=${API_KEY}&q=${city}`
  try {
    const response = await fetch(URL)
    const result = await response.json()
    if (response.ok) {
      result.date = new Date()
      return result
    } else if (response.status === 404) {
      return result.message
    }
  } catch (e) {
    console.log(e)
  }
}

export async function REQUEST_WEATHER_LAT_LON (coords) {
  const URL = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${coords.lat}&lon=${coords.lon}&lang=en&appid=${API_KEY}`
  try {
    const response = await fetch(URL)
    const result = await response.json()
    if (response.ok) {
      result.date = new Date()
      result.select = true
      return result
    } else {
      return result.message
    }
  } catch (e) {
    console.log(e)
  }
}
