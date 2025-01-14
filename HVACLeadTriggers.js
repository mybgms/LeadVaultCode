import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Users, CheckCircle } from 'lucide-react';

const HVACLeadTriggers = () => {
  const [temperature, setTemperature] = useState(28);
  const [arrivalMinutes, setArrivalMinutes] = useState(45);
  const [viewerCount, setViewerCount] = useState(3);
  const [lastServiceMinutes, setLastServiceMinutes] = useState(0);

  // Simulate temperature dropping
  useEffect(() => {
    const tempInterval = setInterval(() => {
      setTemperature(prev => Math.max(prev - 0.1, 20));
    }, 10000);

    return () => clearInterval(tempInterval);
  }, []);

  // Simulate countdown timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setArrivalMinutes(prev => Math.max(prev - 1, 15));
    }, 60000);

    return () => clearInterval(timerInterval);
  }, []);

  // Simulate viewer count fluctuation
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => Math.max(2, Math.min(8, prev + Math.floor(Math.random() * 3) - 1)));
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Temperature Drop Animation */}
      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {temperature.toFixed(1)}°F
        </div>
        <ChevronDown className="text-blue-600 animate-bounce" />
        <span className="text-sm text-gray-600">Dropping</span>
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

export default HVACLeadTriggers;
