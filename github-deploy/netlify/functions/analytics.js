exports.handler = async (event, context) => {
  // Simulate analytics data for demo
  const analyticsData = {
    overview: {
      totalPageViews: Math.floor(Math.random() * 1000) + 500,
      uniqueVisitors: Math.floor(Math.random() * 200) + 100,
      totalRequests: Math.floor(Math.random() * 2000) + 1000,
      serverUptime: Math.floor(Math.random() * 86400) + 3600,
      serverId: 'netlify-global-cdn',
      platform: 'Netlify Edge Functions',
      region: 'Global',
      activeSessions: Math.floor(Math.random() * 50) + 10
    },
    photoStats: {
      totalPhotoViews: Math.floor(Math.random() * 500) + 200,
      mostViewedPhotos: [
        { title: 'Machu Picchu Sunrise', views: Math.floor(Math.random() * 100) + 50 },
        { title: 'Northern Lights', views: Math.floor(Math.random() * 90) + 40 },
        { title: 'Sahara Desert Dunes', views: Math.floor(Math.random() * 80) + 35 },
        { title: 'Mount Fuji', views: Math.floor(Math.random() * 95) + 45 },
        { title: 'Amazon Rainforest', views: Math.floor(Math.random() * 70) + 30 },
        { title: 'Norwegian Fjords', views: Math.floor(Math.random() * 85) + 38 }
      ]
    },
    dailyStats: [
      {
        date: new Date().toISOString().split('T')[0],
        requests: Math.floor(Math.random() * 300) + 100,
        uniqueVisitors: Math.floor(Math.random() * 80) + 20
      }
    ],
    topUserAgents: [
      { agent: '🌐 Chrome', count: Math.floor(Math.random() * 100) + 50 },
      { agent: '🧭 Safari', count: Math.floor(Math.random() * 80) + 30 },
      { agent: '🦊 Firefox', count: Math.floor(Math.random() * 60) + 20 },
      { agent: '🔷 Edge', count: Math.floor(Math.random() * 40) + 15 },
      { agent: '📱 Mobile Safari', count: Math.floor(Math.random() * 70) + 25 }
    ],
    topReferrers: [
      { referrer: 'Direct', count: Math.floor(Math.random() * 200) + 100 },
      { referrer: 'Google Search', count: Math.floor(Math.random() * 150) + 50 },
      { referrer: 'Social Media', count: Math.floor(Math.random() * 100) + 30 },
      { referrer: 'GitHub', count: Math.floor(Math.random() * 80) + 20 }
    ],
    topCountries: [
      { country: 'United States', count: Math.floor(Math.random() * 100) + 50 },
      { country: 'United Kingdom', count: Math.floor(Math.random() * 80) + 30 },
      { country: 'Germany', count: Math.floor(Math.random() * 70) + 25 },
      { country: 'Japan', count: Math.floor(Math.random() * 60) + 20 },
      { country: 'Canada', count: Math.floor(Math.random() * 50) + 15 }
    ],
    realTimeData: {
      currentVisitors: Math.floor(Math.random() * 25) + 5,
      requestsPerMinute: Math.floor(Math.random() * 100) + 20,
      averageSessionDuration: Math.floor(Math.random() * 300) + 120,
      bounceRate: Math.floor(Math.random() * 40) + 20
    }
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(analyticsData)
  };
};