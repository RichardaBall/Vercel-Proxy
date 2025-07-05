import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { lat, lon, key } = req.query;

  if (!lat || !lon || !key) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const url = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=current&units=metric&language=en&key=${key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Error fetching weather API' });
      return;
    }
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
