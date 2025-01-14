import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 mb-2" />
          <h2 className="text-red-600 font-bold">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Main Component
const EnhancedHVACTriggers = () => {
  // State management
  const [temperature, setTemperature] = useState(null);
  const [arrivalMinutes, setArrivalMinutes] = useState(45);
  const [viewerCount, setViewerCount] = useState(null);
  const [lastServiceMinutes, setLastServiceMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Weather API configuration
  const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
  const CITY = 'YOUR_CITY'; // Replace with your city
  
  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=imperial`
      );
      if (!response.ok) throw new Error('Weather data fetch failed');
      const data = await response.json();
      setTemperature(data.main.temp);
      setError(null);
    } catch (err) {
      setError('Weather data unavailable');
      console.error('Weather API Error:', err);
    }
  }, []);

  // Initialize weather data
  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(weatherInterval);
  }, [fetchWeather]);

  // Simulate tech arrival countdown
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setArrivalMinutes(prev => {
        const newTime = Math.max(prev - 1, 15);
        if (newTime === 15) {
          // Reset timer when it hits minimum
          return 45;
        }
        return newTime;
      });
    }, 60000);

    return () => clearInterval(timerInterval);
  }, []);

  // Simulate viewer count with realistic fluctuations
  useEffect(() => {
    const baseViewers = 3;
    const getRandomViewers = () => {
      const fluctuation = Math.floor(Math.random() * 3) - 1;
      return Math.max(2, Math.min(8, baseViewers + fluctuation));
    };

    setViewerCount(getRandomViewers());
    const viewerInterval = setInterval(() => {
      setViewerCount(getRandomViewers());
    }, 15000);

    return () => clearInterval(viewerInterval);
  }, []);

  // Update last service time
  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setLastServiceMinutes(prev => prev + 1);
    }, 60000);

    return () => clearInterval(serviceInterval);
  }, []);

  // Set loading state
  useEffect(() => {
    if (temperature !== null && viewerCount !== null) {
      setLoading(false);
    }
  }, [temperature, viewerCount]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Temperature Display */}
      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {temperature ? `${temperature.toFixed(1)}°F` : '--°F'}
        </div>
        <ChevronDown className="text-blue-600 animate-bounce" />
        <span className="text-sm text-gray-600">Current Temp</span>
      </div>

      {/* Tech Arrival Countdown */}
      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
        <Clock className="text-green-600" />
        <div>
          <div className="font-bold text-green-600">{arrivalMinutes} mins</div>
          <div className="text-sm text-gray-600">Until tech arrives</div>
        </div>
      </div>

      {/* Active Viewers Counter */}
      <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
        <Users className="text-yellow-600" />
        <div>
          <div className="font-bold text-yellow-600">{viewerCount} people</div>
          <div className="text-sm text-gray-600">Viewing this service</div>
        </div>
      </div>

      {/* Last Service Badge */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        <CheckCircle className="text-gray-600" />
        <div>
          <div className="font-bold text-gray-600">{lastServiceMinutes} mins ago</div>
          <div className="text-sm text-gray-600">Last service completed</div>
        </div>
      </div>
    </div>
  );
};

// Wrap main component with error boundary
const HVACLeadTriggers = () => (
  <ErrorBoundary>
    <EnhancedHVACTriggers />
  </ErrorBoundary>
);

export default HVACLeadTriggers;
