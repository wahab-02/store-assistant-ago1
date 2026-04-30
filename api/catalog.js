// Vercel Serverless Function to proxy catalog API requests
// This solves the Mixed Content (HTTP/HTTPS) issue

const CATALOG_API_BASE = "http://catalog-manager.yellowsmoke-ff36206d.uksouth.azurecontainerapps.io/v1";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract the path after /api/catalog/
    // e.g., /api/catalog/partners/urn:partner:xxx/products?gtin=123
    const requestPath = req.url.replace(/^\/api\/catalog\/?/, '');
    
    // Build the full URL
    const fullUrl = `${CATALOG_API_BASE}/${requestPath}`;
    
    console.log('Proxying request to:', fullUrl);

    // Forward the request to the catalog API
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'common-secret-api-key',
      },
    });

    const data = await response.json();

    // Return the response
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from catalog API',
      message: error.message 
    });
  }
}
