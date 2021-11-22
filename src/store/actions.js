const API_KEY = process.env.VUE_APP_API_KEY_WEATHER

export async function REQUEST_CITY_WEATHER (city) {
  const URL = `http://api.openweathermap.org/data/2.5/weather?units=metric&lang=en&APPID=${API_KEY}&q=${city}`
  try {
    const response = await fetch(URL)
    const result = await response.json()
    if (response.ok) {
      result.date = new Date()
      console.log(result)
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
      console.log('lan', result)
      return result
    } else {
      return result.message
    }
  } catch (e) {
    console.log(e)
  }
}

// export async function REQUEST__CHECKED_CITY (name) {
//   const URL = `http://getcitydetails.geobytes.com/GetCityDetails?fqcn=${name}`
//   try {
//     const response = await fetch(URL, {
//       mode: 'no-cors',
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json;charset=utf-8' }
//     })
//     const result = await response.json()
//     result.date = new Date()
//     result.select = true
//     console.log('lan', result)
//     return result
//   } catch (e) {
//     console.log(e)
//   }
// }
