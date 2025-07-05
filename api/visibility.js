export default async function handler(req, res) {
  const { station } = req.query;

  if (!station) {
    res.status(400).json({ error: 'Missing station parameter' });
    return;
  }

  // Replace this with your actual Met Office Global Spot API key
  const API_KEY = 'eyJ4NXQjUzI1NiI6Ik5XVTVZakUxTkRjeVl6a3hZbUl4TkdSaFpqSmpOV1l6T1dGaE9XWXpNMk0yTWpRek5USm1OVEE0TXpOaU9EaG1NVFJqWVdNellXUm1ZalUyTTJJeVpBPT0iLCJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ==.eyJzdWIiOiJyaWNoYXJkYWJhbGxAYW9sLmNvbUBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6InJpY2hhcmRhYmFsbEBhb2wuY29tIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJzaXRlX3NwZWNpZmljLTRhNmVlMjM2LTIwYWQtNDk2YS04NTc3LWM1YWY2Y2JlMjU4ZCIsImlkIjoxOTE2OCwidXVpZCI6IjBiNjc4YTYxLWQ4YzktNDE5OS04Yzg2LWY3YzY0MjRjNjc4YiJ9LCJpc3MiOiJodHRwczpcL1wvYXBpLW1hbmFnZXIuYXBpLW1hbmFnZW1lbnQubWV0b2ZmaWNlLmNsb3VkOjQ0M1wvb2F1dGgyXC90b2tlbiIsInRpZXJJbmZvIjp7IndkaF9zaXRlX3NwZWNpZmljX2ZyZWUiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTaXRlU3BlY2lmaWNGb3JlY2FzdCIsImNvbnRleHQiOiJcL3NpdGVzcGVjaWZpY1wvdjAiLCJwdWJsaXNoZXIiOiJKYWd1YXJfQ0kiLCJ2ZXJzaW9uIjoidjAiLCJzdWJzY3JpcHRpb25UaWVyIjoid2RoX3NpdGVfc3BlY2lmaWNfZnJlZSJ9XSwidG9rZW5fdHlwZSI6ImFwaUtleSIsImlhdCI6MTc1MTcwNzYxNywianRpIjoiNTQzMTdlY2UtZjBiMC00YjdlLWI5OTUtYjFlN2FmZmM5Zjc2In0=.NTAVVHXYwJgtd13f0UMVxLROILA6CV6CSov6QDY1KDLdrBbCOjwk6gH99WNdZslTMIob_1KgsEeUBVJASBbPXW8L60-jDkhgA9IcjqPGCQeRDgqY9vGHTJH7XlwlwhnUZW-IWI7ns7DW96wJcO_Fyp0fCGWVVm6ZaPZls8AMuk5MFT8KIgzGcDcCg7k2ethcTCxA108JoWe50jaZAb48MRCyeBKw_8MMWjyARhJ5cIUwREc7ujpBbdyvVLGi7nBqC1LN1fC71SxsvfTjrFb6qNyoNBoa5eRJqaE1j1I67rjaZqbyJ4OqXmPGbNzRziUdHQgNh4t_dkoOG0d5NGwX5Q==';

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
