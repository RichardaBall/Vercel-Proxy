export default async function handler(req, res) {
  const { station } = req.query;

  if (!station) {
    res.status(400).json({ error: 'Missing station parameter' });
    return;
  }

  // Replace this with your actual Met Office Global Spot API key
  const API_KEY = 'YOUR_MET_OFFICE_GLOBAL_SPOT_API_KEY';

  const url = `https://api.metoffice.gov.uk/val/wxobs/all/json/${station}?res=hourly&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Error fetching Met Office API' });
      return;
    }

    const data = await response.json();

    const periods = data?.SiteRep?.DV?.Location?.Period;
    if (!periods || periods.length === 0) {
      res.status(200).json({ message: 'No data available' });
      return;
    }

    // Get the latest period and latest observation report
    const latestPeriod = periods[periods.length - 1];
    const latestRep = latestPeriod.Rep[latestPeriod.Rep.length - 1];

    const visibilityDecametres = latestRep.V; // visibility in decametres (10m units)

    res.setHeader('Access-Control-Allow-Origin', '*');
    if (visibilityDecametres !== undefined) {
      res.status(200).json({ 
        visibility_meters: visibilityDecametres * 10,
        observationTime: latestRep.$,
        data: latestRep
      });
    } else {
      res.status(200).json({ message: 'Visibility data not available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
