const mapContainer = document.getElementById('campus-map');

if (mapContainer) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
        const map = L.map('campus-map').setView([31.3965, 76.4783], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const locations = [
            { name: 'Main Building', lat: 31.3965, lng: 76.4783, icon: '🏛️' },
            { name: 'Library', lat: 31.3958, lng: 76.4790, icon: '📚' },
            { name: 'Hostel Area', lat: 31.3950, lng: 76.4770, icon: '🏠' },
            { name: 'Sports Complex', lat: 31.3972, lng: 76.4765, icon: '⚽' },
            { name: 'Cafeteria', lat: 31.3962, lng: 76.4795, icon: '🍽️' },
            { name: 'Computer Center', lat: 31.3968, lng: 76.4778, icon: '💻' }
        ];

        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng]).addTo(map);
            marker.bindPopup(`<b>${loc.icon} ${loc.name}</b>`);
        });
    };
    document.head.appendChild(script);
}
