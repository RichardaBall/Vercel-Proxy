import React, { useEffect, useState } from 'react';

export default function VisibilityDisplay() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lat = 51.6214;
    const lon = -3.9436;
    const key = 'mpwturrttqmcb4ax95xo94feri15h24bzcj6736m';

    fetch(`/api/weather?lat=${lat}&lon=${lon}&key=${key}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setError(data.error);
        } else {
          setWeatherData(data);
        }
      })
      .catch(() => setError('Failed to fetch weather data'));
  }, []);

  if(error) return <div>Error: {error}</div>;
  if(!weatherData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Current Weather</h1>
      <p>Temperature: {weatherData.current.temperature} °C</p>
      <p>Visibility: {weatherData.current.visibility ?? 'N/A'}</p>
    </div>
  );
}
