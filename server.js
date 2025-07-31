const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Analytics storage (in production, use a database)
let analytics = {
  pageViews: 0,
  uniqueVisitors: new Set(),
  photoViews: {},
  userSessions: {},
  serverStats: {
    serverId: process.env.SERVER_ID || 'server-1',
    startTime: new Date(),
    requestCount: 0
  },
  dailyStats: {},
  popularPhotos: {},
  userAgents: {},
  referrers: {}
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Analytics middleware
app.use((req, res, next) => {
  analytics.serverStats.requestCount++;
  
  // Track daily stats
  const today = new Date().toISOString().split('T')[0];
  if (!analytics.dailyStats[today]) {
    analytics.dailyStats[today] = { requests: 0, uniqueIPs: new Set() };
  }
  analytics.dailyStats[today].requests++;
  analytics.dailyStats[today].uniqueIPs.add(req.ip);
  
  // Track user agents
  const userAgent = req.get('User-Agent') || 'Unknown';
  analytics.userAgents[userAgent] = (analytics.userAgents[userAgent] || 0) + 1;
  
  // Track referrers
  const referrer = req.get('Referer') || 'Direct';
  analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;
  
  next();
});

// Sample exploration photos data
const explorationPhotos = [
  {
    id: 1,
    title: "Machu Picchu Sunrise",
    location: "Peru",
    description: "Ancient Incan citadel at dawn",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    explorer: "Adventure Seeker",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Northern Lights",
    location: "Iceland",
    description: "Aurora Borealis dancing across the sky",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
    explorer: "Arctic Explorer",
    date: "2024-02-20"
  },
  {
    id: 3,
    title: "Sahara Desert Dunes",
    location: "Morocco",
    description: "Golden sand dunes stretching to horizon",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop",
    explorer: "Desert Wanderer",
    date: "2024-03-10"
  },
  {
    id: 4,
    title: "Mount Fuji",
    location: "Japan",
    description: "Sacred mountain reflected in lake",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop",
    explorer: "Mountain Climber",
    date: "2024-04-05"
  }
];

// Routes
app.get('/api/photos', (req, res) => {
  analytics.pageViews++;
  analytics.uniqueVisitors.add(req.ip);
  res.json(explorationPhotos);
});

app.get('/api/photos/:id', (req, res) => {
  const photoId = parseInt(req.params.id);
  const photo = explorationPhotos.find(p => p.id === photoId);
  
  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }
  
  // Track photo views
  analytics.photoViews[photoId] = (analytics.photoViews[photoId] || 0) + 1;
  analytics.popularPhotos[photo.title] = (analytics.popularPhotos[photo.title] || 0) + 1;
  
  res.json(photo);
});

// Analytics tracking endpoints
app.post('/api/track/page-view', (req, res) => {
  const { page, sessionId } = req.body;
  analytics.pageViews++;
  analytics.uniqueVisitors.add(req.ip);
  
  if (sessionId) {
    if (!analytics.userSessions[sessionId]) {
      analytics.userSessions[sessionId] = {
        startTime: new Date(),
        pageViews: 0,
        photosViewed: [],
        ip: req.ip
      };
    }
    analytics.userSessions[sessionId].pageViews++;
  }
  
  res.json({ success: true });
});

app.post('/api/track/photo-view', (req, res) => {
  const { photoId, photoTitle, sessionId } = req.body;
  
  analytics.photoViews[photoId] = (analytics.photoViews[photoId] || 0) + 1;
  analytics.popularPhotos[photoTitle] = (analytics.popularPhotos[photoTitle] || 0) + 1;
  
  if (sessionId && analytics.userSessions[sessionId]) {
    analytics.userSessions[sessionId].photosViewed.push({
      photoId,
      photoTitle,
      timestamp: new Date()
    });
  }
  
  res.json({ success: true });
});

// Analytics dashboard endpoint
app.get('/api/analytics', (req, res) => {
  const processedAnalytics = {
    overview: {
      totalPageViews: analytics.pageViews,
      uniqueVisitors: analytics.uniqueVisitors.size,
      totalRequests: analytics.serverStats.requestCount,
      serverUptime: Math.floor((new Date() - analytics.serverStats.startTime) / 1000),
      serverId: analytics.serverStats.serverId
    },
    photoStats: {
      totalPhotoViews: Object.values(analytics.photoViews).reduce((a, b) => a + b, 0),
      mostViewedPhotos: Object.entries(analytics.popularPhotos)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([title, views]) => ({ title, views }))
    },
    dailyStats: Object.entries(analytics.dailyStats).map(([date, stats]) => ({
      date,
      requests: stats.requests,
      uniqueVisitors: stats.uniqueIPs.size
    })),
    topUserAgents: Object.entries(analytics.userAgents)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([agent, count]) => ({ agent: agent.substring(0, 50) + '...', count })),
    topReferrers: Object.entries(analytics.referrers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count })),
    activeSessions: Object.keys(analytics.userSessions).length
  };
  
  res.json(processedAnalytics);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: process.env.SERVER_ID || 'server-1'
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server ID: ${process.env.SERVER_ID || 'server-1'}`);
});

module.exports = app;