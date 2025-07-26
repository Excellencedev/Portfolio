# Weather App - Real API Setup

This guide explains how to connect the Weather App to a real weather API.

## OpenWeatherMap API Setup

### 1. Get API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

### 2. Environment Variables
Create a `.env` file in your project root:

```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
VITE_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

### 3. Update WeatherApp.tsx

Replace the demo constants with:

```typescript
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;
```

### 4. Uncomment Real API Calls

In the `fetchWeatherData` function, uncomment the real API call:

```typescript
const response = await fetch(
  `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
);

if (!response.ok) {
  throw new Error('Weather data not found');
}

const data = await response.json();

const weatherData: WeatherData = {
  location: data.name,
  country: data.sys.country,
  temperature: Math.round(data.main.temp),
  description: data.weather[0].description,
  humidity: data.main.humidity,
  windSpeed: Math.round(data.wind.speed * 3.6),
  pressure: data.main.pressure,
  visibility: Math.round(data.visibility / 1000),
  feelsLike: Math.round(data.main.feels_like),
  icon: data.weather[0].icon
};
```

### 5. Add 5-Day Forecast

For real forecast data, add this function:

```typescript
const fetchForecastData = async (cityName: string) => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Forecast data not found');
  }
  
  const data = await response.json();
  
  // Process forecast data (every 8th item for daily forecast)
  const dailyForecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
  
  return dailyForecast.map((item, index) => ({
    date: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
    high: Math.round(item.main.temp_max),
    low: Math.round(item.main.temp_min),
    description: item.weather[0].description,
    icon: item.weather[0].icon
  }));
};
```

### 6. Update Geolocation

For location-based weather, uncomment in `getCurrentLocation`:

```typescript
const { latitude, longitude } = position.coords;
const response = await fetch(
  `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
);
```

## API Features Available

### Current Weather
- Temperature, humidity, pressure
- Wind speed and direction
- Visibility
- Weather conditions
- "Feels like" temperature

### 5-Day Forecast
- Daily high/low temperatures
- Weather conditions
- 3-hour intervals available

### Additional Features
- Weather by coordinates
- Weather by city name
- Weather by ZIP code
- Multiple units (metric, imperial)
- Multiple languages

## Rate Limits

**Free Plan:**
- 1,000 calls/day
- 60 calls/minute

**Paid Plans:**
- Higher limits available
- More features (historical data, etc.)

## Error Handling

The app includes error handling for:
- Invalid city names
- Network errors
- API rate limits
- Geolocation errors

## Security Notes

- Never commit API keys to version control
- Use environment variables
- Consider API key rotation
- Monitor usage to avoid rate limits

## Alternative APIs

Other weather APIs you can use:
- AccuWeather API
- WeatherAPI.com
- Visual Crossing Weather
- Weatherstack

The app structure supports easy switching between different weather APIs.
