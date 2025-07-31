const explorationPhotos = [
  {
    id: 1,
    title: "Machu Picchu Sunrise",
    location: "Peru",
    description: "Ancient Incan citadel at dawn, shrouded in mystical morning mist",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    explorer: "Adventure Seeker",
    date: "2024-01-15",
    elevation: "2,430m"
  },
  {
    id: 2,
    title: "Northern Lights",
    location: "Iceland",
    description: "Aurora Borealis dancing across the Arctic sky in brilliant green waves",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
    explorer: "Arctic Explorer",
    date: "2024-02-20",
    temperature: "-15°C"
  },
  {
    id: 3,
    title: "Sahara Desert Dunes",
    location: "Morocco",
    description: "Golden sand dunes stretching endlessly toward the horizon at sunset",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop",
    explorer: "Desert Wanderer",
    date: "2024-03-10",
    temperature: "45°C"
  },
  {
    id: 4,
    title: "Mount Fuji",
    location: "Japan",
    description: "Sacred mountain reflected perfectly in the still waters of Lake Kawaguchi",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop",
    explorer: "Mountain Climber",
    date: "2024-04-05",
    elevation: "3,776m"
  },
  {
    id: 5,
    title: "Amazon Rainforest",
    location: "Brazil",
    description: "Dense canopy of the world's largest tropical rainforest",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    explorer: "Jungle Guide",
    date: "2024-05-12",
    humidity: "95%"
  },
  {
    id: 6,
    title: "Norwegian Fjords",
    location: "Norway",
    description: "Dramatic cliffs and pristine waters of Geirangerfjord",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    explorer: "Nordic Adventurer",
    date: "2024-06-18",
    depth: "260m"
  }
];

exports.handler = async (event, context) => {
  const pathSegments = event.path.split('/');
  const photoId = pathSegments[pathSegments.length - 1];
  
  if (photoId && !isNaN(photoId)) {
    const photo = explorationPhotos.find(p => p.id === parseInt(photoId));
    if (!photo) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Photo not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(photo)
    };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    body: JSON.stringify(explorationPhotos)
  };
};