// Simple Frontend JavaScript for GitHub Pages
class ExplorationGallery {
    constructor() {
        this.photoGrid = document.getElementById('photoGrid');
        this.serverInfo = document.getElementById('server-id');
        this.photos = this.getPhotosData();
        this.init();
    }

    getPhotosData() {
        return [
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
    }

    async init() {
        this.renderPhotos();
        this.updateServerInfo();
        this.startAnimations();
    }

    updateServerInfo() {
        const servers = ['GitHub-CDN-US', 'GitHub-CDN-EU', 'GitHub-CDN-ASIA'];
        const randomServer = servers[Math.floor(Math.random() * servers.length)];
        this.serverInfo.textContent = `GitHub Pages | ${randomServer} | Status: Active`;
    }

    renderPhotos() {
        this.photoGrid.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const photoCard = this.createPhotoCard(photo, index);
            this.photoGrid.appendChild(photoCard);
        });
    }

    createPhotoCard(photo, index) {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => this.showPhotoDetails(photo);

        card.innerHTML = `
            <div class="photo-image">
                <img src="${photo.image}" alt="${photo.title}" loading="lazy" />
                <div class="photo-overlay"></div>
            </div>
            <div class="photo-content">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-location">📍 ${photo.location}</div>
                <div class="photo-description">${photo.description}</div>
                ${this.renderPhotoDetails(photo)}
                <div class="photo-meta">
                    <span>By: ${photo.explorer}</span>
                    <span>${new Date(photo.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;

        return card;
    }

    renderPhotoDetails(photo) {
        let details = '<div class="photo-details">';
        
        if (photo.elevation) details += `<span>⛰️ ${photo.elevation}</span>`;
        if (photo.temperature) details += `<span>🌡️ ${photo.temperature}</span>`;
        if (photo.depth) details += `<span>🌊 ${photo.depth}</span>`;
        if (photo.humidity) details += `<span>💧 ${photo.humidity}</span>`;
        
        details += '</div>';
        return details;
    }

    showPhotoDetails(photo) {
        const details = `
🌍 ${photo.title}
📍 Location: ${photo.location}
👤 Explorer: ${photo.explorer}
📅 Date: ${new Date(photo.date).toLocaleDateString()}
${photo.elevation ? `⛰️ Elevation: ${photo.elevation}` : ''}
${photo.temperature ? `🌡️ Temperature: ${photo.temperature}` : ''}
${photo.depth ? `🌊 Depth: ${photo.depth}` : ''}
${photo.humidity ? `💧 Humidity: ${photo.humidity}` : ''}

📝 ${photo.description}
        `;
        
        alert(details);
    }

    startAnimations() {
        // Update server info every 30 seconds to simulate load balancing
        setInterval(() => {
            this.updateServerInfo();
        }, 30000);

        // Add some interactive effects
        this.addInteractiveEffects();
    }

    addInteractiveEffects() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.photo-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                } else {
                    card.style.transform = '';
                }
            });
        });
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExplorationGallery();
});

// Add some visual flair
document.addEventListener('DOMContentLoaded', () => {
    // Animate stats on load
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
});