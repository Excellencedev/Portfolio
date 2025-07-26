import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';
import ProjectLayout from './ProjectLayout';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
}

const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // OpenWeatherMap API key (get from environment variables or replace with your key)
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
  const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';



  useEffect(() => {
    // Load default weather for New York on component mount
    if (API_KEY && API_KEY !== 'demo_key') {
      loadDefaultWeather();
    }

    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getErrorMessage = (error: any): string => {
    if (!isOnline) {
      return 'No internet connection. Please check your network and try again.';
    }

    if (error.message?.includes('404') || error.message?.includes('not found')) {
      return 'City not found. Please check the spelling and try again.';
    }

    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return 'Invalid API key. Please check your configuration.';
    }

    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (error.message?.includes('timeout') || error.message?.includes('network')) {
      return 'Network timeout. Please check your connection and try again.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  };

  const loadDefaultWeather = async () => {
    try {
      setLoading(true);
      setError('');
      setRetryCount(0);
      const weatherData = await fetchWeatherData('New York');
      const forecastData = await fetchForecastData('New York');
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const retryLastAction = async () => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please try again later.');
      return;
    }

    setRetryCount(prev => prev + 1);
    setError('');

    if (weather?.location && weather.location !== 'New York') {
      // Retry the last search
      await searchWeatherByCity(weather.location);
    } else {
      // Retry default weather
      await loadDefaultWeather();
    }
  };

  const searchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      const weatherData = await fetchWeatherData(cityName);
      const forecastData = await fetchForecastData(cityName);
      setWeather(weatherData);
      setForecast(forecastData);
      setRetryCount(0); // Reset retry count on success
      setSuccessMessage(`Weather data loaded for ${weatherData.location}`);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      setError(getErrorMessage(err));
      console.error('Search weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    if (!isOnline) {
      throw new Error('No internet connection');
    }

    if (!cityName.trim()) {
      throw new Error('Please enter a city name');
    }

    try {
      // Try real API first if API key is available
      if (API_KEY && API_KEY !== 'demo_key') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
            {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
              }
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`City "${cityName}" not found. Please check the spelling.`);
            } else if (response.status === 401) {
              throw new Error('Invalid API key. Please check your configuration.');
            } else if (response.status === 429) {
              throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else {
              throw new Error(`Weather service error (${response.status}). Please try again.`);
            }
          }

          const data = await response.json();

          // Validate response data
          if (!data.main || !data.weather || !data.weather[0]) {
            throw new Error('Invalid weather data received');
          }

          const weatherData: WeatherData = {
            location: data.name || cityName,
            country: data.sys?.country || 'Unknown',
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description || 'Unknown',
            humidity: data.main.humidity || 0,
            windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // Convert m/s to km/h
            pressure: data.main.pressure || 0,
            visibility: Math.round((data.visibility || 0) / 1000), // Convert m to km
            feelsLike: Math.round(data.main.feels_like || data.main.temp),
            icon: data.weather[0].icon || '01d'
          };

          return weatherData;
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timeout. Please check your connection and try again.');
          }
          throw fetchError;
        }
      }

      // Fallback to mock data for demo
      const weatherData: WeatherData = {
        location: cityName,
        country: 'Demo Country',
        temperature: Math.floor(Math.random() * 30) + 5,
        description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 10) + 5,
        feelsLike: Math.floor(Math.random() * 30) + 5,
        icon: 'partly-cloudy'
      };

      return weatherData;
    } catch (error: any) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  };

  const fetchForecastData = async (cityName: string) => {
    if (!isOnline) {
      throw new Error('No internet connection');
    }

    try {
      if (API_KEY && API_KEY !== 'demo_key') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
            {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
              }
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`Forecast for "${cityName}" not found`);
            } else if (response.status === 401) {
              throw new Error('Invalid API key for forecast data');
            } else if (response.status === 429) {
              throw new Error('Rate limit exceeded for forecast');
            } else {
              throw new Error(`Forecast service error (${response.status})`);
            }
          }

          const data = await response.json();

          // Validate response data
          if (!data.list || !Array.isArray(data.list)) {
            throw new Error('Invalid forecast data received');
          }

          // Process forecast data (every 8th item for daily forecast - 3 hour intervals)
          const dailyForecast = data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);

          return dailyForecast.map((item: any, index: number) => {
            if (!item.main || !item.weather || !item.weather[0]) {
              return {
                date: index === 0 ? 'Today' : 'Unknown',
                high: 20,
                low: 10,
                description: 'Unknown',
                icon: '01d'
              };
            }

            return {
              date: index === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
              high: Math.round(item.main.temp_max || item.main.temp || 20),
              low: Math.round(item.main.temp_min || item.main.temp || 10),
              description: item.weather[0].description || 'Unknown',
              icon: item.weather[0].icon || '01d'
            };
          });
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            throw new Error('Forecast request timeout');
          }
          throw fetchError;
        }
      }

      // Fallback to mock data for demo
      return [
        { date: 'Today', high: 24, low: 18, description: 'Partly Cloudy', icon: 'partly-cloudy' },
        { date: 'Tomorrow', high: 26, low: 20, description: 'Sunny', icon: 'sunny' },
        { date: 'Wednesday', high: 23, low: 17, description: 'Rainy', icon: 'rainy' },
        { date: 'Thursday', high: 21, low: 15, description: 'Cloudy', icon: 'cloudy' },
        { date: 'Friday', high: 25, low: 19, description: 'Sunny', icon: 'sunny' }
      ];
    } catch (error: any) {
      console.error('Forecast fetch error:', error);
      // Return mock data on error for forecast (non-critical)
      return [
        { date: 'Today', high: 24, low: 18, description: 'Partly Cloudy', icon: 'partly-cloudy' },
        { date: 'Tomorrow', high: 26, low: 20, description: 'Sunny', icon: 'sunny' },
        { date: 'Wednesday', high: 23, low: 17, description: 'Rainy', icon: 'rainy' },
        { date: 'Thursday', high: 21, low: 15, description: 'Cloudy', icon: 'cloudy' },
        { date: 'Friday', high: 25, low: 19, description: 'Sunny', icon: 'sunny' }
      ];
    }
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    await searchWeatherByCity(city);
    setCity(''); // Clear search input on success
  };

  const getWeatherIcon = (iconType: string) => {
    // Handle both OpenWeatherMap icon codes and custom icon types
    switch (iconType) {
      // OpenWeatherMap icon codes
      case '01d':
      case '01n':
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;

      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-blue-500" />;

      case '04d':
      case '04n':
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;

      case '09d':
      case '09n':
      case '10d':
      case '10n':
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-600" />;

      case '13d':
      case '13n':
      case 'snowy':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;

      case '11d':
      case '11n':
      case 'stormy':
        return <Zap className="w-8 h-8 text-purple-500" />;

      case '50d':
      case '50n':
        return <Cloud className="w-8 h-8 text-gray-400" />; // Mist/fog

      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getCurrentLocation = () => {
    if (!isOnline) {
      setError('No internet connection. Please check your network.');
      return;
    }

    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Try real API first if API key is available
          if (API_KEY && API_KEY !== 'demo_key') {
            const { latitude, longitude } = position.coords;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
              const response = await fetch(
                `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
                {
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                  }
                }
              );

              clearTimeout(timeoutId);

              if (!response.ok) {
                throw new Error(`Location weather service error (${response.status})`);
              }

              const data = await response.json();

              // Validate response data
              if (!data.main || !data.weather || !data.weather[0]) {
                throw new Error('Invalid location weather data received');
              }

              const locationWeather: WeatherData = {
                location: data.name || 'Your Location',
                country: data.sys?.country || 'Unknown',
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description || 'Unknown',
                humidity: data.main.humidity || 0,
                windSpeed: Math.round((data.wind?.speed || 0) * 3.6),
                pressure: data.main.pressure || 0,
                visibility: Math.round((data.visibility || 0) / 1000),
                feelsLike: Math.round(data.main.feels_like || data.main.temp),
                icon: data.weather[0].icon || '01d'
              };

              setWeather(locationWeather);
              // Get forecast for the real location
              const forecastData = await fetchForecastData(locationWeather.location);
              setForecast(forecastData);
            } catch (fetchError: any) {
              clearTimeout(timeoutId);
              if (fetchError.name === 'AbortError') {
                throw new Error('Location weather request timeout');
              }
              throw fetchError;
            }
          } else {
            // Fallback to mock data for demo
            const locationWeather: WeatherData = {
              location: 'Your Location',
              country: 'Current Location',
              temperature: Math.floor(Math.random() * 25) + 10,
              description: 'Current Weather',
              humidity: Math.floor(Math.random() * 40) + 40,
              windSpeed: Math.floor(Math.random() * 20) + 5,
              pressure: Math.floor(Math.random() * 50) + 1000,
              visibility: Math.floor(Math.random() * 10) + 5,
              feelsLike: Math.floor(Math.random() * 25) + 10,
              icon: 'partly-cloudy'
            };

            setWeather(locationWeather);
            // Get mock forecast for demo
            const forecastData = await fetchForecastData('New York');
            setForecast(forecastData);
          }
        } catch (error: any) {
          setError(getErrorMessage(error));
          console.error('Location weather error:', error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }

        setError(errorMessage);
        setLoading(false);
        console.error('Geolocation error:', error);
      },
      options
    );
  };

  return (
    <ProjectLayout
      title="Weather App"
      description="Real-time weather information and 5-day forecast"
      githubUrl="https://github.com/yourusername/weather-app"
      technologies={["React", "TypeScript", "OpenWeatherMap API", "Geolocation", "Tailwind CSS"]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Network Status */}
        {!isOnline && (
          <Card className="mb-6 bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Offline</Badge>
                <span className="text-sm text-destructive">
                  You're currently offline. Please check your internet connection.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {successMessage && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Success</Badge>
                <span className="text-sm text-green-700">{successMessage}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-6 glass-card">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchWeather()}
                className="flex-1"
                disabled={loading || !isOnline}
              />
              <Button
                onClick={searchWeather}
                disabled={loading || !isOnline || !city.trim()}
              >
                <Search size={20} />
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                variant="outline"
                onClick={getCurrentLocation}
                disabled={loading || !isOnline}
              >
                <MapPin size={20} />
                Current Location
              </Button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm font-medium">Error</p>
                <p className="text-destructive text-sm">{error}</p>
                <div className="flex gap-2 mt-2">
                  {retryCount < 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryLastAction}
                      disabled={loading}
                    >
                      Retry {retryCount > 0 && `(${retryCount}/3)`}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError('')}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {loading && !weather && (
          <>
            {/* Loading Skeleton */}
            <Card className="mb-6 glass-card">
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-muted animate-pulse rounded-full mx-auto"></div>
                    <div className="h-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-3 bg-muted/30 rounded-lg">
                        <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-4 bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecast Loading Skeleton */}
            <Card className="glass-card">
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="w-8 h-8 bg-muted animate-pulse rounded-full mx-auto mb-3"></div>
                      <div className="h-3 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-3 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {weather && !loading && (
          <>
            {/* Current Weather */}
            <Card className="mb-6 glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  {weather.location}, {weather.country}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Weather Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      {getWeatherIcon(weather.icon)}
                    </div>
                    <div className="text-6xl font-bold text-foreground mb-2">
                      {weather.temperature}°C
                    </div>
                    <div className="text-xl text-muted-foreground mb-2 capitalize">
                      {weather.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Feels like {weather.feelsLike}°C
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Droplets className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                        <div className="font-semibold text-foreground">{weather.humidity}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Wind className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Wind Speed</div>
                        <div className="font-semibold text-foreground">{weather.windSpeed} km/h</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Gauge className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Pressure</div>
                        <div className="font-semibold text-foreground">{weather.pressure} hPa</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Eye className="w-6 h-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="font-semibold text-foreground">{weather.visibility} km</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                      <div className="font-semibold text-foreground mb-2">
                        {day.date}
                      </div>
                      <div className="flex justify-center mb-3">
                        {getWeatherIcon(day.icon)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 capitalize">
                        {day.description}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-foreground">{day.high}°</span>
                        <span className="text-muted-foreground">{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* API Status Notice */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={API_KEY && API_KEY !== 'demo_key' ? "bg-green-100 text-green-800" : "bg-primary/20 text-primary"}>
                {API_KEY && API_KEY !== 'demo_key' ? 'Live API' : 'Demo Mode'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {API_KEY && API_KEY !== 'demo_key'
                  ? 'Connected to OpenWeatherMap API - showing real weather data!'
                  : 'Using demo data. Add your OpenWeatherMap API key to .env file for live weather data.'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default WeatherApp;
