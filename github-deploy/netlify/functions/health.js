exports.handler = async (event, context) => {
  const serverIds = ['netlify-edge-us', 'netlify-edge-eu', 'netlify-edge-asia'];
  const randomServer = serverIds[Math.floor(Math.random() * serverIds.length)];
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      server: randomServer,
      platform: 'Netlify Edge Functions',
      region: 'Global CDN'
    })
  };
};