import React, { useEffect, useState } from 'react';

export default function VisibilityDisplay() {
  const [visibility, setVisibility] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/visibility')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch visibility');
        return res.json();
      })
      .then(data => {
        if (data.visibility) {
          setVisibility(data.visibility);
        } else {
          setVisibility('Visibility data not found');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <h2>Current Visibility in Swansea</h2>
      <p>{visibility}</p>
    </div>
  );
}
