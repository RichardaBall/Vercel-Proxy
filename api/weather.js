export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const key = 'mpwturrttqmcb4ax95xo94feri15h24bzcj6736m';

  if (!lat || !lon) {
    res.status(400).json({ error: 'Missing lat or lon' });
    return;
  }

  const url = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=current&units=metric&language=en&key=${key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Error fetching Meteosource API' });
      return;
    }
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
